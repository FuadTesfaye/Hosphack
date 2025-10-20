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
const retrieveFiles = async (patientId) => {
    try {
        const result = await pool.query('SELECT * FROM medical_documents WHERE medical_documents_patient_id = $1', [patientId]);
        if (result.rows.length) {
            console.log('Files retrieved:', result.rows);
            return result.rows;
        }
        console.log('No files found');
        return false;
    } catch (error) {
        console.error('Error retrieving files:', error.stack);
        return false;
    }
};

module.exports = { retrieveFiles };