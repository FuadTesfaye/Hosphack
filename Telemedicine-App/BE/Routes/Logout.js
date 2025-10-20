const express = require('express');
const userLogoutController = require('../Controllers/Logout');

const router = express.Router();

router.post('', userLogoutController.logout);

module.exports = router;