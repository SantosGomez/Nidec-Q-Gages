const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/excel', reportsController.getExcelReport);
router.get('/pdf', reportsController.getPDFReport);

module.exports = router;