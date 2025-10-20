const pg = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const saltRounds = 10;


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

const updateInfo = async (doctorId, doctorEmail, updates) => {
    try {
        const userFields = [];
        const userValues = [];
        const doctorFields = [];
        const doctorValues = [];
        let userIndex = 1;
        let doctorIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined && value !== null && value !== '') {
                if (key.startsWith('user_')) {
                    userFields.push(`${key} = $${userIndex}`);
                    userValues.push(value);
                    userIndex++;
                } else if (key.startsWith('doctor_')) {
                    doctorFields.push(`${key} = $${doctorIndex}`);
                    doctorValues.push(value);
                    doctorIndex++;
                }
            }
        }

        if (userFields.length > 0) {
            userValues.push(doctorId, 'Doctor', doctorEmail);
            const userQuery = `UPDATE users SET ${userFields.join(', ')} WHERE user_id = $${userIndex} AND user_role = $${userIndex + 1} AND user_email = $${userIndex + 2} RETURNING *`;
            const updatedUserInfo = await pool.query(userQuery, userValues);
            console.log('User info updated', updatedUserInfo.rows);
        }

        if (doctorFields.length > 0) {
            doctorValues.push(doctorId);
            const doctorQuery = `UPDATE doctor SET ${doctorFields.join(', ')} WHERE doctor_user_id_reference = $${doctorIndex} RETURNING *`;
            const updatedDoctorInfo = await pool.query(doctorQuery, doctorValues);
            console.log('Doctor info updated', updatedDoctorInfo.rows);
        }

        if (updates.languages.length > 0) {
            if(updates.languages[0] !== null && updates.languages[0] !== undefined && updates.languages[0] !== '') {
                await pool.query('DELETE FROM languages WHERE lang_user_id = $1', [doctorId]);
                for (const language of updates.languages) {
                    if(language !== '' && language !== null && language !== undefined){
                        await pool.query('INSERT INTO languages (lang_user_id, language) VALUES ($1, $2)', [doctorId, language]);
                        console.log('Languages updated', language);
                    }
                }
            }
        }
        const combinedQuery = `
            SELECT 
                u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_gender, u.user_phone_number, u.user_birth_date,
                d.doctor_country, d.doctor_sixty_min_price, d.doctor_thirty_min_price, d.doctor_specialization,
                array_agg(l.language) AS languages
            FROM 
                users u
            JOIN 
                doctor d ON u.user_id = d.doctor_user_id_reference
            LEFT JOIN 
                languages l ON u.user_id = l.lang_user_id
            WHERE 
                u.user_id = $1
            GROUP BY 
                u.user_id, d.doctor_country, d.doctor_sixty_min_price, d.doctor_thirty_min_price, d.doctor_specialization
        `;
        const combinedResult = await pool.query(combinedQuery, [doctorId]);
        console.log('Doctor info updated', combinedResult.rows);
        return combinedResult.rows;
    } catch (error) {
        console.error('Error updating doctor info:', error.stack);
        return false;
    }
};

const updatePassword = async (doctorId, doctorEmail, oldPassword, newPassword) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1 AND user_email = $2 AND user_role = $3', [doctorId, doctorEmail, 'Doctor']);
        if (result.rows.length) {
            const isMatch = await bcrypt.compare(oldPassword, result.rows[0].user_password_hash);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                const result = await pool.query('UPDATE users SET user_password_hash = $1 WHERE user_id = $2 AND user_email = $3 AND user_role = $4 RETURNING *', [hashedPassword, doctorId, doctorEmail, 'Doctor']);
                if (result.rows.length) {
                    console.log('Doctor password updated', result.rows);
                    return result.rows;
                }
                console.log('Could not update doctor password');
                return false;
            }
            console.log('Old password does not match');
            return false;
        }
        console.log('Doctor not found');
        return false;
    }
    catch (error) {
        console.error(error.stack);
        return false;
    }
};

module.exports = { updateInfo, updatePassword };

