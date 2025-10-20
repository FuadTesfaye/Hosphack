const bcrypt = require('bcryptjs');
const database = require('../Database/notifications');
const { createToken } = require('../Utilities');
const { ACCESS_TOKEN_EXPIRATION_IN_MILLISECONDS } = process.env;
const { Expo } = require('expo-server-sdk');
// Create a new Expo SDK client
const expo = new Expo();

const getUnreadNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await database.getUnreadNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications'
 });
    }
};
const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await database.getNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications'
 });
    }
};
const markNotificationsAsRead = async (req, res) => {
    try {
        const notificationIds = req.body.notificationIds; // Assuming an array of IDs is sent in the request body
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return res.status(400).json({ error: 'Invalid notification IDs' });
        }
        await database.markNotificationsAsRead(notificationIds);
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
};

const setExpoPushToken = async (req, res) => {
    try {
        const userId = req.id;
        const expoPushToken = req.body.token; 
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
        await database.setExpoPushToken(userId,expoPushToken);
        res.json({ message: 'expo token saved to database successfully'});
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
};

const addNotification = async (recipientId, title, body, notificationType) => {
    try {
        const notification = {
            recipientId: recipientId, 
            title: title,
            message: body,
            notificationType: notificationType
          }
        // 1. Store the notification in the database
        await database.addNotification(notification);
        console.log("Notification added successfully");
        // 2. Send a push notification to the mobile
        const pushToken = await database.fetchExpotoken(recipientId);
        if(pushToken){
            await sendPushNotification(pushToken, title, body);
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};


const sendPushNotification = async (pushToken, title, body) => {
    try {
        const message = {
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: { 
                message: "Hello there, this is a test notification" 
            },
        };
        const ticketChunk = await expo.sendPushNotificationsAsync([message]);
        console.log(ticketChunk);
        // if(ticketChunk){
        //     addNotification(recipientId, body)
        // }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { setExpoPushToken, getUnreadNotifications, getNotifications, markNotificationsAsRead, addNotification, sendPushNotification}
