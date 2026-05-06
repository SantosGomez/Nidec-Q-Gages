const express = require('express');
const router = express.Router();
const calibracionController = require('../controllers/calibracionController');

router.get('/', calibracionController.getCalibraciones);
router.get('/nuevos', calibracionController.getNuevos);
router.get('/detalle/:id', calibracionController.getDetalle);
router.get('/historial/:gageId', calibracionController.getHistorial);
router.get('/preparar/:gageId', calibracionController.prepararCalibracion);
router.post('/', calibracionController.registrarCalibracion);
router.put('/:id', calibracionController.actualizarCalibracion);

module.exports = router;