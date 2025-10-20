const express = require('express');
const registerController = require('../../Controllers/Patient/Register');

const router = express.Router();

router.post('', registerController.patientRegister);

module.exports = router;