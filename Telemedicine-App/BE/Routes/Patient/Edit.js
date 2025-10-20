const express = require('express');
const patientEditController = require('../../Controllers/Patient/Edit');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');

const router = express.Router();

router.put('/info', tokenAuthentication, patientEditController.editInfo);
router.put('/password', tokenAuthentication, patientEditController.editPassword);

module.exports = router;