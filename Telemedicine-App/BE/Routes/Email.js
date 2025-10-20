const express = require('express');
const emailController = require('../Controllers/Email');
const { tokenAuthentication } = require('../Middleware/User/Authentication');


const router = express.Router();

router.post('/send-email', emailController.sendEmail);
router.post('/verify-reset-password-email', emailController.verifyResetPasswordEmail);
router.put('/reset-password', tokenAuthentication, emailController.resetPassword);

module.exports = router;