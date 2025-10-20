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

const SubmitReview = async (appointment_id, communication_rating, understanding_rating, providing_solution_rating, commitment_rating) => {
  try {
    console.log(appointment_id, communication_rating, understanding_rating, providing_solution_rating, commitment_rating )

    // Insert the Review into the database
    const result = await pool.query(
      `INSERT INTO appointment_review (
        appointment_review_appointment_id,
        appointment_review_communication_rating,
        appointment_review_understanding_rating,
        appointment_review_providing_solutions_rating,
        appointment_review_commitment_rating

      ) VALUES ($1, $2, $3, $4, $5) RETURNING appointment_review_id`,
      [appointment_id, communication_rating, understanding_rating, providing_solution_rating, commitment_rating]
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
    }
  };
  const RetrieveDoctorRating = async (doctorID) => {
    try {
  const result = await pool.query(
    `SELECT
    doctor_rating,review_count
     FROM
     doctor
     WHERE
     doctor_user_id_reference = $1`,
  [doctorID]
);

if (result.rows.length === 0 || result.rows[0].review_count === 0) {
    return null; 
  }

  return result.rows[0];
} catch (error) {
  console.error('Error retrieving doctor rating:', error);
  throw error; 
}
};

const NewDoctorRating = async (doctorID,newRating, newReview_Count) => {
    try {
      console.log(doctorID, newRating)
  
      // Insert the Rating into the database
      const result = await pool.query(
        `UPDATE doctor
        SET doctor_rating = $1, review_count=$2
        WHERE doctor_user_id_reference= $3
        RETURNING doctor_rating`, 
        [newRating, newReview_Count,doctorID] 
      );
  
      return result.rows[0].appointment_id;
    } catch (error) {
      console.error(error);
      throw error;
      }
    };

  
  module.exports = { SubmitReview, RetrieveDoctorRating, NewDoctorRating};
