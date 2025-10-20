const express = require('express');
const registerController = require('../../Controllers/Doctor/Register');

const router = express.Router();

router.post('', registerController.doctorRegister);

module.exports = router;