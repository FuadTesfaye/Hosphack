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


const deleteTimeslots = async (timeslotCodes, doctorId) => {
    try {
      const client = await pool.connect(); // Create a connection to the database pool
  
      try {
        await client.query('BEGIN'); // Start a transaction
  
        // Loop through each timeslot code in the data array
        for (const timeslotCode of timeslotCodes) {
          // Extract day code and time code
          const [day_code, time_code] = timeslotCode.split('_');
  
          // Construct the DELETE query
          const deleteQuery = `
            DELETE FROM timeslots
            WHERE timeslot_doctor_id = $1 AND timeslot_code = $2
          `;
  
          // Execute the DELETE query
          await client.query(deleteQuery, [doctorId, `${day_code}_${time_code}`]);
        }
  
        await client.query('COMMIT'); // Commit the transaction
        return true; // Indicate successful deletion
  
      } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction if error occurs
        throw error; // Re-throw the error to be handled by the controller
      } finally {
        client.release(); // Release the connection back to the pool
      }
  
    } catch (error) {
      console.error(error);
      return false; // Indicate unsuccessful deletion
    }
  };

module.exports = { deleteTimeslots };