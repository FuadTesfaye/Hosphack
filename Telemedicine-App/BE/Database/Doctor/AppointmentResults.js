const pg = require("pg");
require("dotenv").config();

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
    console.log("Connected to the database");
    client.release();
  } catch (error) {
    console.error("Database connection error", error.stack);
  }
})();

const insertAppointmentResults = async (data) => {
  const result = await pool.query(
    "INSERT INTO appointment_results (appointment_diagnosis, appointment_report, results_appointment_reference) VALUES ($1, $2, $3) RETURNING appointment_result_id",
    [data.diagnosis, data.report, data.results_appointment_reference]
  );
  return result.rows[0].appointment_result_id;
};

const insertTreatmentPlan = async (data) => {
  const result = await pool.query(
    "INSERT INTO treatment_plan (treatment_plan_appointment_reference, treatment_plan_operations, treatment_plan_speciality_referral, treatment_plan_referral_notes) VALUES ($1, $2, $3, $4) RETURNING treatment_plan_id",
    [
      data.treatment_plan_appointment_reference,
      data.operations,
      data.specialityReferral,
      data.specialityReferralNotes,
    ]
  );
  return result.rows[0].treatment_plan_id;
};

const insertMedications = async (medicationsData) => {
  for (let i = 0; i < medicationsData.length; i++) {
    const data = medicationsData[i];
    console.log(data);
    const result = await pool.query(
      `INSERT INTO medications (medication_treatment_plan_reference, medication_name, medication_dosage, medication_note, medication_start_date, medication_end_date) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.treatmentPlanId,
        data.medication_name,
        data.medication_dosage,
        data.medication_note,
        data.medication_start_date,
        data.medication_end_date,
      ]
    );
    return result;
  }
  // return result.rows;
};
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
      const result = await pool.query(
          "UPDATE appointment SET appointment_status = $2 WHERE appointment_id = $1",
          [appointmentId, status]
      );

      // Optionally, you can check the result to see how many rows were updated
      if (result.rowCount > 0) {
          return true; // Indicate successful update
      } else {
          console.log('No appointment found with id:', appointmentId);
          return false; // No rows were updated
      }

  } catch (error) {
      console.error('Error updating appointment status:', error);
      // Handle the error appropriately (e.g., throw it, return an error object)
      return false; // Indicate failure
  }
};

module.exports = {
  updateAppointmentStatus,
  insertAppointmentResults,
  insertTreatmentPlan,
  insertMedications,
};
