const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nidec_gages",
  })
  .promise(); // Usamos .promise() para usar async/await

//===============================
//=========== RUTAS =============
//===============================

// ==== API DE USUARIOS ====

//-- OBTENER USUARIOS CON PERMISOS ---
app.get("/api/usuarios", async (req, res) => {
  try {
    // Es mejor pedir las columnas específicas para estar seguros
    const [rows] = await db.query(`
      SELECT 
        UserID, Usuario, Rol, 
        edit_gage, edit_calibracion, edit_reportes, edit_procedimientos,
        ver_gage, ver_calibracion, ver_reportes, ver_procedimientos 
      FROM usuarios
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//-- ACTUALIZAR PERMISOS DE USUARIO ---
app.put("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const p = req.body; // Aquí vienen los true/false de Quasar

  try {
    const query = `
      UPDATE usuarios SET 
        edit_gage = ?, edit_calibracion = ?, edit_reportes = ?, edit_procedimientos = ?,
        ver_gage = ?, ver_calibracion = ?, ver_reportes = ?, ver_procedimientos = ?
      WHERE UserID = ?
    `;

    // MySQL convertirá automáticamente true/false a 1/0
    await db.query(query, [
      p.edit_gage,
      p.edit_calibracion,
      p.edit_reportes,
      p.edit_procedimientos,
      p.ver_gage,
      p.ver_calibracion,
      p.ver_reportes,
      p.ver_procedimientos,
      id,
    ]);

    res.json({ message: "Permisos actualizados correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//======= PROCEDIMIENTOS ============

app.get("/api/procedimientos", async (req, res) => {
  try {
    // Es mejor pedir las columnas específicas para estar seguros
    const [rows] = await db.query(`
      SELECT 
        *
      FROM procedimiento
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//========= Gages ===========

//--- OBTENER GAGES ---
app.get("/api/gages", async (req, res) => {
  try {
    // Es mejor pedir las columnas específicas para estar seguros
    const [rows] = await db.query(`
      SELECT 
    gage_master.GageId, 
    gage_master.GageSerie, 
    gage_master.Descripcion, 
    gage_master.Vendedor, 
    gage_master.Tipo AS TipoId,        -- ID original para el select
    tipo_gage.NombreTipo AS Tipo, 
    gage_master.Estado AS EstadoId,    -- ID original para el select
    estado_gage.NombreEstado AS Estado, 
    gage_master.FechaCompra, 
    gage_master.FreqCalibracion AS FreqId, -- ID original para el select
    frecuencia_gage.NomFreq AS Frecuencia,
    gage_master.Usuario AS UsuarioId,
    usuarios.Usuario AS Usuario, 
    gage_master.Informacion, 
    gage_master.Ex_Int AS ExIntId,     -- ID original para el select
    externo_interno.Nombre_extint, 
    gage_master.Act_Inact, 
    gage_master.Locacion, 
    gage_master.ProcedimientoId,
    procedimiento.NombreProce AS Procedimiento
    FROM gage_master
    INNER JOIN procedimiento ON gage_master.ProcedimientoId = procedimiento.ProceId
    INNER JOIN usuarios ON gage_master.Usuario = usuarios.UserID
    INNER JOIN tipo_gage ON gage_master.Tipo = tipo_gage.TipoGageId
    INNER JOIN estado_gage ON gage_master.Estado = estado_gage.EstadoId
    INNER JOIN externo_interno ON gage_master.Ex_Int = externo_interno.Ext_IntId
    INNER JOIN frecuencia_gage ON gage_master.FreqCalibracion = frecuencia_gage.FreqId
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//--- AGREGAR NUEVO GAGE ---
app.post("/api/gages", async (req, res) => {
  const gage = req.body; // Aquí vienen los datos del nuevo gage desde Quasar
  try {
    const query = `
      INSERT INTO gage_master 
      (GageSerie, Descripcion, Vendedor, Tipo, Estado, FechaCompra, FreqCalibracion, Usuario, Informacion, Ex_Int, Act_Inact, Locacion, ProcedimientoId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      gage.GageSerie,
      gage.Descripcion,
      gage.Vendedor,
      gage.Tipo,
      gage.Estado,
      gage.FechaCompra,
      gage.FreqCalibracion,
      gage.Usuario,
      gage.Informacion,
      gage.Ex_Int,
      gage.Act_Inact,
      gage.Locacion,
      gage.ProcedimientoId,
    ]);
    res.json({ message: "Gage agregado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//--- ACTUALIZAR GAGE EXISTENTE ---

app.put("/api/gages/:id", async (req, res) => {
  const { id } = req.params;
  const p = req.body;

  const toInt = (val) => {
    const parsed = parseInt(val);
    return isNaN(parsed) ? null : parsed; // Si no es número, mandamos NULL para que falle la DB y sepamos dónde
  };

  try {
    const query = `
      UPDATE gage_master SET 
        GageSerie = ?, Descripcion = ?, Vendedor = ?, 
        Tipo = ?, Estado = ?, FechaCompra = ?, FreqCalibracion = ?, 
        Usuario = ?, Informacion = ?, Ex_Int = ?, Act_Inact = ?, 
        Locacion = ?, ProcedimientoId = ?
      WHERE GageId = ? 
    `;

    // El orden debe ser EXACTO al de la query de arriba
    const values = [
      p.GageSerie,
      p.Descripcion,
      p.Vendedor,
      toInt(p.Tipo),
      toInt(p.Estado),
      p.FechaCompra,
      toInt(p.FreqCalibracion),
      toInt(p.Usuario),
      p.Informacion,
      toInt(p.Ex_Int),
      toInt(p.Act_Inact),
      p.Locacion,
      toInt(p.ProcedimientoId),
      id,
    ];

    await db.query(query, values);
    res.json({ message: "OK" });
  } catch (error) {
    console.error("Error detallado:", error);
    res
      .status(500)
      .json({ error: "Error en la base de datos", detalle: error.sqlMessage });
  }
});

// --- ACTUALIZAR SOLO EL ESTADO (Desde el botón de la tabla) ---
app.put("/api/gages/status/:id", async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // Recibe el 1 o el 2 desde Quasar

  try {
    // Solo actualizamos Act_Inact
    const query = "UPDATE gage_master SET Act_Inact = ? WHERE GageId = ? ";

    await db.query(query, [activo, id]);

    res.json({ message: "Estado del Gage actualizado con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "No se pudo actualizar el estado en la base de datos" });
  }
});

// Otras rutas para gages, calibraciones, reportes, procedimientos, etc. se agregarían aquí siguiendo el mismo patrón

// --- ENCENDER SERVIDOR ---
app.listen(3000, () => {
  console.log("Servidor unificado corriendo en el puerto 3000");
});
