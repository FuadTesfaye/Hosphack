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

// Request Body format
// {
//   "prescriptionId": 1
// }

const deletePrescription = async (prescriptionId) => {
  try {
    const deleteMedicationQuery = `
      DELETE FROM prescription_medications
      WHERE
        prescription_medication_reference_id = $1
    `;
    await pool.query(deleteMedicationQuery, [prescriptionId]);
    const deletePrescriptionQuery = `
      DELETE FROM prescriptions
      WHERE
        prescription_id = $1
        RETURNING prescription_id;
    `;
    await pool.query(deletePrescriptionQuery, [prescriptionId]);
    return true;
  } catch (error) {
    console.error(error.stack);
    if (error.code === 'ER_ROW_DOES_NOT_EXIST') {
      return false; 
    } else {
      throw error;
    }
  }
};
module.exports = {  deletePrescription };