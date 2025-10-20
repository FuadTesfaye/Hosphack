const express = require('express');
const chatController = require('../Controllers/Chat');
const { tokenAuthentication } = require('../Middleware/User/Authentication');

const router = express.Router();

router.get('/:appointmentId', tokenAuthentication, chatController.getAppointmentChat);
router.post('', tokenAuthentication, chatController.sendAppointmentMessage);

module.exports = router;