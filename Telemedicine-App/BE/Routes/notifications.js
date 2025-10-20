const express = require('express');
const notificationscontroller = require('../Controllers/notifications');
const { tokenAuthentication } = require('../Middleware/User/Authentication');

const router = express.Router();

router.get('/Unread', tokenAuthentication, notificationscontroller.getUnreadNotifications);
router.get('/All', tokenAuthentication, notificationscontroller.getNotifications);
router.put('/Markread', tokenAuthentication, notificationscontroller.markNotificationsAsRead);
router.post('/setExpoPushToken', tokenAuthentication, notificationscontroller.setExpoPushToken);

module.exports = router;