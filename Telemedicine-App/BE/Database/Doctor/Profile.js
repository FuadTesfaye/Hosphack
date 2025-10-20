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


const retrieveDoctorInfo = async (id, email) => {
    try {
      const query = `            
      SELECT 
          u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_gender, u.user_phone_number, u.user_birth_date,
          d.doctor_country, d.doctor_sixty_min_price, d.doctor_thirty_min_price, d.doctor_specialization, d.doctor_rating, d.review_count, doctor_image,
          array_agg(l.language) AS languages
      FROM 
          users u
      JOIN 
          doctor d ON u.user_id = d.doctor_user_id_reference
      LEFT JOIN 
          languages l ON u.user_id = l.lang_user_id
      WHERE 
          u.user_id = $1 AND u.user_role = $2 AND u.user_email = $3
      GROUP BY 
          u.user_id, d.doctor_country, d.doctor_sixty_min_price, d.doctor_thirty_min_price, d.doctor_specialization, doctor_image, d.doctor_rating, d.review_count`;

    const result = await pool.query(query, [id, 'Doctor', email]);
        if (result.rows.length) {
            console.log('Doctor info found', result.rows);
            return result.rows;
        }

        console.log('Doctor info not found');
        return false;

    } catch (error) {
        console.error(error.stack);
        return false;
    }
};


