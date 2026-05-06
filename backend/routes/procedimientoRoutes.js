const express = require('express');
const router = express.Router();
const procedimientosController = require('../controllers/procedimientoController');

router.get('/', procedimientosController.getProcedimientos);
router.get('/manual', procedimientosController.getManual);
router.post('/', procedimientosController.crearProcedimiento);
router.put('/:id', procedimientosController.actualizarProcedimiento);

module.exports = router;