const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamoController');

router.get('/', prestamosController.getPrestamos);
router.get('/areas', prestamosController.getAreas);
router.post('/', prestamosController.crearPrestamo);
router.put('/:id', prestamosController.actualizarPrestamo);

module.exports = router;