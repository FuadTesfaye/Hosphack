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

const deleteFile = async (patientId, fileId) => {
    try {
        const result = await pool.query('DELETE FROM medical_documents WHERE medical_document_id = $1 AND medical_documents_patient_id = $2 RETURNING medical_document_id', [fileId, patientId]);
        if (result.rows.length) {
            console.log('File deleted:', result.rows);
            return result.rows;
        }
        console.log('No file found');
        return false;
    } catch (error) {
        console.error('Error deleting file:', error.stack);
        return false;
    }
};

module.exports = { deleteFile };