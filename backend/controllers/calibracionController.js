const db = require('../config/database');

exports.getCalibraciones = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        g.GageId, g.GageSerie, g.Descripcion, c.CalibracionId, c.FolioCertificado, c.Resultado, 
        c.EstatusPasa, c.CalibracionBy, c.FechaProxima, c.FechaCalibracion, c.E_Pusados,
        c.Temperatura, c.Humedad, f.NomFreq, f.ValorMeses AS FreqMeses, p.NombreProce,
        p.Proposito, p.Alcance, p.Materiales, p.Precauciones, p.Tolerancia, p.Instrucciones,
        CASE WHEN c.CalibracionId IS NULL THEN 1 ELSE 0 END as EsNuevo 
      FROM gage_master g
      LEFT JOIN (SELECT * FROM calibracion WHERE CalibracionId IN (SELECT MAX(CalibracionId) FROM calibracion GROUP BY GagesId)) c ON g.GageId = c.GagesId
      INNER JOIN frecuencia_gage f ON f.FreqId = g.FreqCalibracion
      LEFT JOIN procedimiento p ON p.ProceId = g.ProcedimientoId
      ORDER BY EsNuevo DESC, c.FechaProxima ASC
    `); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" }); //[cite: 8]
  }
};

exports.getNuevos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT g.GageId, g.GageSerie, g.Descripcion, c.CalibracionId, c.FolioCertificado, c.Resultado, c.EstatusPasa, c.CalibracionBy, c.FechaProxima, c.FechaCalibracion, f.NomFreq, p.NombreProce, CASE WHEN c.CalibracionId IS NULL THEN 1 ELSE 0 END as EsNuevo FROM gage_master g LEFT JOIN (SELECT * FROM calibracion WHERE CalibracionId IN (SELECT MAX(CalibracionId) FROM calibracion GROUP BY GagesId)) c ON g.GageId = c.GagesId LEFT JOIN frecuencia_gage f ON f.FreqId = g.FreqCalibracion LEFT JOIN procedimiento p ON p.ProceId = g.ProcedimientoId ORDER BY EsNuevo DESC, c.FechaProxima ASC;
    `); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" }); //[cite: 8]
  }
};

exports.getDetalle = async (req, res) => {
  const { id } = req.params; //[cite: 8]
  try {
    const [rows] = await db.query(`
      SELECT cd.MedicionId, cd.PuntoNominal, cd.ToleranciaMin,cd.Categoria, cd.ToleranciaMax, cd.ValorLeido, cd.Diferencia, c.FolioCertificado, g.GageSerie, p.NombreProce FROM calibraciondtl cd INNER JOIN calibracion c ON c.CalibracionId = cd.CalibracionId INNER JOIN gage_master g ON g.GageId = c.GagesId LEFT JOIN procedimiento p ON p.ProceId = g.ProcedimientoId WHERE c.CalibracionId = ?
    `, [id]); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el detalle" }); //[cite: 8]
  }
};

exports.registrarCalibracion = async (req, res) => {
  const { GagesId, FechaCalibracion, Mediciones, EstatusPasa, CalibracionBy, FechaProxima, FolioCertificado, E_Pusados, Temperatura, Humedad } = req.body; //[cite: 8]
  const connection = await db.getConnection(); //[cite: 8]
  
  try {
    await connection.beginTransaction(); //[cite: 8]
    const sqlCabecera = `INSERT INTO calibracion (GagesId, FechaCalibracion, EstatusPasa, CalibracionBy, FechaProxima, FolioCertificado, E_Pusados, Temperatura, Humedad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`; //[cite: 8]
    const [result] = await connection.query(sqlCabecera, [GagesId, FechaCalibracion, EstatusPasa, CalibracionBy, FechaProxima, FolioCertificado, E_Pusados, Temperatura, Humedad]); //[cite: 8]
    const newId = result.insertId; //[cite: 8]

    const sqlDetalle = `INSERT INTO calibraciondtl (CalibracionId, Categoria, PuntoNominal, ToleranciaMin, ToleranciaMax, ValorLeido, Diferencia) VALUES (?, ?, ?, ?, ?, ?, ?)`; //[cite: 8]
    for (const med of Mediciones) {
      await connection.query(sqlDetalle, [newId, med.Categoria, med.PuntoNominal, med.ToleranciaMin || 0, med.ToleranciaMax || 0, med.ValorLeido || 0, med.Diferencia]); //[cite: 8]
    }

    const nuevoEstado = (EstatusPasa == 1) ? 1 : 2; //[cite: 8]
    await connection.query("UPDATE gage_master SET Estado = ? WHERE GageId = ?", [nuevoEstado, GagesId]); //[cite: 8]
    await connection.commit(); //[cite: 8]
    res.json({ success: true, message: "Registro guardado y Gage actualizado" }); //[cite: 8]
  } catch (error) {
    await connection.rollback(); //[cite: 8]
    res.status(500).json({ error: "Error al registrar: " + error.message }); //[cite: 8]
  } finally {
    connection.release(); //[cite: 8]
  }
};

