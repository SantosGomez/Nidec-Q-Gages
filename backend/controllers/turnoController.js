const db = require('../config/database');

exports.obtenerTurno = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM turno`); 
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener turno:', error);
    res.status(500).json({ message: 'Error al obtener turno' });
  }
};

exports.crearTurno = async (req, res) => {
    const {TurnoId, TurnoNombre} = req.body;
    try {
        const query = `INSERT INTO turno (TurnoId, TurnoNombre) VALUES (?, ?)`;
        await db.query(query, [TurnoId, TurnoNombre]);
        res.json({ message: "Turno creado con éxito" });
    }
    catch (error) {
        console.error('Error al crear turno:', error);
        res.status(500).json({ message: 'Error al crear turno' });
    }
};

exports.editarTurno = async (req, res) => {
    const { id } = req.params;
    const { TurnoId, TurnoNombre } = req.body;
    try {
        const query = `UPDATE turno SET TurnoNombre = ? WHERE TurnoId = ?`;
        await db.query(query, [TurnoNombre, id]);
        res.json({ message: "Turno actualizado con éxito" });
    }
    catch (error) {
        console.error('Error al actualizar turno:', error);
        res.status(500).json({ message: 'Error al actualizar turno' });
    }
};

exports.eliminarTurno = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM turno WHERE TurnoId = ?`;
        await db.query(query, [id]);
        res.json({ message: "Turno eliminado con éxito" });
    }
    catch (error) {
        console.error('Error al eliminar turno:', error);
        res.status(500).json({ message: 'Error al eliminar turno' });
    }
};
