const db = require('../config/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta exacta de tu logo
const logoPath = path.join(__dirname, '../assets/Nidec Institutional Logo_Original Version.png');

// Función auxiliar para obtener datos según el reporte
const obtenerDatosReporte = async (tipo, search, inicio, fin) => {
    // La base de la consulta: Traemos el Maestro de Gages y su última calibración
    let query = `
        SELECT 
            g.GageSerie, 
            g.Descripcion, 
            c.FechaCalibracion, 
            c.FechaProxima, 
            c.EstatusPasa,
            u.Usuario as Tecnico
        FROM gage_master g
        LEFT JOIN (
            /* Obtenemos solo la última calibración de cada Gage */
            SELECT * FROM calibracion 
            WHERE CalibracionId IN (SELECT MAX(CalibracionId) FROM calibracion GROUP BY GagesId)
        ) c ON g.GageId = c.GagesId
        LEFT JOIN usuarios u ON c.CalibracionBy = u.UserID
        WHERE 1=1
    `;
    const params = [];

    // 1. Filtro de Búsqueda (NID o Descripción) - Como tu buscador del front
    if (search) {
        query += " AND (g.GageSerie LIKE ? OR g.Descripcion LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    // 2. Filtro por Tipo de Reporte (La lógica de tus tarjetas del front)
    if (tipo === 'Vencidos') {
        // Gages cuya fecha próxima ya pasó
        query += " AND c.FechaProxima < CURDATE()";
    } else if (tipo === 'Próximas') {
        // Gages que vencen en los próximos 30 días (tu lógica de 'prox < 30')
        query += " AND c.FechaProxima BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
    } else if (tipo === 'Calibraciones') {
        // Reporte general de calibraciones realizadas
        query += " AND c.FechaCalibracion IS NOT NULL";
    }

    // 3. Filtro por Rango de Fechas (Si el usuario usó los calendarios)
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

        // 1. Insertar Logo
        const imageId = workbook.addImage({
            filename: logoPath,
            extension: 'png',
        });
        sheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 150, height: 85 } });

        // 2. Encabezados de tabla (Fila 4 para no tapar el logo)
        sheet.getRow(6).values = ['Gage NID', 'Descripción', 'Última Calib.', 'Próxima Calib.', 'Estatus', 'Certificado'];
        sheet.getRow(6).font = { bold: true };
        sheet.getRow(6).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FF009B4A'} }; // Verde Nidec
        sheet.getRow(6).font = { color: { argb: 'FFFFFFFF' }, bold: true };

        // 3. Llenar datos
        datos.forEach((item, index) => {
            sheet.addRow([
                item.GageSerie,
                item.Descripcion,
                item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
                item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
                item.EstatusPasa === 1 ? 'PASA' : 'FALLA',
                item.FolioCertificado || 'N/A'
            ]);
        });

        sheet.getColumn(2).width = 40; // Ancho para descripción
        sheet.getColumn(1).width = 15;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Reporte_Nidec_${tipo}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en Excel');
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
        if (tipo === 'Calibraciones') {
            // Columnas para historial de calibración
            doc.text('Gage ID', 30, y);
            doc.text('Fecha Calib.', 120, y);
            doc.text('Próxima', 220, y);
            doc.text('Técnico', 320, y);
            doc.text('Estatus', 500, y);
        } else {
            // Columnas generales (como las tienes ahora)
            doc.text('Gage ID', 30, y);
            doc.text('Descripción', 120, y);
            doc.text('Estatus', 500, y);
        }

        y += 25;
        doc.font('Helvetica').fillColor('#333333').fontSize(9);

        // --- DATOS DINÁMICOS ---
        datos.forEach(item => {
            if (y > 700) { doc.addPage(); y = 50; }

            if (tipo === 'Calibraciones') {
                doc.text(item.GageSerie || '', 30, y);
                doc.text(item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A', 120, y);
                doc.text(item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A', 220, y);
                doc.text(item.Tecnico || 'N/A', 320, y);
                doc.text(item.EstatusPasa === 1 ? 'OK' : 'PENDIENTE', 500, y);
            } else {
                doc.text(item.GageSerie || '', 30, y);
                doc.text(item.Descripcion ? item.Descripcion.substring(0, 60) : '', 120, y, { width: 350 });
                doc.text(item.EstatusPasa === 1 ? 'OK' : 'PENDIENTE', 500, y);
            }
            y += 20;
        });

        doc.end();
    } catch (error) {
        res.status(500).send('Error');
    }
};