const database = require('../../../Database/Doctor/Patient Prescription/Add');

const addPatientPrescription = async (req, res) => {
    const doctorId = req.id;
    const appointmentId = req.params.appointmentId;
    const medicationDataList = req.body.medicationData;
    let message = '';

    if (!doctorId) {
        message = 'Doctor ID not found';
        return res.status(404).json({ message });
    }
    if (!appointmentId) {
        message = 'Appointment ID not found';
        return res.status(404).json({ message });
    }
    if (!medicationDataList) {
        message = 'Medication data not found';
        return res.status(404).json({ message });
    }

    try {
        const prescription = await database.insertPatientPrescription(doctorId, appointmentId, medicationDataList);
        if (!prescription) {
            message = 'Could not add prescription';
            return res.status(400).json({ message });
        }
        return res.json({ message: 'Prescription added successfully', prescription });
    } catch (error) {
        console.error('Error adding prescription:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { addPatientPrescription};