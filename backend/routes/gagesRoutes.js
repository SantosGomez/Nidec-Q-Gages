const express = require('express');
const router = express.Router();
const gagesController = require('../controllers/gagesController');

router.get('/', gagesController.getGages);
router.get('/disponibles', gagesController.getGagesDisponibles);
router.get('/plantillas-nombres', gagesController.getPlantillasNombres);
router.post('/', gagesController.crearGage);
router.put('/:id', gagesController.actualizarGage);
router.put('/status/:id', gagesController.actualizarStatus);

module.exports = router;