const db = require('../config/database'); // Importas la conexión
const bcrypt = require("bcrypt"); //[cite: 8]
const jwt = require("jsonwebtoken"); //[cite: 8]
const SECRET_KEY = "Nidec_QGage_2024_Secret"; //[cite: 8]

exports.login = async (req, res) => {
  const { usuario, password } = req.body; //[cite: 8]

  try {
    const query = "SELECT * FROM usuarios WHERE Usuario = ?"; //[cite: 8]
    const [rows] = await db.query(query, [usuario]); //[cite: 8]

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" }); //[cite: 8]
    }

    const user = rows[0];
    const coinciden = await bcrypt.compare(password, user.Password); //[cite: 8]

    if (coinciden) {
      delete user.Password; //[cite: 8]
      const token = jwt.sign(
        { userId: user.UserID, rol: user.Rol },
        SECRET_KEY,
        { expiresIn: "24h" }
      ); //[cite: 8]

      res.json({ success: true, token: token, user: user }); //[cite: 8]
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" }); //[cite: 8]
    }
  } catch (error) {
    console.error("Error en login:", error); //[cite: 8]
    res.status(500).json({ error: "Error interno del servidor" }); //[cite: 8]
  }
};