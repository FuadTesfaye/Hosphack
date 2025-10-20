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

// not tested with new data model
const getAppointmentDetails = async (appointmentId) => {
  const result = await pool.query(
        `SELECT
      a.appointment_patient_id,
      a.appointment_doctor_id,
      a.appointment_date AS doctor_availability_day_hour,
      a.time_slot_code,
      a.appointment_type,
      a.appointment_duration,
      a.appointment_complaint,
      a.appointment_status,
      a.appointment_parent_reference,
      a.appointment_settings_type,
      p.user_first_name AS patient_first_name,
      p.user_last_name AS patient_last_name,
      d.user_first_name AS doctor_first_name,
      d.user_last_name AS doctor_last_name,
      doc.doctor_specialization,
      doc.doctor_clinic_location
    FROM
      appointment a
    JOIN users p ON a.appointment_patient_id = p.user_id
    JOIN users d ON a.appointment_doctor_id = d.user_id
    JOIN doctor doc ON a.appointment_doctor_id = doc.doctor_user_id_reference
    WHERE
      a.appointment_id = $1`,
      [appointmentId]
    );

  return result.rows[0];
};

const getAppointmentResults = async (appointmentId) => {
  const result = await pool.query(
    `SELECT appointment_diagnosis, appointment_report ,updated_at
     FROM appointment_results
     WHERE results_appointment_reference = $1`,
    [appointmentId]
  );

  return result.rows;
};

const getTreatmentPlan = async (appointmentId) => {
  const result = await pool.query(
    `SELECT treatment_plan_operations, 
     treatment_plan_speciality_referral,
     treatment_plan_referral_notes, 
     treatment_plan_id
     FROM treatment_plan
     WHERE treatment_plan_appointment_reference = $1`,
    [appointmentId]
  );

  if (result.rows.length === 0) {
    return {};
  }

  return result.rows[0];
};

const getMedications = async (treatmentPlanId) => {
  const result = await pool.query(
    `SELECT medication_note,
     medication_start_date,
     medication_end_date, 
     medication_id, 
     medication_name, 
     medication_dosage
     FROM medications
     WHERE medication_treatment_plan_reference = $1`,
    [treatmentPlanId]
  );

  return result.rows;
};

const getMedicalDocuments = async (appointmentId, treatmentPlanId) => {
  const result = await pool.query(
    `SELECT medical_document_data, medical_document_request_note,
     medical_document_id, medical_document_type, medical_document_name
     FROM medical_documents
     WHERE medical_document_appointment_reference = $1
     OR medical_document_treatment_plan_reference = $2`,
    [appointmentId, treatmentPlanId]
  );

  return result.rows;
};

module.exports = {
  getAppointmentDetails,
  getAppointmentResults,
  getTreatmentPlan,
  getMedications,
  getMedicalDocuments,
};