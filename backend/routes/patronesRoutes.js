const express = require('express');
const router = express.Router();
const patronesController = require('../controllers/patronesController');

router.get('/', patronesController.ObtenerPatrones);
router.post('/', patronesController.crearPatrones);
router.put('/:id', patronesController.editarPatrones);
router.put('/delete/:id', patronesController.eliminarPatrones);

module.exports = router;