const patientMedicalDocumentDeleteController = require('../../../Controllers/Patient/Medical Document/Delete');
const { tokenAuthentication } = require('../../../Middleware/User/Authentication');
const express = require('express');
const router = express.Router();

router.delete('', tokenAuthentication, patientMedicalDocumentDeleteController.deleteFile);

module.exports = router;