const retrieveDoctorDeclinedAppointments = async (doctorId) => {
    try {
        const query = 
            `SELECT
            a.appointment_patient_id,
            a.appointment_doctor_id,
            a.appointment_type,
            a.appointment_id,
            a.appointment_duration,
            a.appointment_complaint,
            a.appointment_parent_reference,
            a.appointment_settings_type,
            a.appointment_date AS doctor_availability_day_hour,
            a.time_slot_code,
            p.user_first_name AS patient_first_name,
            p.user_last_name AS patient_last_name,
            d.user_first_name AS doctor_first_name,
            d.user_last_name AS doctor_last_name
        FROM
            appointment a
        JOIN users p ON a.appointment_patient_id = p.user_id
        JOIN users d ON a.appointment_doctor_id = d.user_id
        WHERE
            a.appointment_doctor_id = $1 AND
            a.appointment_status = $2`;

        const result = await pool.query(query, [doctorId, 'Declined']);
        if (result.rows.length) {
            console.log('Declined appointments found', result.rows);
            return result.rows;
        }

        console.log('No Declined appointments found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};
const retrieveDoctorAppointments = async (doctorId) => {
    try {
        const query = 
            `SELECT
                a.appointment_patient_id,
                a.appointment_doctor_id,
                a.appointment_type,
                a.appointment_id,
                a.appointment_duration,
                a.appointment_complaint,
                a.appointment_parent_reference,
                a.appointment_settings_type,
                a.appointment_date AS doctor_availability_day_hour,
                a.time_slot_code,
                p.user_first_name AS patient_first_name,
                p.user_last_name AS patient_last_name,
                d.user_first_name AS doctor_first_name,
                d.user_last_name AS doctor_last_name
            FROM
                appointment a
            JOIN users p ON a.appointment_patient_id = p.user_id
            JOIN users d ON a.appointment_doctor_id = d.user_id
            WHERE
                a.appointment_doctor_id = $1 AND
                a.appointment_status = $2`;

        const result = await pool.query(query, [doctorId, 'Approved']);
        if (result.rows.length) {
            console.log('Pending appointments found', result.rows);
            return result.rows;
        }

        console.log('No pending appointments found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};


const retrieveDoctorReviews = async (id, email) => {
    try {
        const query = 
        `SELECT 
        U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
        D.*,
        R.*
        FROM doctor D
        LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
        LEFT JOIN review R ON D.doctor_user_id_reference = R.review_doctor_id
        WHERE D.doctor_user_id_reference = $1 AND U.user_role = $2 AND U.user_email = $3`;

        const result = await pool.query(query, [id, 'Doctor', email]);
        if (result.rows.length) {
            console.log('Doctor reviews found', result.rows);
            return result.rows;
        }

        console.log('Doctor reviews not found');
        return false;

    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const retrieveDoctorFurtherInformation = async (Doctorid) => {
    try {
      const languagesResult = await pool.query(
        `
        SELECT 
          languages.language,
          languages.language_id
        FROM 
          languages
        WHERE 
          languages.lang_user_id = $1
        `, 
        [Doctorid]
      );
  
      const interestsResult = await pool.query(
        `
        SELECT 
          doctor_interest.doctor_interest_name,
          doctor_interest.doctor_interest_category,
          doctor_interest.doctor_interest_id
        FROM 
          doctor_interest
        WHERE 
          doctor_interest.doctor_interest_doctor_id = $1
        `, 
        [Doctorid]
      );
  
      const educationResult = await pool.query(
        `
        SELECT 
          doctor_education.education_certificate,
          doctor_education.doctor_education_id,
          doctor_education.education_authority,
          doctor_education.education_start_date,
          doctor_education.education_end_data
        FROM 
          doctor_education
        WHERE 
          doctor_education.education_doctor_id = $1
        `, 
        [Doctorid]
      );
  
      const experienceResult = await pool.query(
        `
        SELECT 
          doctor_experience.doctor_experience_job_title,
          doctor_experience.doctor_experience_firm_name,
          doctor_experience.doctor_experience_department,
          doctor_experience.doctor_experience_start_date,
          doctor_experience.doctor_experience_end_date,
          doctor_experience.doctor_experience_id
        FROM 
          doctor_experience
        WHERE 
          doctor_experience.doctor_experience_doctor_id = $1
        `, 
        [Doctorid]
      );
  
      const languages = languagesResult.rows.map(row => ({
        id: row.language_id,
        name: row.language
      }));
  
      const interests = interestsResult.rows.map(row => ({
        id: row.doctor_interest_id,
        category: row.doctor_interest_category,
        name: row.doctor_interest_name
      }));
  
      const certificates = educationResult.rows.map(row => ({
        id: row.doctor_education_id,
        authority: row.education_authority,
        startDate: row.education_start_date,
        endDate: row.education_end_data,
        name: row.education_certificate
      }));
  
      const experiences = experienceResult.rows.map(row => ({
        id: row.doctor_experience_id,
        department: row.doctor_experience_department,
        firm: row.doctor_experience_firm_name,
        startDate: row.doctor_experience_start_date,
        endDate: row.doctor_experience_end_date,
        title: row.doctor_experience_job_title
      }));
  
      const data = {
        certificates,
        experiences,
        interests,
        languages
      };
  
      return data;
  
    } catch (error) {
      console.error("Error retrieving doctor further information:", error);
      throw error;
    }
  };
  
// Function to add a doctor experience
const addDoctorExperience = async (Doctorid, experience) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO doctor_experience 
          (doctor_experience_doctor_id, doctor_experience_job_title, doctor_experience_firm_name, doctor_experience_department, doctor_experience_start_date, doctor_experience_end_date)
        VALUES 
          ($1, $2, $3, $4, $5, $6)
        RETURNING doctor_experience_id
        `,
        [
          Doctorid,
          experience.doctor_experience_job_title,
          experience.doctor_experience_firm_name,
          experience.doctor_experience_department,
          experience.doctor_experience_start_date,
          experience.doctor_experience_end_date
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding doctor experience:", error);
      throw error;
    }
  };
  
  // Function to delete a doctor experience
  const deleteDoctorExperience = async (experienceId) => {
    try {
      await pool.query(
        `
        DELETE FROM doctor_experience
        WHERE doctor_experience_id = $1
        `,
        [experienceId]
      );
    } catch (error) {
      console.error("Error deleting doctor experience:", error);
      throw error;
    }
  };
  
  // Function to add a doctor education
  const addDoctorEducation = async (Doctorid, education) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO doctor_education 
          (education_doctor_id, education_certificate, education_authority, education_start_date, education_end_data)
        VALUES 
          ($1, $2, $3, $4, $5)
        RETURNING doctor_education_id
        `,
        [
          Doctorid,
          education.education_certificate,
          education.education_authority,
          education.education_start_date,
          education.education_end_data
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding doctor education:", error);
      throw error;
    }
  };
  
  // Function to delete a doctor education
  const deleteDoctorEducation = async (educationId) => {
    try {
      await pool.query(
        `
        DELETE FROM doctor_education
        WHERE doctor_education_id = $1
        `,
        [educationId]
      );
    } catch (error) {
      console.error("Error deleting doctor education:", error);
      throw error;
    }
  };
  
  // Function to add a doctor interest
  const addDoctorInterest = async (Doctorid, interest) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO doctor_interest 
          (doctor_interest_doctor_id, doctor_interest_name, doctor_interest_category)
        VALUES 
          ($1, $2, $3)
        RETURNING doctor_interest_id
        `,
        [
          Doctorid,
          interest.doctor_interest_name,
          interest.doctor_interest_category
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding doctor interest:", error);
      throw error;
    }
  };
  
  // Function to delete a doctor interest
  const deleteDoctorInterest = async (interestId) => {
    try {
      await pool.query(
        `
        DELETE FROM doctor_interest
        WHERE doctor_interest_id = $1
        `,
        [interestId]
      );
    } catch (error) {
      console.error("Error deleting doctor interest:", error);
      throw error;
    }
  };
  
  // Function to add a doctor language
  const addDoctorLanguage = async (Doctorid, language) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO languages 
          (lang_user_id, language)
        VALUES 
          ($1, $2)
        `,
        [
          Doctorid,
          language
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding doctor language:", error);
      throw error;
    }
  };
  
  // Function to delete a doctor language
  const deleteDoctorLanguage = async (languageId) => {
    try {
      await pool.query(
        `
        DELETE FROM languages
        WHERE language_id = $1
        `,
        [languageId]
      );
    } catch (error) {
      console.error("Error deleting doctor language:", error);
      throw error;
    }
  };
  
  
  



// const retrieveDoctorExperience = async (id, email) => {
//     try {
//         const query = 
//         `SELECT 
//         U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
//         D.*,
//         DEX.*
//         FROM doctor D
//         LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
//         LEFT JOIN doctor_experience DEX ON D.doctor_user_id_reference = DEX.doctor_experience_doctor_id
//         WHERE D.doctor_user_id_reference = $1 AND U.user_role = $2 AND U.user_email = $3`;

//         const result = await pool.query(query, [id, 'Doctor', email]);
//         if (result.rows.length) {
//             console.log('Doctor experience found', result.rows);
//             return result.rows;
//         }

//         console.log('Doctor experience not found');
//         return false;

//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     }
// };

// const retrieveDoctorInterests = async (id, email) => {
//     try {
//         const query = 
//         `SELECT 
//         U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
//         D.*,
//         DI.*
//         FROM doctor D
//         LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
//         LEFT JOIN doctor_interest DI ON D.doctor_user_id_reference = DI.doctor_interest_doctor_id
//         WHERE D.doctor_user_id_reference = $1 AND U.user_role = $2 AND U.user_email = $3`;

//         const result = await pool.query(query, [id, 'Doctor', email]);
//         if (result.rows.length) {
//             console.log('Doctor interests found', result.rows);
//             return result.rows;
//         }

//         console.log('Doctor interests not found');
//         return false;

//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     }
// };

// const retrieveDoctorLanguages = async (id, email) => {
//     try {
//         const query = 
//         `SELECT 
//         U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
//         D.*,
//         L.*
//         FROM doctor D
//         LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
//         LEFT JOIN languages L ON D.doctor_user_id_reference = L.lang_user_id
//         WHERE D.doctor_user_id_reference = $1 AND U.user_role = $2 AND U.user_email = $3`;

//         const result = await pool.query(query, [id, 'Doctor', email]);
//         if (result.rows.length) {
//             console.log('Doctor languages found', result.rows);
//             return result.rows;
//         }

//         console.log('Doctor languages not found');
//         return false;

//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     }
// };

// const retrieveDoctorEducation = async (id, email) => {
//     try {
//         const query = 
//         `SELECT
//         U.user_email, U.user_phone_number, U.user_gender, U.user_birth_year, U.user_first_name, U.user_last_name,
//         D.*,
//         DE.*
//         FROM doctor D
//         LEFT JOIN users U ON D.doctor_user_id_reference = U.user_id
//         LEFT JOIN doctor_education DE ON D.doctor_user_id_reference = DE.education_doctor_id
//         WHERE D.doctor_user_id_reference = $1 AND U.user_role = $2 AND U.user_email = $3`;

//         const result = await pool.query(query, [id, 'Doctor', email]);
//         if (result.rows.length) {
//             console.log('Doctor education found', result.rows);
//             return result.rows;
//         }

//         console.log('Doctor education not found');
//         return false;

//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     }
// };

const retrievePendingAppointments = async (doctorId) => {
    try {
        const query = 
        `SELECT
    a.appointment_patient_id,
    a.appointment_doctor_id,
    a.appointment_id,
    a.appointment_type,
    a.appointment_duration,
    a.appointment_complaint,
    a.appointment_parent_reference,
    a.appointment_settings_type,
    p.user_first_name AS patient_first_name,
    p.user_last_name AS patient_last_name,
    d.user_first_name AS doctor_first_name,
    d.user_last_name AS doctor_last_name,
    a.appointment_date AS doctor_availability_day_hour,
    a.time_slot_code
FROM
    appointment a
JOIN users p ON a.appointment_patient_id = p.user_id
JOIN users d ON a.appointment_doctor_id = d.user_id
WHERE
    a.appointment_doctor_id = $1 AND
    a.appointment_status = $2;`;

        const result = await pool.query(query, [doctorId, 'Pending']);
        if (result.rows.length) {
            console.log('Pending appointments found', result.rows);
            return result.rows;
        }

        console.log('No pending appointments found');
        return false;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};




module.exports = {retrieveDoctorFurtherInformation, retrievePendingAppointments, retrieveDoctorDeclinedAppointments, retrieveDoctorInfo, retrieveDoctorAppointments, retrieveDoctorReviews,
  addDoctorExperience,
  deleteDoctorExperience,
  addDoctorEducation,
  deleteDoctorEducation,
  addDoctorInterest,
  deleteDoctorInterest,
  addDoctorLanguage,
  deleteDoctorLanguage
};