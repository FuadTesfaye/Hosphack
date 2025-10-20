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

const checkUserEmail = async (email) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_email = $1 AND user_role = $2",
      [email, "Doctor"]
    );
    if (result.rows.length) {
      console.log("User already exists", result.rows);
      return result.rows;
    }
    console.log("No user found");
    return false;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};

const insertDoctor = async (user) => {
  try {
    await pool.query("BEGIN");
    const userResult = await pool.query(
      `INSERT INTO users
            (user_first_name,
            user_last_name, 
            user_email, 
            user_phone_number, 
            user_gender, user_role, 
            user_password_hash, 
            user_birth_date)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        user.fName,
        user.lName,
        user.email,
        user.phone,
        user.gender,
        user.role,
        user.password,
        user.birthDate,
      ]
    );
    if (!userResult.rows.length) {
      console.log("User not added");
      await pool.query("ROLLBACK");
      return false;
    }
    const userId = userResult.rows[0].user_id;
    const doctorsResult = await pool.query(
      `INSERT INTO doctor
            (doctor_user_id_reference,
            doctor_specialization,
            doctor_country,
            doctor_city,
            doctor_clinic_location,
            doctor_account_state)
            VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        userId,
        user.speciality,
        user.country,
        user.city,
        user.location,
        user.state,
      ]
    );
    if (!doctorsResult.rows.length) {
      console.log("Doctor not added");
      await pool.query("ROLLBACK");
      return false;
    }
    await pool.query("COMMIT");
    const combinedResult = await pool.query(
      `SELECT 
            u.user_id, 
            u.user_first_name, 
            u.user_last_name, 
            u.user_email, 
            u.user_phone_number, 
            u.user_gender, 
            u.user_role, 
            u.user_birth_date,
            d.doctor_user_id_reference,
            d.doctor_specialization,
            d.doctor_country,
            d.doctor_city,
            d.doctor_clinic_location,
            d.doctor_account_state 
            FROM 
                users u
            JOIN 
                doctor d ON u.user_id = d.doctor_user_id_reference
            WHERE 
                u.user_id = $1`,
      [userId]
    );
    if (combinedResult.rows.length) {
      console.log(
        "User and doctor info retrieved successfully",
        combinedResult.rows
      );
      return combinedResult.rows[0];
    }
    console.log("Combined user and doctor info not found");
    return false;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting doctor:", error.stack);
    return false;
  }
};
const saveDoctorcertificates = async (certificates, doctorId) => {
  try {
    for (let i = 0; i < certificates.length; i++) {
      const data = certificates[i];
      const result = await pool.query(
        `INSERT INTO doctor_education
          (education_doctor_id,
           education_certificate,
           education_authority,
           education_start_date,
           education_end_data)
          VALUES
          ($1, $2, $3, $4, $5)  RETURNING *`,
        [doctorId, data.name, data.authority, data.startDate, data.endDate]
      );
      if (!result.rows.length) {
        console.log(`Error inserting Certificates ${data.name}`);
      }
    }
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting Certificates:", error.stack);
    return false;
  }
};
const saveDoctorexperiences = async (experiences, doctorId) => {
  try {
    for (let i = 0; i < experiences.length; i++) {
      const data = experiences[i];
      const result = await pool.query(
        `INSERT INTO doctor_experience
          (doctor_experience_doctor_id,
           doctor_experience_job_title,
           doctor_experience_firm_name,
           doctor_experience_department,
           doctor_experience_start_date,
           doctor_experience_end_date)
          VALUES
          ($1, $2, $3, $4, $5, $6)  RETURNING *`,
        [
          doctorId,
          data.title,
          data.firm,
          data.department,
          data.startDate,
          data.endDate,
        ]
    );
    if (!result.rows.length) {
      console.log(`Error inserting Experiences ${data.name}`);
    }
  }
  return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting Experiences:", error.stack);
    return false;
  }
};

const saveDoctorinterests = async (interests, doctorId) => {
  try {
    for (let i = 0; i < interests.length; i++) {
      const data = interests[i];
      const result = await pool.query(
        `INSERT INTO doctor_interest
          (doctor_interest_doctor_id,
           doctor_interest_name,
           doctor_interest_category)
          VALUES ($1, $2, $3)  RETURNING *`,
        [doctorId, data.name, data.category]
    );
    if (!result.rows.length) {
      console.log(`Error inserting Interests ${data.name}`);
    }
  }
  return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting Interests:", error.stack);
    return false;
  }
};
const saveDoctorlanguage = async (language, doctorId) => {
  try {
    for (let i = 0; i < language.length; i++) {
      const data = language[i];
      const result = await pool.query(
        `INSERT INTO languages
            (lang_user_id, language)
            VALUES ($1, $2)  RETURNING *`,
        [doctorId, data]
    );
    if (!result.rows.length) {
      console.log(`Error inserting Language ${data.name}`);
    }
  }
  return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error inserting Language:", error.stack);
    return false;
  }
};

module.exports = {
  checkUserEmail,
  insertDoctor,
  saveDoctorcertificates,
  saveDoctorexperiences,
  saveDoctorinterests,
  saveDoctorlanguage,
};
