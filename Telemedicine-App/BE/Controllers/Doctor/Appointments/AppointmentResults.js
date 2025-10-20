const database = require('../../../Database/Doctor/AppointmentResults');
const {addNotification} = require('../../notifications');

// Appointment result submission form
const AppointmentResultSubmission = async (req, res) => {
    try {
        const { appointment_id, diagnosis, medications, operations, report, specialityReferral, specialityReferralNotes, patient_id } = req.body;
    
        // Insert data into appointment_results table
        const appointmentResultsData = {
            diagnosis,
            report,
          results_appointment_reference: appointment_id
        };
        const appointmentResultsId = await database.insertAppointmentResults(appointmentResultsData);
    
        // Insert data into treatment_plan table
        const treatmentPlanData = {
          treatment_plan_appointment_reference: appointment_id,
          operations,
          specialityReferral,
          specialityReferralNotes
        };
        const treatmentPlanId = await database.insertTreatmentPlan(treatmentPlanData);
    
        // Insert data into medications table
        const medicationsData = medications.map(medication => {
            console.log("Original medication object:", medication);
            return {
              treatmentPlanId,
              medication_name: medication.drugName,
              medication_dosage: medication.dose,
              medication_note: medication.note,
              medication_start_date: medication.startDate,
              medication_end_date: medication.endDate
            };
          });
        console.log("Original medication medicationsData:", medicationsData);
        await database.insertMedications(medicationsData);
    
        // Update appointment status to "Completed"
        await database.updateAppointmentStatus(appointment_id, 'Completed');
    
        await addNotification(patient_id, `Doctor has submitted your results`, `Your appointment with the doctor has been completed.`, 12)

        res.status(200).json({ message: 'Appointment results submitted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };
module.exports = { AppointmentResultSubmission };
