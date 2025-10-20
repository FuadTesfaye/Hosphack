const patientMedicalDocumentUploadController = require('../../../Controllers/Patient/Medical Document/Upload');
const { tokenAuthentication } = require('../../../Middleware/User/Authentication');
const express = require('express');
const router = express.Router();

router.post('', tokenAuthentication, patientMedicalDocumentUploadController.upload);

module.exports = router;