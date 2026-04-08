const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nidec_gages'
}).promise(); // Usamos .promise() para usar async/await

//===============================
//=========== RUTAS ============= 
//===============================

// ==== API DE USUARIOS ====

//-- OBTENER USUARIOS CON PERMISOS ---
app.get('/api/usuarios', async (req, res) => {
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
app.put('/api/usuarios/:id', async (req, res) => {
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
      p.edit_gage, p.edit_calibracion, p.edit_reportes, p.edit_procedimientos,
      p.ver_gage, p.ver_calibracion, p.ver_reportes, p.ver_procedimientos,
      id
    ]);

    res.json({ message: 'Permisos actualizados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//======= PROCEDIMIENTOS ============

app.get('/api/procedimientos', async (req, res) => {
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

// Otras rutas para gages, calibraciones, reportes, procedimientos, etc. se agregarían aquí siguiendo el mismo patrón

// --- ENCENDER SERVIDOR ---
app.listen(3000, () => {
  console.log('Servidor unificado corriendo en el puerto 3000');
});