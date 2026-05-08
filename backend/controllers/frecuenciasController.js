const db = require('../config/database');

exports.obtenerFrecuencia = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM frecuencia_gage`); 
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener Frecuencia:', error);
    res.status(500).json({ message: 'Error al obtener Frecuencia' });
  }
};

exports.crearFrecuencia = async (req, res) => {
    const {FreqId, NomFreq, ValorMeses} = req.body;
    try {
        const query = `INSERT INTO  frecuencia_gage (FreqId, NomFreq, ValorMeses) VALUES (?, ?, ?)`;
        await db.query(query, [FreqId, NomFreq, ValorMeses]);
        res.json({ message: "Frecuencia creado con éxito" });
    }
    catch (error) {
        console.error('Error al crear Frecuencia:', error);
        res.status(500).json({ message: 'Error al crear Frecuencia' });
    }
};

exports.editarFrecuencia = async (req, res) => {
    const { id } = req.params;
    const { FreqId, NomFreq, ValorMeses } = req.body;
    try {
        const query = `UPDATE frecuencia_gage SET NomFreq = ?, ValorMeses = ? WHERE FreqId = ?`;
        await db.query(query, [NomFreq, ValorMeses, id]);
        res.json({ message: "Frecuencia actualizado con éxito" });
    }
    catch (error) {
        console.error('Error al actualizar Frecuencia:', error);
        res.status(500).json({ message: 'Error al actualizar Frecuencia' });
    }
};

exports.eliminarFrecuencia = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM frecuencia_gage WHERE FreqId = ?`;
        await db.query(query, [id]);
        res.json({ message: "Frecuencia eliminado con éxito" });
    }
    catch (error) {
        console.error('Error al eliminar Frecuencia:', error);
        res.status(500).json({ message: 'Error al eliminar Frecuencia' });
    }
};
