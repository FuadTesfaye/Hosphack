const express = require('express');
const doctorEditController = require('../../Controllers/Doctor/Edit');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');
const router = express.Router();

router.put('/info', tokenAuthentication, doctorEditController.editInfo);
router.put('/password', tokenAuthentication, doctorEditController.editPassword);

module.exports = router;