const db = require('../config/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta exacta de tu logo
const logoPath = path.join(__dirname, '../assets/Nidec Institutional Logo_Original Version.png');

// Función auxiliar para obtener datos según el reporte
const obtenerDatosReporte = async (tipo, search, inicio, fin) => {
    let query = `
        SELECT 
            g.GageSerie, 
            g.Descripcion, 
            c.FechaCalibracion, 
            c.FechaProxima, 
            c.EstatusPasa,
            c.FolioCertificado,
            u.Usuario as Tecnico,
            u.Usuario as CalibracionBy
        FROM gage_master g
        LEFT JOIN (
            SELECT * FROM calibracion 
            WHERE CalibracionId IN (SELECT MAX(CalibracionId) FROM calibracion GROUP BY GagesId)
        ) c ON g.GageId = c.GagesId
        LEFT JOIN usuarios u ON c.CalibracionBy = u.UserID
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        query += " AND (g.GageSerie LIKE ? OR g.Descripcion LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    // --- CAMBIO CLAVE: Sincronización con los 'value' de tu ReportsPage.vue ---
    
    if (tipo === 'Pendientes') {
        // Filtra solo los que ya vencieron (FechaProxima es menor a hoy)
        query += " AND c.FechaProxima < CURDATE()";
    } 
    else if (tipo === 'Proximos') {
        // Filtra los que vencen en los próximos 7 días (como tienes en tu front)
        query += " AND c.FechaProxima BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
    } 
    else if (tipo === 'SinCalibrar') {
        // Filtra equipos que nunca han sido calibrados
        query += " AND c.FechaCalibracion IS NULL";
    }
    else if (tipo === 'Historial' || tipo === 'General') {
        // Para historial o general, usualmente queremos los que sí tienen datos
        query += " AND c.FechaCalibracion IS NOT NULL";
    }

    if (inicio && fin) {
        query += " AND c.FechaCalibracion BETWEEN ? AND ?";
        params.push(inicio, fin);
    }

    const [rows] = await db.query(query, params);
    return rows;
};

exports.getExcelReport = async (req, res) => {
    try {
        const { tipo, search, inicio, fin } = req.query;
        const datos = await obtenerDatosReporte(tipo, search, inicio, fin);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reporte Nidec');

        // 1. Configuración del Logo
        const imageId = workbook.addImage({
            filename: logoPath,
            extension: 'png',
        });
        sheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 70 } });

        // 2. Definir Encabezados según el tipo
        let encabezados = [];
        switch (tipo) {
            case 'General':
                encabezados = ['Gage NID', 'Descripción', 'Última Calib.', 'Próxima Calib.', 'Estatus', 'Certificado'];
                break;
            case 'Historial':
                encabezados = ['Gage NID', 'Fecha de Cal.', 'Certificado', 'Realizado por', 'Resultado'];
                break;
            case 'Pendientes':
                encabezados = ['Gage NID', 'Descripción', 'Venció el', 'Días Vencidos', 'Certificado Anterior'];
                break;
            case 'Proximos':
                encabezados = ['Gage NID', 'Descripción', 'Vence el', 'Días Restantes'];
                break;
            case 'SinCalibrar':
                encabezados = ['Gage NID', 'Descripción', 'Estado'];
                break;
            default:
                encabezados = ['Gage NID', 'Descripción', 'Información'];
        }

        const headerRow = sheet.getRow(6);
        headerRow.values = encabezados;
        
        // Estilo del encabezado (Verde Nidec)
        headerRow.eachCell((cell) => {
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF009B4A' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // 3. Llenar Datos Dinámicamente
        datos.forEach((item) => {
            let fila = [];
            const hoy = new Date();
            const prox = item.FechaProxima ? new Date(item.FechaProxima) : null;
            const diasDiff = prox ? Math.ceil((prox - hoy) / (1000 * 60 * 60 * 24)) : 'N/A';

            switch (tipo) {
                case 'General':
                    fila = [
                        item.GageSerie,
                        item.Descripcion,
                        item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
                        item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
                        item.EstatusPasa === 1 ? 'PASA' : 'FALLA',
                        item.FolioCertificado || 'N/A'
                    ];
                    break;
                case 'Historial':
                    fila = [
                        item.GageSerie,
                        item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
                        item.FolioCertificado || 'N/A',
                        item.Tecnico || 'N/A',
                        item.EstatusPasa === 1 ? 'PASA' : 'FALLA'
                    ];
                    break;
                case 'Pendientes':
                    fila = [
                        item.GageSerie,
                        item.Descripcion,
                        item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
                        diasDiff < 0 ? Math.abs(diasDiff) : 0,
                        item.FolioCertificado || 'N/A'
                    ];
                    break;
                case 'Proximos':
                    fila = [
                        item.GageSerie,
                        item.Descripcion,
                        item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
                        diasDiff > 0 ? diasDiff : 0
                    ];
                    break;
                case 'SinCalibrar':
                    fila = [item.GageSerie, item.Descripcion, 'NUEVO / SIN REGISTRO'];
                    break;
            }
            sheet.addRow(fila);
        });

        // 4. Ajustes estéticos finales
        sheet.getColumn(1).width = 20; // Gage NID
        sheet.getColumn(2).width = 45; // Descripción
        sheet.autoFilter = { from: 'A6', to: { row: 6, column: encabezados.length } };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Reporte_${tipo}_${new Date().getTime()}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error en Excel:", error);
        res.status(500).send('Error al generar el archivo Excel');
    }
};

exports.getPDFReport = async (req, res) => {
    try {
        const { tipo, search, inicio, fin } = req.query;
        const datos = await obtenerDatosReporte(tipo, search, inicio, fin);

        const doc = new PDFDocument({ margin: 30, size: 'LETTER' });
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // --- ENCABEZADO ESTÁTICO ---
        doc.rect(0, 0, 612, 40).fill('#009B4A'); 
        doc.fillColor('white').fontSize(14).text('NIDEC Q-GAGE SYSTEM', 30, 15);
        if (logoPath) doc.image(logoPath, 30, 50, { width: 100 });
        doc.fillColor('#2c3e50').fontSize(18).text(tipo.toUpperCase(), 30, 110);
        doc.moveTo(30, 135).lineTo(580, 135).stroke('#009B4A');

        let y = 150;
        doc.fillColor('#009B4A').fontSize(10).font('Helvetica-Bold');

        // --- COLUMNAS DINÁMICAS ---
        switch (tipo) {
            case 'General':
                doc.text('Gage NID', 30, y);
                doc.text('Descripción', 150, y);
                doc.text('Estatus', 300, y);
                doc.text('Fecha de Calibración', 400, y);
                doc.text('Calibración', 500, y);
                break;
            case 'Historial':
                doc.text('Gage NID', 30, y);
                doc.text('Fecha de Cal.', 110, y);
                doc.text('Certificado', 200, y);
                doc.text('Realizado por', 350, y);
                doc.text('Resultado', 500, y);
                break;
            case 'Pendientes':
                doc.text('Gage NID', 50, y);
                doc.text('Descripción', 170, y);
                doc.text('Próxima Calibración', 300, y);
                doc.text('Días para calibrar', 450, y);
                break;
            case 'SinCalibrar':
                doc.text('Gage NID', 50, y);
                doc.text('Descripción', 170, y);
                doc.text('Estatus', 500, y);
                break;
            case 'Proximos':
                doc.text('Gage NID', 50, y);
                doc.text('Descripción', 170, y);
                doc.text('Próxima Calibración', 300, y);
                doc.text('Días para calibrar', 450, y);
                break;
            case 'Procedimiento':
                doc.text('Procedimiento', 30, y);
                doc.text('Gage NID', 150, y);
                doc.text('Descripción', 300, y);
                break;

            default:
                doc.text('Gage NID', 50, y);
                doc.text('Descripción', 170, y);
                doc.text('Estatus', 500, y);
        }

        y += 25;
        doc.font('Helvetica').fillColor('#333333').fontSize(9);

        // --- DATOS DINÁMICOS ---
        datos.forEach(item => {
            if (y > 700) { doc.addPage(); y = 50; }

            const estatus = item.EstatusPasa === 1 ? 'Aprobado' : 'No Aprobado';
            const calibStatus = item.FechaCalibracion === null ? 'Nuevo' : 'Calibrado';

            switch (tipo) {
                case 'General':
                    doc.text(item.GageSerie || 'N/A', 30, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 150, y);
                    doc.text(estatus, 300, y);
                    doc.text(item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'Sin Calibrar', 400, y);
                    doc.text(calibStatus, 500, y);
                    break;
                case 'Historial':
                    doc.text(item.GageSerie || '', 30, y);
                    doc.text(item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'Sin Calibrar', 110, y);
                    doc.text(item.FolioCertificado || 'N/A', 200, y);
                    doc.text(item.CalibracionBy || 'Sin Calibrar', 350, y);
                    doc.text(item.EstatusPasa === 1 ? 'PASA' : 'FALLA', 500, y);
                    break;
                case 'Pendientes':
                    doc.text(item.GageSerie || '', 50, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 170, y);
                    doc.text(item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A', 300, y);
                    const dias = item.FechaProxima ? Math.ceil((new Date(item.FechaProxima) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A';
                    doc.text(dias <= 0 ? dias : 'Calibrado', 450, y);
                    break;
                case 'SinCalibrar':
                    doc.text(item.GageSerie || '', 50, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 170, y);
                    doc.text('Sin Calibrar', 500, y);
                    break;
                case 'Proximos':
                    doc.text(item.GageSerie || '', 50, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 170, y);
                    doc.text(item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A', 300, y);
                    const diasProx = item.FechaProxima ? Math.ceil((new Date(item.FechaProxima) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A';
                    doc.text(diasProx >= 0 ? diasProx : 'Calibrado', 450, y);
                    break;
                case 'Procedimiento':
                    doc.text(item.NombreProce || '', 30, y);
                    doc.text(item.GageSerie || '', 150, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 300, y);
                    break;

                default:
                    doc.text(item.GageSerie || '', 50, y);
                    doc.text((item.Descripcion || '').substring(0, 50), 170, y);
                    doc.text(estatus, 500, y);
            }
            y += 15;
        });

        doc.end();
    } catch (error) {
        res.status(500).send('Error');
    }
};