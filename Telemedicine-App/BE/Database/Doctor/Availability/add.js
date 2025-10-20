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
const insertTimeslots = async (data, doctorId) => {
  try {
    const client = await pool.connect(); // Create a connection to the database pool

    try {
      await client.query("BEGIN"); // Start a transaction

      // Loop through each timeslot code in the data array
      for (const timeslotCode of data) {
        const [day_code, time_code, type_code] = timeslotCode.split("_"); // Extract number, type, and suffix

        // Validate extracted values (optional, consider input validation)
        if (!day_code || !time_code || !type_code) {
          throw new Error("Invalid timeslot code format");
        }
        const timeslotData = {
          timeslot_code: `${day_code}_${time_code}`, // Combine number and suffix
          timeslot_type: type_code,
          timeslot_doctor_id: doctorId,
        };
        // Check if the timeslot already exists
        const existsResult = await client.query(
          `SELECT 1 FROM timeslots 
          WHERE timeslot_code = $1 
          AND timeslot_type = $2 
          AND timeslot_doctor_id = $3`,
          [
            timeslotData.timeslot_code,
            timeslotData.timeslot_type,
            timeslotData.timeslot_doctor_id,
          ]
        );

        if (existsResult.rows.length === 0) {
          // Insert only if the timeslot doesn't exist
          await client.query(
            `INSERT INTO timeslots (timeslot_code, timeslot_type, timeslot_doctor_id) 
             VALUES ($1, $2, $3)`,
            [
              timeslotData.timeslot_code,
              timeslotData.timeslot_type,
              timeslotData.timeslot_doctor_id,
            ]
          );
        } else {
          console.log("Duplicate timeslot found:", timeslotCode);
          // You might want to handle duplicates differently (e.g., throw an error, update the existing record, etc.)
        }
        // Insert the timeslot data
      }

      await client.query("COMMIT"); // Commit the transaction
      return true; // Indicate successful insertion
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback the transaction if error occurs
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      client.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error(error);
    return false; // Indicate unsuccessful insertion
  }
};

module.exports = { insertTimeslots };
