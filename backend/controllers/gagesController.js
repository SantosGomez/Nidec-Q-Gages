const db = require('../config/database');

exports.getGages = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        gage_master.GageId, gage_master.GageSerie, gage_master.Descripcion, gage_master.Vendedor, 
        gage_master.Tipo AS TipoId, tipo_gage.NombreTipo AS Tipo, 
        gage_master.Estado AS EstadoId, estado_gage.NombreEstado AS Estado, 
        gage_master.FechaAlta, gage_master.FreqCalibracion AS FreqId, frecuencia_gage.NomFreq AS Frecuencia,
        gage_master.Usuario AS UsuarioId, usuarios.Usuario AS Usuario, 
        gage_master.Informacion, gage_master.Ex_Int AS ExIntId, externo_interno.Nombre_extint, 
        gage_master.Act_Inact, gage_master.Locacion, gage_master.ProcedimientoId,
        procedimiento.NombreProce AS Procedimiento, gage_master.Marca, gage_master.Modelo,
        gage_master.Codigo, gage_master.Serie, gage_master.Rango, gage_master.Resolucion,
        gage_master.OrdenCompra, gage_master.PlantillaNombre
      FROM gage_master
      INNER JOIN procedimiento ON gage_master.ProcedimientoId = procedimiento.ProceId
      INNER JOIN usuarios ON gage_master.Usuario = usuarios.UserID
      INNER JOIN tipo_gage ON gage_master.Tipo = tipo_gage.TipoGageId
      INNER JOIN estado_gage ON gage_master.Estado = estado_gage.EstadoId
      INNER JOIN externo_interno ON gage_master.Ex_Int = externo_interno.Ext_IntId
      INNER JOIN frecuencia_gage ON gage_master.FreqCalibracion = frecuencia_gage.FreqId
    `); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};

exports.getPlantillasNombres = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT GageTipo FROM plantilla_puntos ORDER BY GageTipo ASC"); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener nombres de plantillas" }); //[cite: 8]
  }
};

exports.crearGage = async (req, res) => {
  const p = req.body; //[cite: 8]
  try {
    const query = `INSERT INTO gage_master (GageSerie, Descripcion, PlantillaNombre, Vendedor, Tipo, Estado, FechaAlta, FreqCalibracion, Usuario, Informacion, Ex_Int, Act_Inact, Locacion, ProcedimientoId, Marca, Modelo, Codigo, Serie, Rango, Resolucion, OrdenCompra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; //[cite: 8]
    await db.query(query, [p.GageSerie, p.Descripcion, p.PlantillaNombre, p.Vendedor, p.Tipo, p.Estado, p.FechaAlta, p.FreqCalibracion, p.Usuario, p.Informacion, p.Ex_Int, p.Act_Inact, p.Locacion, p.ProcedimientoId, p.Marca, p.Modelo, p.Codigo, p.Serie, p.Rango, p.Resolucion, p.OrdenCompra]); //[cite: 8]
    res.json({ message: "Gage agregado correctamente" }); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};

exports.actualizarGage = async (req, res) => {
  const { id } = req.params; //[cite: 8]
  const p = req.body; //[cite: 8]
  const toInt = (val) => { const parsed = parseInt(val); return isNaN(parsed) ? null : parsed; }; //[cite: 8]

  try {
    const query = `UPDATE gage_master SET GageSerie = ?, Descripcion = ?, PlantillaNombre = ?, Vendedor = ?, Tipo = ?, Estado = ?, FechaAlta = ?, FreqCalibracion = ?, Usuario = ?, Informacion = ?, Ex_Int = ?, Act_Inact = ?, Locacion = ?, ProcedimientoId = ?, Marca = ?, Modelo = ?, Codigo = ?, Serie = ?, Rango = ?, Resolucion = ?, OrdenCompra = ? WHERE GageId = ?`; //[cite: 8]
    const values = [p.GageSerie, p.Descripcion, p.PlantillaNombre, p.Vendedor, toInt(p.Tipo), toInt(p.Estado), p.FechaAlta, toInt(p.FreqCalibracion), toInt(p.Usuario), p.Informacion, toInt(p.Ex_Int), toInt(p.Act_Inact), p.Locacion, toInt(p.ProcedimientoId), p.Marca, p.Modelo, p.Codigo, p.Serie, p.Rango, p.Resolucion, p.OrdenCompra, id]; //[cite: 8]
    await db.query(query, values); //[cite: 8]
    res.json({ message: "OK" }); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error en la base de datos", detalle: error.sqlMessage }); //[cite: 8]
  }
};

exports.actualizarStatus = async (req, res) => {
  const { id } = req.params; //[cite: 8]
  const { activo } = req.body; //[cite: 8]
  try {
    await db.query("UPDATE gage_master SET Act_Inact = ? WHERE GageId = ?", [activo, id]); //[cite: 8]
    res.json({ message: "Estado del Gage actualizado con éxito" }); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el estado en la base de datos" }); //[cite: 8]
  }
};

exports.getGagesDisponibles = async (req, res) => {
  try {
    const query = `SELECT GageId, GageSerie, Descripcion FROM gage_master WHERE GageId NOT IN (SELECT GageId FROM prestamo WHERE HDevolucion IS NULL) AND Act_Inact = 1`; //[cite: 8]
    const [rows] = await db.query(query); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};