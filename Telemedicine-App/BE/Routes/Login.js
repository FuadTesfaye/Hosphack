const express = require('express');
const userLoginController = require('../Controllers/Login');

const router = express.Router();

router.post('', userLoginController.login);

module.exports = router;