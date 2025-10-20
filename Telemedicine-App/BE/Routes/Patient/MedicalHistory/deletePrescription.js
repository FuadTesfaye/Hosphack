

const express = require('express');
const patientHistoryDeletePrescriptionController = require('../../../Controllers/Patient/MedicalHistory/deletePrescription');
// const { tokenAuthentication } = require('../../Middleware/User/Authentication');

const router = express.Router();
router.delete('', patientHistoryDeletePrescriptionController.deletePrescription);

module.exports = router;