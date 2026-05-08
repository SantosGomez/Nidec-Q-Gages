const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

router.get('/', turnoController.obtenerTurno);
router.post('/', turnoController.crearTurno);
router.put('/:id', turnoController.editarTurno);
router.put('/delete/:id', turnoController.eliminarTurno);

module.exports = router;