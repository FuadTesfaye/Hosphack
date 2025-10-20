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


const retrievePatientAppointmentsHistory = async (patientId) => {
    const result = await pool.query(
      `SELECT
        a.appointment_patient_id,
        a.appointment_doctor_id,
        a.appointment_type,
        a.appointment_id,
        a.appointment_duration,
        a.appointment_complaint,
        a.appointment_parent_reference,
        a.appointment_settings_type,
        p.user_first_name AS patient_first_name,
        p.user_last_name AS patient_last_name,
        d.user_first_name AS doctor_first_name,
        d.user_last_name AS doctor_last_name,
        doc.doctor_specialization,
        a.appointment_date AS doctor_availability_day_hour,
        ar.appointment_review_communication_rating,
        ar.appointment_review_understanding_rating,
        ar.appointment_review_providing_solutions_rating,
        ar.appointment_review_commitment_rating
      FROM
        appointment a
      JOIN users p ON a.appointment_patient_id = p.user_id
      JOIN users d ON a.appointment_doctor_id = d.user_id
      JOIN doctor doc ON a.appointment_doctor_id = doc.doctor_user_id_reference
      LEFT JOIN appointment_review ar ON a.appointment_id = ar.appointment_review_appointment_id

      WHERE
        a.appointment_patient_id = $1 AND
        a.appointment_status = $2`,
      [patientId,'Completed']
    );
  console.log(result.rows)
    return result.rows;
  };

  
module.exports = {retrievePatientAppointmentsHistory};