const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.getUsuarios);
router.post('/registrar', usuariosController.registrarUsuario);
router.put('/permisos/:id', usuariosController.updatePermisos);
router.put('/reset-password/:id', usuariosController.resetPassword);

module.exports = router;