exports.getHistorial = async (req, res) => {
  const { gageId } = req.params; //[cite: 8]
  try {
    const [rows] = await db.query(`SELECT c.CalibracionId, c.FechaCalibracion, c.FolioCertificado, c.EstatusPasa, c.CalibracionBy, p.NombreProce FROM calibracion c INNER JOIN gage_master gm ON c.GagesId = gm.GageId LEFT JOIN procedimiento p ON gm.ProcedimientoId = p.ProceId WHERE c.GagesId = ? ORDER BY c.FechaCalibracion DESC`, [gageId]); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial" }); //[cite: 8]
  }
};

exports.getCalibracionDetalle = async (req, res) => {
  const { CalibracionId } = req.params; //[cite: 8]
  try {
    const [rows] = await db.query("SELECT * FROM calibraciondtl WHERE CalibracionId = ?", [CalibracionId]); //[cite: 8]
    res.json(rows); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: "Error al obtener detalles" }); //[cite: 8]
  }
};

exports.actualizarCalibracion = async (req, res) => {
  const { id } = req.params; //[cite: 8]
  const { GagesId, FechaCalibracion, Resultado, EstatusPasa, CalibracionBy, FechaProxima, FolioCertificado, E_Pusados, Temperatura, Humedad, Mediciones } = req.body; //[cite: 8]
  const connection = await db.getConnection(); //[cite: 8]
  
  try {
    await connection.beginTransaction(); //[cite: 8]
    const sqlUpdateCabecera = `UPDATE calibracion SET FolioCertificado = ?, FechaCalibracion = ?, Resultado = ?, EstatusPasa = ?, CalibracionBy = ?, FechaProxima = ?, E_Pusados = ?, Temperatura = ?, Humedad = ? WHERE CalibracionId = ?`; //[cite: 8]
    await connection.query(sqlUpdateCabecera, [FolioCertificado, FechaCalibracion, Resultado, EstatusPasa, CalibracionBy, FechaProxima, E_Pusados, Temperatura, Humedad, id]); //[cite: 8]
    
    await connection.query("DELETE FROM calibraciondtl WHERE CalibracionId = ?", [id]); //[cite: 8]
    const sqlDetalleInsert = `INSERT INTO calibraciondtl (CalibracionId, Categoria, PuntoNominal, ToleranciaMin, ToleranciaMax, ValorLeido, Diferencia) VALUES (?, ?, ?, ?, ?, ?, ?)`; //[cite: 8]
    for (const med of Mediciones) {
      await connection.query(sqlDetalleInsert, [id, med.Categoria, med.PuntoNominal, med.ToleranciaMin || 0, med.ToleranciaMax || 0, med.ValorLeido || 0, med.Diferencia]); //[cite: 8]
    }
    
    const nuevoEstado = EstatusPasa == 1 ? 1 : 2; //[cite: 8]
    await connection.query("UPDATE gage_master SET Estado = ? WHERE GageId = ?", [nuevoEstado, GagesId]); //[cite: 8]
    await connection.commit(); //[cite: 8]
    res.json({ success: true, message: "Calibración y detalles actualizados" }); //[cite: 8]
  } catch (error) {
    await connection.rollback(); //[cite: 8]
    res.status(500).json({ error: error.message }); //[cite: 8]
  } finally {
    connection.release(); //[cite: 8]
  }
};

exports.prepararCalibracion = async (req, res) => {
  const { gageId } = req.params; //[cite: 8]
  try {
    const [gageRes] = await db.query("SELECT g.*, f.ValorMeses FROM gage_master g JOIN frecuencia_gage f ON g.FreqCalibracion = f.FreqId WHERE g.GageId = ?", [gageId]); //[cite: 8]
    if (!gageRes || gageRes.length === 0) return res.status(404).json({ error: "Gage no encontrado" }); //[cite: 8]
    const infoGage = gageRes[0]; //[cite: 8]
    
    const [puntos] = await db.query("SELECT * FROM plantilla_puntos WHERE GageTipo = ? ORDER BY Orden ASC", [infoGage.PlantillaNombre]); //[cite: 8]
    const [patrones] = await db.query("SELECT PatronId, CodigoPatron, Descripcion FROM patrones_maestro WHERE Estatus = 'Activo'"); //[cite: 8]
    res.json({ gage: infoGage, puntos: puntos || [], patrones: patrones || [] }); //[cite: 8]
  } catch (error) {
    res.status(500).json({ error: error.message }); //[cite: 8]
  }
};