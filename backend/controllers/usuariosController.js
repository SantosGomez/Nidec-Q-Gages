const db = require('../config/database');
const bcrypt = require("bcrypt"); //

exports.getUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM usuarios`); //
    res.json(rows); //
  } catch (error) {
    res.status(500).json({ error: error.message }); //
  }
};

exports.updatePermisos = async (req, res) => {
  const { id } = req.params; 
  const p = req.body; 

  try {
    const query = `
      UPDATE usuarios SET 
        Usuario = ?, Rol = ?, edit_gage = ?, edit_gageId = ?, edit_calibracion = ?, edit_reportes = ?, edit_procedimientos = ?, edit_prestamo = ?,
        ver_prestamo = ?, ver_gage = ?, ver_calibracion = ?, ver_reportes = ?, ver_procedimientos = ?
      WHERE UserID = ?
    `; 
    await db.query(query, [p.Usuario, p.Rol, p.edit_gage, p.edit_gageId, p.edit_calibracion, p.edit_reportes, p.edit_procedimientos, p.edit_prestamo, p.ver_prestamo, p.ver_gage, p.ver_calibracion, p.ver_reportes, p.ver_procedimientos, id]); 
    res.json({ message: "Permisos actualizados correctamente" }); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

exports.registrarUsuario = async (req, res) => {
  const { Usuario, Password, Rol, edit_gage, edit_gageId, edit_calibracion, edit_reportes, edit_procedimientos, edit_prestamo, ver_prestamo, ver_gage, ver_calibracion, ver_reportes, ver_procedimientos } = req.body; 
  try {
    if (!Password) return res.status(400).json({ success: false, error: "Password es requerido" }); 
    
    const saltRounds = 10; 
    const hashedPass = await bcrypt.hash(Password, saltRounds); 

    const query = `INSERT INTO usuarios (Usuario, Password, Rol, edit_gage, edit_gageId, edit_calibracion, edit_reportes, edit_procedimientos, edit_prestamo, ver_prestamo, ver_gage, ver_calibracion, ver_reportes, ver_procedimientos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
    const values = [Usuario, hashedPass, Rol, edit_gage || 0, edit_gageId || 0, edit_calibracion || 0, edit_reportes || 0, edit_procedimientos || 0, edit_prestamo || 0, ver_prestamo || 0, ver_gage || 0, ver_calibracion || 0, ver_reportes || 0, ver_procedimientos || 0]; 
    await db.query(query, values); 

    res.json({ success: true, message: "Usuario creado con éxito en el sistema Q-GAGE" }); 
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno al procesar el registro" }); 
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params; 
  const { Password } = req.body; 

  try {
    if (!Password) return res.status(400).json({ error: "La nueva contraseña es requerida" }); 
    const saltRounds = 10; 
    const hashedPass = await bcrypt.hash(Password, saltRounds); 
    const query = "UPDATE usuarios SET Password = ? WHERE UserID = ?"; 
    await db.query(query, [hashedPass, id]); 

    res.json({ success: true, message: "Contraseña reseteada con éxito" }); 
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" }); 
  }
};