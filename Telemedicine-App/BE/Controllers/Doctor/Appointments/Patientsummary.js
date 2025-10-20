const  database  = require('../../../Database/Doctor/Patientsummary');

// not tested with new data model
const getPatientSummary = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const appointments = await database.getAppointmentSummary(patientId);

    if (!appointments.length) {
      return res.json({ message: 'No Completed appointments found' });
    }  
    return res.json({ appointments });
  } catch (error) {
    console.error('Error retrieving patient requests:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { getPatientSummary };
