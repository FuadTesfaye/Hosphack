const database = require('../Database/Email');
const { createResetPasswordToken, passwordValidation } = require('../Utilities');
const nodemailer = require('nodemailer');
require('dotenv').config();

const verifyResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await database.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = createResetPasswordToken(user.user_id, user.user_email, user.user_role);


        res.status(200).json({ message: 'User retrived successfully', token: token });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    const id = req.id;
    const email = req.email;

    if (!id || !email) {
        return res.status(401).json({ message: 'User not Authorized to reset password' });
    }

    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!passwordValidation(password)) {
        return res.status(400).json({ message: 'Very weak password' });
    }

    try {
        
        const isPasswordUpdated = await database.updatePassword(id, email, password);
        if (!isPasswordUpdated) {
            return res.status(500).json({ message: 'Error updating password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const sendEmail = async (req, res) => {
    const { sendToEmail, sendFromEmail, subject, message } = req.body;

    if (!sendToEmail || !sendToEmail.length) {
        return res.status(400).json({ message: 'Receiver email is required' });
    }

    if (!sendFromEmail) {
        return res.status(400).json({ message: 'Sender email is required' });
    }

    if (!subject) {
        return res.status(400).json({ message: 'Subject is required' });
    }

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true, // Add this line
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    try {
        // await Promise.all(sendToEmail.map(async (email) => {
            // const user = await database.getUserByEmail(sendToEmail[0]);
            // if (user) {
                let mailOptions = {
                    from: `"Telemedicine Platform" <${sendFromEmail}>`,
                    to: sendToEmail[0],
                    subject: subject,
                    text: message,
                };
                let info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${sendToEmail[0]}: ${info.response}`);
            // }
        // }));
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: `Failed to send email: ${error.message}` });
    }
};

module.exports = { verifyResetPasswordEmail, resetPassword, sendEmail };