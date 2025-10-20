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

const insertFile = async (patientId, fileName, fileType, fileData) => {
    const query = 'INSERT INTO medical_documents (medical_documents_patient_id, medical_document_name, medical_document_type, medical_document_data) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [patientId, fileName, fileType, fileData];
    try {
        const result = await pool.query(query, values);
        if (!result.rows.length) {
            console.log('could not insert file');
            return false;
        }
        console.log('File inserted:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error inserting file:', error.stack);
        return null;
    }
};

module.exports = { insertFile };