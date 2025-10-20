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

const updateInfo = async (patientId, patientEmail, updates) => {
    try {
        const userFields = [];
        const userValues = [];
        let userIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined && value !== null && value !== '') {
                if (key !== 'languages') {
                    userFields.push(`${key} = $${userIndex}`);
                    userValues.push(value);
                    userIndex++;
                }
            }
        }

        if (userFields.length > 0) {
            userValues.push(patientId, 'Patient', patientEmail);
            const userQuery = `UPDATE users SET ${userFields.join(', ')} WHERE user_id = $${userIndex} AND user_role = $${userIndex + 1} AND user_email = $${userIndex + 2} RETURNING *`;
            const updatedUserInfo = await pool.query(userQuery, userValues);
    
            if (!updatedUserInfo.rows.length) {
                console.log('Could not update user info');
            } else {
                console.log('User info updated', updatedUserInfo.rows);
            }
        }

        console.log('No user info provided');

        if (Array.isArray(updates.languages) && updates.languages.length > 0) {
            const validLanguages = updates.languages.filter(language => language !== '' && language !== null && language !== undefined);
            if (validLanguages.length > 0) {
                await pool.query('DELETE FROM languages WHERE lang_user_id = $1', [patientId]);
                for (const language of validLanguages) {
                    const updatedLanguage = await pool.query('INSERT INTO languages (lang_user_id, language) VALUES ($1, $2) RETURNING *', [patientId, language]);
                    if (!updatedLanguage.rows.length) {
                        console.log('Could not update user languages to include', language);
                    } else {
                        console.log('User languages updated to include', language);
                    }
                }
            } else {
                console.log('Invalid languages provided');
            }
        } else {
            console.log('No languages provided');
        }

        const combinedQuery = `
            SELECT 
                u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_gender, u.user_phone_number, u.user_birth_date,
                array_agg(l.language) AS languages
            FROM 
                users u
            LEFT JOIN 
                languages l ON u.user_id = l.lang_user_id
            WHERE 
                u.user_id = $1 AND u.user_role = $2 AND u.user_email = $3
            GROUP BY 
                u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_gender, u.user_phone_number, u.user_birth_date
        `;
        const combinedResult = await pool.query(combinedQuery, [patientId, 'Patient', patientEmail]);

        if (!combinedResult.rows.length) {
            console.log('Could not update patient info');
            return false;
        }
        console.log('Patient info updated', combinedResult.rows);
        return combinedResult.rows;
    } catch (error) {
        console.error('Error updating patient info:', error.stack);
        return false;
    }
};

const updatePassword = async (patientId, patientEmail, oldPassword, newPassword) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1 AND user_role = $2 AND user_email = $3', [patientId, 'Patient', patientEmail]);
        if (result.rows.length) {
            const isMatch = await bcrypt.compare(oldPassword, result.rows[0].user_password_hash);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                const result = await pool.query('UPDATE users SET user_password_hash = $1 WHERE user_id = $2 AND user_role = $3 AND user_email = $4 RETURNING *', [hashedPassword, patientId, 'Patient', patientEmail]);
                if (result.rows.length) {
                    console.log('Patient password updated', result.rows);
                    return result.rows;
                }
                console.log('Could not update patient password');
                return false;
            }
            console.log('Old password does not match');
            return false;
        }
        console.log('Patient not found');
        return false;
    }
    catch (error) {
        console.error(error.stack);
        return false;
    }
};

module.exports = { updateInfo, updatePassword };