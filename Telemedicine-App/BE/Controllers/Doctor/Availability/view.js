const database = require('../../../Database/Doctor/Availability/view');
const viewDoctorTimeslots = async (req, res) => {
    try {
      const doctorId = req.id; // Assuming doctor ID is available in req.id
  
      const timeslots = await database.getDoctorTimeslots(doctorId);
  
      if (timeslots.length > 0) {
        res.status(200).json({ timeslots });
      } else {
        res.status(404).json({ message: 'No timeslots found for the doctor' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving timeslots' });
    }
  };
module.exports = { viewDoctorTimeslots};