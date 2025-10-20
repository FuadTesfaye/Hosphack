const express = require('express');
const patientHomeController = require('../../Controllers/Patient/Home');
const router = express.Router();

router.get('', patientHomeController.home);

module.exports = router;