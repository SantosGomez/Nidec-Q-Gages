const express = require('express');
const router = express.Router();
const frecuenciasController = require('../controllers/frecuenciasController');

router.get('/', frecuenciasController.obtenerFrecuencia);
router.post('/', frecuenciasController.crearFrecuencia);
router.put('/:id', frecuenciasController.editarFrecuencia);
router.put('/delete/:id', frecuenciasController.eliminarFrecuencia);

module.exports = router;