const db = require('../config/database');

exports.ObtenerPatrones = async (req, res) => {
    try{
        const [rows] = await db.query (`SELECT * FROM patrones_maestro`);
        res.json(rows);
    } catch (error){
        console.error('Error al obtener patrones', error);
        res.status(500).json({message: 'Error al obtener datos'});
    }
};

exports.crearPatrones = async (req, res) => {
    const {PatronId, CodigoPatron, Descripcion, FechaVencimiento, Estatus} = req.body;
    try {
        const query = `INSERT INTO patrones_maestro (PatronId, CodigoPatron, Descripcion, FechaVencimiento, Estatus)
        VALUES (?, ?, ?, ?, ?) 
        `;
        await db.query(query, [PatronId, CodigoPatron, Descripcion, FechaVencimiento, Estatus]);
        res.json ({message: 'Patron creado correctamente' })
    } catch (error) {
        console.error('Error al crear Patron:', error);
        res.status(500).json({ message: 'Error al crear Patron' });
    }
};

exports.editarPatrones = async (req, res) => {
    const { id } = req.params;
    const {PatronId, CodigoPatron, Descripcion, FechaVencimiento, Estatus} = req.body;
    try {
        const query = `UPDATE patrones_maestro set CodigoPatron = ?, Descripcion = ?, FechaVencimiento = ?, Estatus = ?
        WHERE PatronId = ?`
        await db.query(query, [CodigoPatron, Descripcion, FechaVencimiento, Estatus, id]);
        res.json ({message: 'Patron editado correctamente' })
    } catch (error) {
        console.error('Error al actualizar Patron:', error);
        res.status(500).json({ message: 'Error al actualizar Patron' });
    }
};

exports.eliminarPatrones = async (req, res) =>{
     const { id } = req.params;
     try {
        const query = `DELETE FROM patrones_maestro WHERE PatronId = ?`;
        await db.query(query, [id]);
        res.json({ message: "Patron eliminado con éxito" });
     } catch (error) {
        console.error('Error al eliminar Patron:', error);
        res.status(500).json({ message: 'Error al eliminar Patron' });
     }
};