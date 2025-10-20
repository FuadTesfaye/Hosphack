const database = require("../../../Database/Patient/Appointment/patientGetAvailabilities");

const patientGetAvailabilities = async (req, res) => {
  try {
      // Check if req.params.doctorId is "00"
      const doctorId = req.params.doctorId === "00" ? req.id : req.params.doctorId; 
console.log(doctorId);
    // const doctorId = req.params.doctorId;
    const available_slots = await database.getDoctorTimeslots(doctorId);
    const booked = await database.getDoctorAvailabilityDetails(doctorId);

    res.status(200).json({ available_slots, booked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving availability" });
  }
};

module.exports = { patientGetAvailabilities };
