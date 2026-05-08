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
const patronesRoutes = require('./routes/patronesRoutes');
const frecuenciasRoutes = require('./routes/frecuenciasRoutes');
const turnosRoutes = require('./routes/turnosRoutes');

//============= RUTAS =============
app.use("/api", authRoutes); // Manejará /api/login
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/gages", gagesRoutes);
app.use("/api/prestamo", prestamosRoutes);
app.use("/api/procedimientos", procedimientoRoutes);
app.use("/api/calibracion", calibracionRoutes);
app.use('/api/reportes', reportRoutes);
app.use('/api/frecuencias', frecuenciasRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/patrones', patronesRoutes);

// --- ENCENDER SERVIDOR ---
app.listen(3000, () => {
  console.log("Servidor unificado corriendo en el puerto 3000");
});
