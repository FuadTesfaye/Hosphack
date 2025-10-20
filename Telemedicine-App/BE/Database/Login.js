const pg = require('pg');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPORT } = process.env;
let PGPASSWORD = process.env.PGPASSWORD;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const pool = new pg.Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT,
    ssl: {
        rejectUnauthorized: true,
    },
});
(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        client.release();
    } catch (error) {
        console.error('Database connection error', error.stack);
    }
})();

const retrieveUser = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (result.rows.length) {
            console.log('User already exists', result.rows);
            return result.rows;
        }
        console.log('User not found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};
const retrieveUserState = async (UserID, UserRole) => {
    try {
        if (UserRole === 'Doctor') {
            console.log('User is a doctor');
            const result = await pool.query('SELECT doctor_account_state FROM doctor WHERE doctor_user_id_reference = $1', [UserID]);
            if (result.rows.length) {
                const state = result.rows[0].doctor_account_state;
                return state;
            }
            return 'Doctor state not found';
        } else if (UserRole === 'Patient') {
            console.log('User is a patient');
            const result = await pool.query('SELECT patient_account_state FROM patient WHERE patient_user_id_reference = $1', [UserID]);
            if (result.rows.length) {
                const state = result.rows[0].patient_account_state;
                return state;
            }
            return 'Patient state not found';
        } else if (UserRole === 'Admin') {
            console.log('User is an admin');
            return 'Active'; // Assuming admin accounts are always active
        } else {
            console.log('User role not recognized');
            return false;
        }
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};
const getUnreadNotificationCount = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = FALSE',
            [userId]
        );
        return result.rows[0].count;
    } catch (error) {
        console.error(error.stack);
        return 0; // Return 0 in case of an error
    }
};

module.exports = { retrieveUser, retrieveUserState, getUnreadNotificationCount };