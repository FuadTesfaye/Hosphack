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
        console.log('Connected to the database prescription1');
        client.release();
    } catch (error) {
        console.error('Database connection error', error.stack);
    }
})();


// {
//   "medicationData": [
//     {
//       "medicationName": "Ibuprofen",
//       "dosage": "200mg, twice daily",
//       "note": "For pain relief"
//     },
//     {
//       "medicationName": "Paracetamol",
//       "dosage": "500mg, every 4 hours",
//       "note": "For fever reduction"
//     }
//   ]
// }
const addPrescription = async (patientId, medicationData) => {
  try {
    const query = `
      INSERT INTO prescriptions (
        prescription_patient_id
      ) VALUES (
        $1
      ) RETURNING prescription_id;
    `;

    const result = await pool.query(query, [patientId]);
    const prescriptionId = result.rows[0].prescription_id;
    if(!result.rows[0])
    {
      return false;
    }

    for (const medication of medicationData) {
      const medicationInsertQueries = `
        INSERT INTO prescription_medications (
          prescription_medication_reference_id,
          prescription_medication_name,
          prescription_medications_dosage,
          prescription_medications_note
        ) VALUES (
          $1, $2, $3, $4
        )
      `;

      await pool.query(medicationInsertQueries, [prescriptionId, medication.medicationName, medication.dosage, medication.note]);
    }

    return { prescriptionId, medications: medicationData };
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    throw error;
  }
};

module.exports = {addPrescription };