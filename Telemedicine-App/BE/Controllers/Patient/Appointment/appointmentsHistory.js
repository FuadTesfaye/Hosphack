const  database  = require('../../../Database/Patient/Appointment/appointmentHistory');

// not tested with new data model

const appointmentsHistory = async (req, res) => {
    const patientId = req.id; //  patient ID is retrieved from req.id
    const patientEmail = req.email;
    console.log(patientId, patientEmail);
    try {
      const appointments = await database.retrievePatientAppointmentsHistory(patientId);
  
      if (!appointments.length) {
        return res.json({ message: 'No Completed appointments found' });
      }  
      return res.json({ appointments });
    } catch (error) {
      console.error('Error retrieving patient requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { appointmentsHistory };