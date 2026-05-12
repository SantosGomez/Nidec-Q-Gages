const express = require('express');
const router = express.Router();
const plantillasController = require('../controllers/plantillasController');

router.post('/', plantillasController.crearPlantilla);
router.get('/', plantillasController.obtenerPlantillas); // Para listarlas en el combo de Quasar
router.get('/:id', plantillasController.obtenerPlantillaPorId); // Para listarlas en el combo de Quasar
router.delete('/:id', plantillasController.eliminarPlantilla);

module.exports = router;