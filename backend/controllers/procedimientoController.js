const db = require('../config/database');

exports.getProcedimientos = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM procedimiento`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getManual = async (req, res) => {
  try {
    const query = `SELECT ProceId, NombreProce FROM procedimiento`;
    const [row] = await db.query(query);
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearProcedimiento = async (req, res) => {
  const p = req.body;
  try {
    const query = `INSERT INTO procedimiento (NombreProce, Proposito, Alcance, Materiales, Instrucciones, Precauciones, Tolerancia, Activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [p.NombreProce, p.Proposito, p.Alcance, p.Materiales, p.Instrucciones, p.Precauciones, p.Tolerancia, 1];
    await db.query(query, values);
    res.json({ success: true, message: "Procedimiento agregado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.actualizarProcedimiento = async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    const query = `UPDATE procedimiento SET NombreProce = ?, Proposito = ?, Alcance = ?, Materiales = ?, Instrucciones = ?, Precauciones = ?, Tolerancia = ? WHERE ProceId = ?`;
    await db.query(query, [p.NombreProce, p.Proposito, p.Alcance, p.Materiales, p.Instrucciones, p.Precauciones, p.Tolerancia, id]);
    res.json({ success: true, message: "Procedimiento actualizado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};