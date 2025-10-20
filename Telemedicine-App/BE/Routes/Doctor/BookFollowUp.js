const express = require('express');
const BookFollowUpController = require('../../Controllers/Doctor/Appointments/BookFollowUp');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');
const router = express.Router();


router.post('/FollowupAppointment', tokenAuthentication, BookFollowUpController.bookFollowUpAppointment);

module.exports = router;