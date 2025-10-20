const pg = require("pg");
require("dotenv").config();
const { catchAsyncError } = require("../../Utilities");
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

exports.retrieveAllPatients = async (queryOptions, fields, queryAtributes) => {
  try {
    let personalize = "";
    let query = `SELECT `;
    if (fields) {
      fields = fields.replace(
        "languages",
        "array_agg(L.language) AS languages "
      );
      query += fields.split(",");
    } else {
      query += ` 
      U.user_id , U.user_email, U.user_phone_number, U.user_gender, U.user_birth_date, U.user_first_name, U.user_last_name,
      p.patient_account_state,
      array_agg(L.language) AS languages 
      `;
    }
    let whereQuery = "";
    if (queryAtributes) {
      whereQuery = `AND ${queryAtributes}`;
    }

    query += `
    FROM users U
    LEFT JOIN languages L ON u.user_id = L.lang_user_id
    join patient p ON  U.user_id  = p.patient_user_id_reference 
    WHERE  U.user_role = $1 ${whereQuery} 
    GROUP BY U.user_id , U.user_email, U.user_phone_number, U.user_gender, U.user_birth_date, U.user_first_name, U.user_last_name , p.patient_account_state  ${queryOptions}`;
    const result = await pool.query(query, ["Patient"]);
    if (result.rows.length) {
      return result.rows;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

exports.retrieveAllDoctors = async (queryOptions, fields, queryAtributes) => {
  try {
    let query = `SELECT `;

    // To query on some fields
    if (fields) {
      query += fields;
    } else {
      query += `
        u.user_id,
        u.user_first_name, 
        u.user_last_name,
        u.user_email,
        u.user_gender,
        u.user_phone_number,
        u.user_birth_date,
        d.doctor_account_state,
        d.doctor_country, 
        d.doctor_specialization, 
        d.doctor_city, 
        d.doctor_clinic_location,
        d.doctor_sixty_min_price, 
        d.doctor_thirty_min_price, 
        doctor_image,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'title', e.doctor_experience_job_title,
              'firm', e.doctor_experience_firm_name,
              'department', e.doctor_experience_department,
              'startDate', e.doctor_experience_start_date,
              'endDate', e.doctor_experience_end_date
            )
          ) 
        ) AS experiences,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'category', i.doctor_interest_category,
              'name', i.doctor_interest_name 
            )
          ) 
        ) AS interests,
        array_agg(DISTINCT l.language) AS languages 
      `;
    }

    // Handling state and personalize conditions

    let whereQuery = queryAtributes;
    if (whereQuery) {
      whereQuery = `WHERE ${whereQuery} `;
    }
    console.log(whereQuery);
    // if (state) {
    //   whereClause.push(`d.doctor_account_state = '${state}'`);
    // }
    // if (id) {
    //   whereClause.push(`u.user_id = ${id}`);
    // } else if (email) {
    //   whereClause.push(`u.user_email = '${email}'`);
    // }

    // let whereQuery =
    //   whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    // Construct the rest of the query
    query += `           
        FROM 
          users u
        JOIN 
          doctor d ON u.user_id = d.doctor_user_id_reference
        LEFT JOIN 
          languages l ON u.user_id = l.lang_user_id
        LEFT JOIN 
          doctor_experience e ON u.user_id = e.doctor_experience_doctor_id 
        LEFT JOIN 
          doctor_interest i ON u.user_id = i.doctor_interest_doctor_id 
        ${whereQuery}
        GROUP BY 
          u.user_id, 
          u.user_first_name, 
          u.user_last_name, 
          u.user_email, 
          u.user_gender, 
          u.user_phone_number, 
          u.user_birth_date, 
          d.doctor_account_state,
          d.doctor_country, 
          d.doctor_city, 
          d.doctor_clinic_location, 
          d.doctor_sixty_min_price, 
          d.doctor_thirty_min_price, 
          d.doctor_specialization, 
          doctor_image
        ${queryOptions || ""}
    `;

    const result = await pool.query(query);
    return result.rows.length ? result.rows : false;
  } catch (err) {
    throw err;
  }
};
exports.changePersonState = async (user, id, state) => {
  try {
    const query = `UPDATE ${user} SET ${user}_account_state=$1 WHERE ${user}_user_id_reference=$2 RETURNING ${user}_user_id_reference`;
    const result = await pool.query(query, [state, id]);

    if (result.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${user} state:`, error);
    throw new Error(`Failed to update ${user} state`);
  }
};

//to get all appointments for patient flag =true  , for doctor flag =false;
exports.retrieveApppointmentsDetails = async (id, flag) => {
  try {
    let desired = "p.user_id";
    console.log(flag);
    if (!flag) {
      desired = "d.user_id";
    }
    console.log(desired);
    const query = `SELECT
      p.user_id AS patient_id ,
      p.user_first_name AS patient_first_name,
      p.user_last_name AS patient_last_name,
      p.user_email AS patient_email , 
      p.user_birth_date AS patient_birth_date ,
      p.user_phone_number AS patient_phone_number ,
      d.user_id AS doctor_id , 
      d.user_first_name AS doctor_first_name,
      d.user_last_name AS doctor_last_name,
      a.appointment_id,
      a.appointment_type,
      a.appointment_duration,
      a.appointment_complaint,
      a.appointment_status,
      a.appointment_parent_reference,
      a.appointment_settings_type,
      a.appointment_date AS doctor_availability_day_hour,
      doc.doctor_specialization,
      doc.doctor_clinic_location
  FROM
      appointment a
  JOIN users p ON a.appointment_patient_id = p.user_id
  JOIN users d ON a.appointment_doctor_id = d.user_id
  JOIN doctor doc ON a.appointment_doctor_id = doc.doctor_user_id_reference
  WHERE
      ${desired} = $1`;
    const result = await pool.query(query, [id]);
    return result.rows.length ? result.rows : false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
