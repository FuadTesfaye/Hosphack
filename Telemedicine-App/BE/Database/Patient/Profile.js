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

const retrievePatientInfo = async (id) => {
  try {
    let query;
      query = `SELECT 
    U.user_email, U.user_phone_number, U.user_gender, U.user_birth_date, U.user_first_name, U.user_last_name,
    array_agg(L.language) AS languages
    FROM users U
    LEFT JOIN languages L ON u.user_id = L.lang_user_id
    WHERE U.user_id = $1  AND U.user_role = $2
    GROUP BY U.user_email, U.user_phone_number, U.user_gender, U.user_birth_date, U.user_first_name, U.user_last_name`;
    const result = await pool.query(query, [id, "Patient"]);
    if (result.rows.length) {
      console.log("Patient info found", result.rows);
      return result.rows;
    }
    console.log("Patient info not found");
    return false;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};

// not tested with new data model
const getPatientRequests = async (patientId) => {
  const result = await pool.query(
    `SELECT
    a.appointment_patient_id,
    a.appointment_doctor_id,
    a.appointment_type,
    a.appointment_duration,
    a.appointment_complaint,
    a.appointment_parent_reference,
    a.appointment_settings_type,
    p.user_first_name AS patient_first_name,
    p.user_last_name AS patient_last_name,
    d.user_first_name AS doctor_first_name,
    d.user_last_name AS doctor_last_name,
    a.appointment_date AS doctor_availability_day_hour
FROM
    appointment a
JOIN users p ON a.appointment_patient_id = p.user_id
JOIN users d ON a.appointment_doctor_id = d.user_id
WHERE
    a.appointment_patient_id = $1
    AND a.appointment_status IN ('Pending', 'Declined')`,
    [patientId]
  );

  return result.rows;
};

const retrievePatientAppointments = async (patientId) => {
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
        a.appointment_date AS doctor_availability_day_hour
    FROM
        appointment a
    JOIN users p ON a.appointment_patient_id = p.user_id
    JOIN users d ON a.appointment_doctor_id = d.user_id
    JOIN doctor doc ON a.appointment_doctor_id = doc.doctor_user_id_reference

    WHERE
        a.appointment_patient_id = $1 AND
        a.appointment_status = $2`,
    [patientId, "Approved"]
  );
  console.log(result.rows);
  return result.rows;
};
// not tested with new data model

const getDoctorDetails = async (doctorId) => {
  const result = await pool.query(
    `SELECT u.user_first_name, u.user_last_name, d.doctor_specialization
       FROM users u
       INNER JOIN doctor d ON u.user_id = d.doctor_user_id_reference
       WHERE d.doctor_user_id_reference = $1`,
    [doctorId]
  );

  return result.rows[0]; // Assuming there's only one doctor per ID
};
// not tested with new data model

const getDoctorClinicLocation = async (doctorId) => {
  const result = await pool.query(
    `SELECT doctor_clinic_location
       FROM doctor
       WHERE doctor_user_id_reference = $1`,
    [doctorId]
  );

  return result.rows[0] ? result.rows[0].doctor_clinic_location : null; // Return null if no location exists
};

// need to be edited to new version of this function

// const retrievePatientAppointments = async (id, email) => {
//     try {
//     const query =
//     `SELECT
//     U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
//     P.*,
//     A.*,
//     U2.user_first_name AS doctor_first_name, U2.user_last_name AS doctor_last_name,
//     DA.doctor_availability_day_hour AS appointment_day_hour,
//     D.doctor_specialization
//     FROM patient P
//     LEFT JOIN users U ON P.patient_user_id_reference = U.user_id
//     LEFT JOIN appointment A ON P.patient_user_id_reference = A.appointment_patient_id
//     LEFT JOIN users U2 ON A.appointment_doctor_id = U2.user_id
//     LEFT JOIN doctor_availability DA ON A.appointment_availability_slot = DA.doctor_availability_id
//     LEFT JOIN doctor D ON A.appointment_doctor_id = D.doctor_user_id_reference
//     WHERE P.patient_user_id_reference = $1 AND U.user_email = $2 AND U.user_role = $3 `;

//     const result = await pool.query(query, [id, email, 'Patient']);
//     if (result.rows.length) {
//         console.log('Patient appointments found', result.rows);
//         return result.rows;
//     }
//     console.log('Patient info not found');
//     return false;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     }
// };

const retrievePatientDoctors = async (id, email) => {
  try {
    const query = `SELECT 
    U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
    P.*,
    D.*
    FROM patient P
    LEFT JOIN users U ON P.patient_user_id_reference = U.user_id
    LEFT JOIN doctor D ON P.patient_current_doctor_id = D.doctor_user_id_reference
    WHERE P.patient_user_id_reference = $1 AND U.user_email = $2 AND U.user_role = $3`;

    const result = await pool.query(query, [id, email, "Patient"]);
    if (result.rows.length) {
      console.log("Patient doctors found", result.rows);
      return result.rows;
    }
    console.log("Patient doctors not found");
    return false;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};

const retrievePatientReviews = async (id, email) => {
  try {
    const query = `SELECT 
    U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
    P.*,
    R.*
    FROM patient P
    LEFT JOIN users U ON P.patient_user_id_reference = U.user_id
    LEFT JOIN review R ON P.patient_user_id_reference = R.review_patient_id
    WHERE P.patient_user_id_reference = $1 AND U.user_email = $2 AND U.user_role = $3`;

    const result = await pool.query(query, [id, email, "Patient"]);
    if (result.rows.length) {
      console.log("Patient reviews found", result.rows);
      return result.rows;
    }
    console.log("Patient reviews not found");
    return false;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};

module.exports = {
  retrievePatientInfo,
  retrievePatientAppointments,
  retrievePatientDoctors,
  retrievePatientReviews,
  getPatientRequests,
  getDoctorDetails,
  getDoctorClinicLocation,
};
