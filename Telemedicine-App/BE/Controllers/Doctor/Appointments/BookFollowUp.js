const  database  = require('../../../Database/Doctor/BookFollowUp');

const bookFollowUpAppointment = async (req, res) => {
  try {
    const { appointmentId, complaint, duration, appointment_date } = req.body;
    const time_slot_code = req.body.time_slot_code;
    const patientID = await database.getPatientID(appointmentId);
    const doctorID = await database.getDoctorID(appointmentId);
    console.log(patientID);

    const appointment = await database.createFollowupAppointment(patientID ,doctorID, duration,complaint, appointmentId,  appointment_date, time_slot_code);
     if (!appointment) {
       return res.status(400).json({ message: 'Failed to create Followup appointment' });
    }

    res.status(201).json({ message: 'Followup Appointment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
 };


module.exports = { bookFollowUpAppointment };