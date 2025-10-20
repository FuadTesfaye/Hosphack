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
const retrievePatient = async (id, email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_email = $1 AND user_role = $2 AND user_id = $3', [email, 'Patient', id]);
        if (result.rows.length) {
            console.log('User already exists', result.rows);
            return result.rows;
        }
        console.log('No user found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const retrieveDoctors = async () => {
    try {
        const query = 
        `SELECT 
        U.user_id, U.user_first_name, U.user_last_name, U.user_gender,
        D.doctor_specialization, D.doctor_country, D.doctor_thirty_min_price, D.doctor_sixty_min_price, D.doctor_image,D.doctor_rating,D.review_count,
        DI.doctor_interest_name,
        L.language
        FROM doctor D
        LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
        LEFT JOIN doctor_interest DI ON D.doctor_user_id_reference = DI.doctor_interest_doctor_id
        LEFT JOIN languages L ON D.doctor_user_id_reference = L.lang_user_id
        WHERE U.user_role = $1`;

    const result = await pool.query(query, ['Doctor']);
        if (result.rows.length) {
            console.log('Doctor info found', result.rows);
            return result.rows;
        }

        console.log('Doctor info not found');
        return false;

    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

module.exports = { retrievePatient, retrieveDoctors };