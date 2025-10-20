const  database  = require('../../../Database/Doctor/AppointmentResponse');
const  {addNotification}  = require('../../notifications');
// confirm /decline appointments requests

const doctorAppointmentResponse = async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const response = req.params.response;
  const patientId = req.params.patientId;

  try {
    if (response === 'accept') {
      await database.acceptAppointment(appointmentId);
      await addNotification(patientId, "Doctor Accepted Your Appointment", `A new appointment request has been accepted by the doctor.`, 10)
      return res.json({ message: 'Appointment accepted successfully' });
    } else if (response === 'decline') {
      await database.declineAppointment(appointmentId);
      await addNotification(patientId, "Doctor Rejected Your Appointment", `A new appointment request has been rejected by the doctor.`, 11)
      return res.json({ message: 'Appointment declined successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid response. Must be "accept" or "decline"' });
    }
  } catch (error) {
    console.error('Error responding to appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 

module.exports = { doctorAppointmentResponse };