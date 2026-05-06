const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Cuando llamen a POST /api/login, se ejecuta la función del controlador
router.post("/login", authController.login);

module.exports = router;