const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "Nidec_QGage_2024_Secret"; // Usa una frase secreta segura

app.use(cors());
app.use(express.json());

// ===== CONFIGURACIÓN DE LA BASE DE DATOS =====

// ----- Configuracion de la Hora local --------
const getReynosaOffset = () => {
  const date = new Date();
  const localString = date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });
  const utcString = date.toLocaleString("en-US", { timeZone: "UTC" });
  const diffMinutes = Math.round(
    (new Date(localString) - new Date(utcString)) / 60000,
  );

  const sign = diffMinutes >= 0 ? "+" : "-";
  const absDiff = Math.abs(diffMinutes);
  const hours = String(Math.floor(absDiff / 60)).padStart(2, "0");
  const minutes = String(absDiff % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
};

const reynosaOffset = getReynosaOffset();

// ---- Conexion y comunicacion con la BD ----
const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nidec_gages",
    timezone: reynosaOffset,
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

//----- Agregar usuario nuevo ------

app.post("/api/usuarios/registro", async (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  try {
    // Generamos el "salt" y el hash
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(contrasena, saltRounds);

    const query = `INSERT INTO usuarios (Usuario, Contrasena, Rol) VALUES (?, ?, ?)`;
    await db.query(query, [usuario, hashedPass, rol]);

    res.json({ message: "Usuario creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======== API para Login =========

app.post("/api/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // 1. Buscamos al usuario por su nombre de usuario únicamente
    const query = "SELECT * FROM usuarios WHERE Usuario = ?";
    const [rows] = await db.query(query, [usuario]);

    // 2. Si no existe el usuario, mandamos error
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];

    // 3. Comparamos la contraseña que escribió Santos con el Hash de la DB
    // bcrypt.compare(texto_plano, hash_encriptado)
    const coinciden = await bcrypt.compare(password, user.Password);

    if (coinciden) {
      // 4. Si coinciden, quitamos la contraseña del objeto por seguridad antes de enviarlo
      delete user.Password;

      const token = jwt.sign(
        { userId: user.UserID, rol: user.Rol },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token: token,
        user: user // Aquí van todos tus permisos (edit_gage, etc.)
      });
    } else {
      // 5. Si no coinciden
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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

app.get("/api/gages/disponibles", async (req, res) => {
  try {
    // Buscamos Gages que NO tengan un préstamo activo (HDevolucion es null)
    const query = `
      SELECT GageId, GageSerie, Descripcion 
      FROM gage_master 
      WHERE GageId NOT IN (
        SELECT GageId FROM prestamo WHERE HDevolucion IS NULL
      ) AND Act_Inact = 1`;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======== Prestamos =========

// ----- Visualizar Prestamos -------
app.get("/api/prestamo", async (req, res) => {
  try {
    // Es mejor pedir las columnas específicas para estar seguros
    const [rows] = await db.query(`
      SELECT 
      prestamo.PrestamoId,
      prestamo.NoEmpleado, 
      prestamo.Nombre, 
      prestamo.GageId, 
      gage_master.GageSerie, 
      gage_master.Descripcion, 
      prestamo.HPrestamo, 
      prestamo.HDevolucion,
      prestamo.TurnoId,
      turno.TurnoNombre,
      prestamo.Area
      FROM prestamo
      INNER JOIN gage_master ON prestamo.GageId = gage_master.GageId
      INNER JOIN turno ON prestamo.TurnoId = turno.TurnoId;
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------- Para el filtro de Area --------

app.get("/api/prestamo/areas", async (req, res) => {
  try {
    const query = `
    SELECT DISTINCT Area from prestamo WHERE Area IS NOT NULL
    ORDER BY Area ASC
    `;
    const [row] = await db.query(query);
    const areas = row.map((r) => r.Area);
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------- Insertar Datos ----------------

app.post("/api/prestamo", async (req, res) => {
  const p = req.body;

  // LOG PARA DEPURAR (Vigila tu consola)
  console.log("Datos que llegan de Quasar:", p);

  try {
    const query = `
      INSERT INTO prestamo (NoEmpleado, Nombre, GageId, TurnoId, Area, HPrestamo) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    // FORZAMOS QUE NADA LLEGUE COMO UNDEFINED O NULL
    const values = [
      Number(p.NoEmpleado) || 0,
      p.Nombre || 'Sin Nombre',
      Number(p.GageId) || 0,
      Number(p.TurnoId) || 0,
      p.Area || 'N/A'
    ];

    await db.query(query, values);
    res.json({ message: "Préstamo registrado correctamente" });

  } catch (error) {
    console.error("Error en INSERT:", error.sqlMessage);
    // Si TurnoId sigue fallando, es porque p.TurnoId llegó vacío
    res.status(500).json({ error: error.sqlMessage || "Error desconocido" });
  }
});

//------- Actualizar Datos ----------

app.put("/api/prestamo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE prestamo 
      SET HDevolucion = NOW() 
      WHERE PrestamoId = ?
    `;
    await db.query(query, [id]);
    res.json({ message: "Devolución exitosa" });
  } catch (error) {
    console.error("Error en devolución:", error);
    res.status(500).json({
      error: "Error en la base de datos",
      detalle: error.sqlMessage || error.message,
    });
  }
});

// ============ Calibracion ===============

// --------- Ver Calibraciones ------------
app.get("/api/calibracion", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.CalibracionId,
        c.FolioCertificado, 
        c.GagesId, 
        g.GageSerie, 
        g.Descripcion,
        c.Resultado, 
        c.EstatusPasa, 
        c.CalibracionBy, 
        c.FechaProxima, 
        c.FechaCalibracion,
        f.NomFreq
      FROM calibracion c
      INNER JOIN gage_master g ON g.GageId = c.GagesId
      INNER JOIN frecuencia_gage f ON f.FreqId = g.FreqCalibracion
      ORDER BY c.FechaCalibracion DESC
      `);
    res.json(rows)
  } catch (error) {
    console.error("Error al obtener calibraciones:", error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
})

// ----- Insertar Nueva Calibracion -------

app.post("/api/registrar-calibracion", async (req, res) => {
  const {
    GageId,
    FechaCalibracion,
    Resultado,
    EstatusPasa,
    CalibracionBy,
    FechaProxima,
    CapturadoPor,
    FolioCertificado
  } = req.body;

  // Validación básica
  if (!GageId || !FechaCalibracion) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insertar registro
    const sqlInsert = `
      INSERT INTO calibracion 
      (GagesId, FolioCertificado, FechaCalibracion, Resultado, EstatusPasa, CalibracionBy, FechaProxima, CapturadoPor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await connection.query(sqlInsert, [
      GageId, FolioCertificado, FechaCalibracion, Resultado, EstatusPasa, CalibracionBy, FechaProxima, CapturadoPor
    ]);

    // 2. Actualizar Maestro de Gages
    // Nota: El ID del estado debe coincidir con tu tabla 'estado_gage'
    const nuevoEstado = (EstatusPasa === 1 || EstatusPasa === true) ? 1 : 2; 

    const sqlUpdate = `
      UPDATE gage_master 
      SET Estado = ?, ProximaCalibracion = ? 
      WHERE GageId = ?`;
    
    await connection.query(sqlUpdate, [nuevoEstado, FechaProxima, GageId]);

    await connection.commit();
    res.json({ success: true, message: "Historial guardado y Gage actualizado con éxito" });

  } catch (error) {
    await connection.rollback();
    console.error("Error en transacción de calibración:", error);
    res.status(500).json({ error: "No se pudo completar el registro" });
  } finally {
    connection.release();
  }
});


// --- ENCENDER SERVIDOR ---
app.listen(3000, () => {
  console.log("Servidor unificado corriendo en el puerto 3000");
});

