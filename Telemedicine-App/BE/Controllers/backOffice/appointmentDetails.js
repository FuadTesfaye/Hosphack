const  database  = require('../../Database/backOffice/appointmentDetails');

// not tested with new data model

const AppointmentDetails = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    try {
        const appointment = await database.getAppointmentDetails(appointmentId);
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
  
        const appointmentResults = await database.getAppointmentResults(appointmentId);
        const treatmentPlan = await database.getTreatmentPlan(appointmentId);
        const medications = await database.getMedications(treatmentPlan.treatment_plan_id);
        const medicalDocuments = await database.getMedicalDocuments(appointmentId, treatmentPlan.treatment_plan_id);
       
  
        const formattedAppointment = {
          ...appointment,
          appointmentResults,
          treatmentPlan,
          medications,
          medicalDocuments,
        };
        
        return res.json({ appointment: formattedAppointment });
    } catch (error) {
      console.error('Error retrieving appointment details:', error);
      return res.status(500).json({ message: error.message });
    }
    
  };
  
  module.exports = { AppointmentDetails };