const  database  = require('../../Database/Patient/Profile');

const patientInfo = async (req, res) => {
    const patientUserId = req.id;
    const patientEmail = req.email;
    let message = '';
    if (!patientUserId) {
        message = 'Patient ID not found';
        return res.status(404).json(message);
    }
    if (!patientEmail) {
        message = 'Patient email not found';
        return res.status(404).json(message);
    }
    const patient = await database.retrievePatientInfo(patientUserId);
    if (!patient) {
        message = 'Could not retrieve patient info';
        return res.status(400).json(message);
    }
    
    const formattedPatient = {
        firstName: patient[0].user_first_name,
        lastName: patient[0].user_last_name,
        email: patient[0].user_email,
        gender: patient[0].user_gender,
        phone: patient[0].user_phone_number,
        birthYear: patient[0].user_birth_year,
        languages: patient[0].languages
    };
    message = 'Patient info retrieved successfully';
    return res.json({ message, formattedPatient });
};

// not tested with new data model
const patientViewRequests = async (req, res) => {
    const patientId = req.id; //  patient ID is retrieved from req.id
    const patientEmail = req.email;
    try {
      const appointments = await database.getPatientRequests(patientId);
  
      if (!appointments.length) {
        return res.json({ message: 'No pending or declined appointments found' });
      
          };
      return res.json({ appointments });
    } catch (error) {
      console.error('Error retrieving patient requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const patientAppointments = async (req, res) => {
    const patientId = req.id; //  patient ID is retrieved from req.id
    const patientEmail = req.email;
    try {
      const appointments = await database.retrievePatientAppointments(patientId);
  
      if (!appointments.length) {
        return res.json({ message: 'No Approved appointments found' });
      }  
      return res.json({ appointments });
    } catch (error) {
      console.error('Error retrieving patient requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// need to be edited to new version of this function
// const patientAppointments = async (req, res) => {
//     const patientUserId = req.id;
//     const patientEmail = req.email;
//     let message = '';
//     if (!patientUserId) {
//         message = 'Patient ID not found';
//         return res.status(404).json(message);
//     }
//     if (!patientEmail) {
//         message = 'Patient email not found';
//         return res.status(404).json(message);
//     }
//     const appointments = await database.retrievePatientAppointments(patientUserId, patientEmail);
//     if (!appointments) {
//         message = 'Could not retrieve patient appointments';
//         return res.status(400).json(message);
//     }
//     return res.json(appointments);
// };

const patientDoctors = async (req, res) => {
    const patientUserId = req.id;
    const patientEmail = req.email;
    let message = '';
    if (!patientUserId) {
        message = 'Patient ID not found';
        return res.status(404).json(message);
    }
    if (!patientEmail) {
        message = 'Patient email not found';
        return res.status(404).json(message);
    }
    const doctors = await database.retrievePatientDoctors(patientUserId, patientEmail);
    if (!doctors) {
        message = 'Could not retrieve patient doctors';
        return res.status(400).json(message);
    }
    return res.json(doctors);
};

const patientReviews = async (req, res) => {
    const patientUserId = req.id;
    const patientEmail = req.email;
    let message = '';
    if (!patientUserId) {
        message = 'Patient ID not found';
        return res.status(404).json(message);
    }
    if (!patientEmail) {
        message = 'Patient email not found';
        return res.status(404).json(message);
    }
    const reviews = await database.retrievePatientReviews(patientUserId, patientEmail);
    if (!reviews) {
        message = 'Could not retrieve reviews';
        return res.status(400).json(message);
    }
    return res.json(reviews);
};

module.exports = { patientInfo, 
    patientAppointments, 
    patientDoctors, 
    patientReviews,
    patientViewRequests };