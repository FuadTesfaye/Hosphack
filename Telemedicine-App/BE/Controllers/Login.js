const bcrypt = require('bcryptjs');
const database = require('../Database/Login');
const { createToken } = require('../Utilities');
const { ACCESS_TOKEN_EXPIRATION_IN_MILLISECONDS } = process.env;

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let message = '';
    if (!email || !password) {
        message = 'Please fill all the fields';
        return res.status(404).json(message);
    }
    const user = await database.retrieveUser(email);
    if (!user) {
        message = 'Invalid email'
        return res.status(400).json(message);
    }
    console.log('User retrieved:', user);
    
    const match = await bcrypt.compare(password, user[0].user_password_hash);
    console.log('Password match result:', match); 
    if (!match) {
        message = 'Invalid email or password'
        return res.status(400).json(message);
    }
    const UserAccountState= await database.retrieveUserState(user[0].user_id, user[0].user_role) //check UserAccountState
    console.log(UserAccountState)
    if (UserAccountState === 'On_hold') {
        const message = 'Account has not been activated yet';
        return res.status(403).json({ message });
    }
    if (UserAccountState === 'Panned') {
        const message = 'Account has been banned';
        return res.status(403).json({ message });
    }
    const unreadCount = await database.getUnreadNotificationCount(user[0].user_id); 

    const token = createToken(user[0].user_id, user[0].user_email, user[0].user_role, user[0].user_first_name, user[0].user_last_name);
    if (!token) {
        message = 'Token could not be created';
        return res.status(400).json(message);
    }
    
    return res.json({ message: 'Login successful', token: token, Notifications: unreadCount  });
}

module.exports = { login };