const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const gagesRoutes = require("./routes/gagesRoutes");
const prestamosRoutes = require("./routes/prestamosRoutes");
const procedimientoRoutes = require("./routes/procedimientoRoutes");
const calibracionRoutes = require("./routes/calibracionesRoutes");
const reportRoutes = require('./routes/reportesRoutes');

//============= RUTAS =============
app.use("/api", authRoutes); // Manejará /api/login
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/gages", gagesRoutes);
app.use("/api/prestamo", prestamosRoutes);
app.use("/api/procedimiento", procedimientoRoutes);
app.use("/api/calibracion", calibracionRoutes);
app.use('/api/reportes', reportRoutes);

// --- ENCENDER SERVIDOR ---
app.listen(3000, () => {
  console.log("Servidor unificado corriendo en el puerto 3000");
});
