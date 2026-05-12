const db = require('../config/database');

const crearPlantilla = async (req, res) => {
    // 1. Recibimos TurnoId en lugar de Linea
    const { NombrePlantilla, Area, TurnoId, GagesSeleccionados } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 2. Ajuste en el INSERT del Maestro (quitamos Linea, agregamos TurnoId)
        const [maestro] = await connection.query(
            'INSERT INTO plantillas_maestro (NombrePlantilla, Area, TurnoId) VALUES (?, ?, ?)',
            [NombrePlantilla, Area, TurnoId]
        );
        
        const plantillaId = maestro.insertId;

        const valoresDetalle = GagesSeleccionados.map(gageId => [plantillaId, gageId]);
        await connection.query(
            'INSERT INTO plantillas_detalle (PlantillaId, GageId) VALUES ?',
            [valoresDetalle]
        );

        await connection.commit();
        res.status(201).json({ message: 'Plantilla creada con éxito', id: plantillaId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error al crear la plantilla' });
    } finally {
        connection.release();
    }
};

const obtenerPlantillas = async (req, res) => {
    try {
        // 3. Agregamos JOIN con la tabla turno para mostrar el nombre en el frontend
        const [rows] = await db.query(`
            SELECT p.*, t.TurnoNombre 
            FROM plantillas_maestro p
            LEFT JOIN turno t ON p.TurnoId = t.TurnoId
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener plantillas' });
    }
};
const obtenerPlantillaPorId = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        
        const [maestro] = await connection.query(
            'SELECT * FROM plantillas_maestro WHERE PlantillaId = ?', 
            [id]
        );

        if (maestro.length === 0) {
            return res.status(404).json({ message: 'La plantilla solicitada no existe.' });
        }

        const [detalles] = await connection.query(
            'SELECT GageId FROM plantillas_detalle WHERE PlantillaId = ?', 
            [id]
        );

        res.json({
            ...maestro[0],
            detalles: detalles 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al consultar la plantilla.' });
    } finally {
        if (connection) connection.release(); // Crucial para no agotar el pool de conexiones
    }
};

const eliminarPlantilla = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM plantillas_maestro WHERE PlantillaId = ?', [id]);
        res.json({ message: 'Plantilla eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};

module.exports = {
    crearPlantilla,
    obtenerPlantillas,
    obtenerPlantillaPorId,
    eliminarPlantilla
};