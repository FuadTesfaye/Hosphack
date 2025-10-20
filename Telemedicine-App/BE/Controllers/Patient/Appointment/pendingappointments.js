const  database  = require('../../../Database/Patient/Appointment/pendingappointments');

// not tested with new data model

const pendingappointments = async (req, res) => {
    const patientId = req.id; //  patient ID is retrieved from req.id
    const patientEmail = req.email;
    try {
      const appointments = await database.retrievependingappointments(patientId);
  
      if (!appointments.length) {
        return res.json({ message: 'No Completed appointments found' });
      }  
      return res.json({ appointments });
    } catch (error) {
      console.error('Error retrieving patient requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { pendingappointments };