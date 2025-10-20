const express = require('express');
const doctorPatientPrescriptionAddController = require('../../../Controllers/Doctor/Patient Prescription/Add');
const { tokenAuthentication } = require('../../../Middleware/User/Authentication');

const router = express.Router();

router.post('/:appointmentId', tokenAuthentication, doctorPatientPrescriptionAddController.addPatientPrescription);

module.exports = router;