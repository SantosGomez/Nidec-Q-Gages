const db = require('../config/database');

exports.getPrestamos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT prestamo.PrestamoId, prestamo.NoEmpleado, prestamo.Nombre, prestamo.GageId, 
      gage_master.GageSerie, gage_master.Descripcion, prestamo.HPrestamo, prestamo.HDevolucion,
      prestamo.TurnoId, turno.TurnoNombre, prestamo.Area
      FROM prestamo
      INNER JOIN gage_master ON prestamo.GageId = gage_master.GageId
      INNER JOIN turno ON prestamo.TurnoId = turno.TurnoId;
    `); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};

exports.getAreas = async (req, res) => {
  try {
    const [row] = await db.query(`SELECT DISTINCT Area from prestamo WHERE Area IS NOT NULL ORDER BY Area ASC`); //[cite: 8]
    res.json(row.map((r) => r.Area)); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};

exports.crearPrestamo = async (req, res) => {
  const p = req.body; //[cite: 8]
  try {
    const query = `INSERT INTO prestamo (NoEmpleado, Nombre, GageId, TurnoId, Area, HPrestamo) VALUES (?, ?, ?, ?, ?, NOW())`; //[cite: 8]
    const gagesArray = Array.isArray(p.GageId) ? p.GageId : [p.GageId]; //[cite: 8]

    for (const idGage of gagesArray) {
      const values = [Number(p.NoEmpleado) || 0, p.Nombre || "Sin Nombre", Number(idGage) || 0, Number(p.TurnoId) || 0, p.Area || "N/A"]; //[cite: 8]
      await db.query(query, values); //[cite: 8]
    }
    res.json({ message: "Préstamo registrado correctamente" }); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error desconocido" }); //[cite: 8]
  }
};

exports.actualizarPrestamo = async (req, res) => {
  const { id } = req.params;
  const p = req.body || {}; // Aseguramos que 'p' sea al menos un objeto vacío
  
  try {
    // Si no viene Nombre, asumimos que es una devolución (HDevolucion)
    if (!p.Nombre) {
      const [result] = await db.query(
        `UPDATE prestamo SET HDevolucion = NOW() WHERE PrestamoId = ?`, 
        [id]
      );
      return res.json({ message: "Devolución exitosa" });
    }

    // Si SÍ viene Nombre, es una edición normal
    const queryUpdate = `UPDATE prestamo SET NoEmpleado = ?, Nombre = ?, GageId = ?, TurnoId = ?, Area = ? WHERE PrestamoId = ?`;
    const values = [p.NoEmpleado, p.Nombre, p.GageId, p.TurnoId, p.Area, id];
    
    await db.query(queryUpdate, values);
    res.json({ message: "Préstamo actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la base de datos", detalle: error.message });
  }
};