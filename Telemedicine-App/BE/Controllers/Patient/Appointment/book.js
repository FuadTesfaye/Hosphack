const  database  = require('../../../Database/Patient/Appointment/Book');
const  {sendPushNotification, addNotification}  = require('../../notifications');

const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, complaint, duration, appointment_type, appointment_date } = req.body;
    const patientId = req.id; // patient ID is available in req.id
    const time_slot_code = req.body.time_slot_code;
   
    const appointment = await database.createAppointmentEntry(time_slot_code,patientId, doctor_id, complaint, duration, appointment_type,appointment_date);
    if (!appointment) {
      return res.status(400).json({ message: 'Failed to create appointment' });
    }else {
      const title="New Appointment Request"
      const body=`A new appointment request has been made by the patient. at ${appointment_date}`
      await addNotification(doctor_id, "New Appointment Request", `A new appointment request has been made by the patient. at ${appointment_date}`, 20)
      sendPushNotification (doctor_id, title, body)
      res.status(201).json({ message: 'Appointment created successfully' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { bookAppointment };