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





// const createDoctorAvailability = async (doctorId, timeSlotCode, appointmentDate) => {
//   try {
//     const availabilityType = timeSlotCode.endsWith('S') ? 'Onsite' : 'Online';
//     console.log(availabilityType);
//     const result = await pool.query(
//       // `INSERT INTO doctor_availability (
//       //   doctor_availability_doctor_id,
//       //   time_slot_code,
//       //   doctor_availability_type,
//       //   doctor_availability_status,
//       //   doctor_availability_day_hour
//       // ) VALUES ($1, $2, $3, $4, $5) RETURNING doctor_availability_id`,
//       [doctorId, timeSlotCode, availabilityType, 'Pending', appointmentDate]
//     );

//     return result.rows[0].doctor_availability_id;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

const createAppointmentEntry = async (time_slot_code, patientId, doctor_id, complaint, duration, appointment_type, appointment_date) => {
  try {
    // Determine the appointment_settings_type based on the time_slot_code
    const appointment_settings_type = time_slot_code.endsWith('S') ? 'Onsite' : 'Online';

    // Insert the appointment into the database
    const result = await pool.query(
      `INSERT INTO appointment (
        appointment_patient_id,
        appointment_doctor_id,
        appointment_date,
        time_slot_code,
        appointment_type,
        appointment_duration,
        appointment_complaint,
        appointment_settings_type,
        appointment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING appointment_id`,
      [patientId, doctor_id, appointment_date, time_slot_code, appointment_type, duration, complaint, appointment_settings_type, 'Pending']
    );

    return result.rows[0].appointment_id;
  } catch (error) {
    console.error(error);
    throw error;
    }
  };


// const createAppointment = async (patientId,doctor_id,complaint ,duration, appointment_type,appointment_date,time_slot_code) => {
//   try {
//     const client = await pool.connect();

//     const result = await client.query(
//       `INSERT INTO appointment (
//         appointment_patient_id,
//         appointment_doctor_id,
//         appointment_availability_slot,
//         appointment_complaint,
//         appointment_duration,
//         appointment_settings_type,
//         appointment_type,
//         appointment_parent_reference
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
//       [patientId, doctorId, appointmentAvailabilitySlot, complaint, duration, appointmentSettingsType, appointmentType, appointmentParentReference]
//     );

//     client.release();

//     return result;
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     throw error; // Re-throw for handling in controller
//   }
// };
  
  module.exports = { createAppointmentEntry};
