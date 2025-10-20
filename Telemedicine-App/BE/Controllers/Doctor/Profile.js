const database = require("../../Database/Doctor/Profile");

const doctorInfo = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";
  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json(message);
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json(message);
  }
  const doctor = await database.retrieveDoctorInfo(doctorUserId, doctorEmail);
  if (!doctor) {
    message = "Could not retrieve doctor info";
    return res.status(400).json(message);
  }
  const formattedDoctor = {
    firstName: doctor[0].user_first_name,
    lastName: doctor[0].user_last_name,
    email: doctor[0].user_email,
    gender: doctor[0].user_gender,
    phone: doctor[0].user_phone_number,
    birthYear: doctor[0].user_birth_year,
    image: doctor[0].doctor_image,
    residenceCountry: doctor[0].doctor_country,
    sixtyMinPrice: doctor[0].doctor_sixty_min_price,
    thirtyMinPrice: doctor[0].doctor_thirty_min_price,
    specialization: doctor[0].doctor_specialization,
    languages: doctor[0].languages,
    rating: doctor[0].doctor_rating,
    reviewCount: doctor[0].review_count
  };
  message = "Doctor info retrieved successfully";
  return res.json({ message, formattedDoctor });
};

const doctorPatients = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";
  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json(message);
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json(message);
  }
  const patients = await database.retrieveDoctorPatients(
    doctorUserId,
    doctorEmail
  );
  if (!patients) {
    message = "No pending requests found ";
    return res.status(400).json(message);
  }
  return res.json(patients);
};
// Doctor View pending requests
const doctorPendingRequests = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";

  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json({ message });
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json({ message });
  }

  const pendingAppointments = await database.retrievePendingAppointments(
    doctorUserId
  );
  if (!pendingAppointments) {
    message = "No pending requests found";
    return res.status(400).json({ message });
  }

  return res.json(pendingAppointments);
};

// view doctors coming appointments.
const doctorAppointments = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";

  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json({ message });
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json({ message });
  }

  const pendingAppointments = await database.retrieveDoctorAppointments(
    doctorUserId
  );
  if (!pendingAppointments) {
    message = "No coming appointments found";
    return res.status(400).json({ message });
  }

  return res.json(pendingAppointments);
};

// view doctors declined appointments.
const doctorDeclinedRequests = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";

  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json({ message });
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json({ message });
  }

  const pendingAppointments = await database.retrieveDoctorDeclinedAppointments(
    doctorUserId
  );
  if (!pendingAppointments) {
    message = "No declined requests found";
    return res.status(400).json({ message });
  }

  return res.json(pendingAppointments);
};

const doctorReviews = async (req, res) => {
  const doctorUserId = req.id;
  const doctorEmail = req.email;
  let message = "";
  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json(message);
  }
  if (!doctorEmail) {
    message = "Doctor email not found";
    return res.status(404).json(message);
  }
  const reviews = await database.retrieveDoctorReviews(
    doctorUserId,
    doctorEmail
  );
  if (!reviews) {
    message = "No reviews found";
    return res.status(400).json(message);
  }
  return res.json(reviews);
};
const doctor_Further_Informtion = async (req, res) => {
  const doctorUserId = req.id;
  let message = "";
  if (!doctorUserId) {
    message = "Doctor ID not found";
    return res.status(404).json(message);
  }
  const FurtherInformation = await database.retrieveDoctorFurtherInformation(
    doctorUserId
  );
  if (!FurtherInformation) {
    message = "No Further Information found";
    return res.status(400).json(message);
  }
  return res.json(FurtherInformation);
};

const addDoctorExperience = async (req, res) => {
  const doctorUserId = req.id;
  const experience = req.body.experience;

  if (!doctorUserId || !experience) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newExperience = await database.addDoctorExperience(
      doctorUserId,
      experience
    );
    return res.status(201).json({ message: "New experience added" });
  } catch (error) {
    console.error("Error adding experience:", error);
    return res.status(500).json({ message: "Error adding experience" });
  }
};

const deleteDoctorExperience = async (req, res) => {
  const experienceId = req.params.doctor_experience_id;

  if (!experienceId) {
    return res.status(400).json({ message: "Experience ID is required" });
  }

  try {
    await database.deleteDoctorExperience(experienceId);
    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res.status(500).json({ message: "Error deleting experience" });
  }
};

const addDoctorEducation = async (req, res) => {
  const doctorUserId = req.id;
  const education = req.body.education;

  if (!doctorUserId || !education) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newEductaion = await database.addDoctorEducation(
      doctorUserId,
      education
    );
    return res.status(201).json({ message: "New certificate added" });
  } catch (error) {
    console.error("Error adding education:", error);
    return res.status(500).json({ message: "Error adding eductation" });
  }
};

const deleteDoctorEducation = async (req, res) => {
  const educationId = req.params.doctor_education_id;

  if (!educationId) {
    return res.status(400).json({ message: "EducationId ID is required" });
  }

  try {
    await database.deleteDoctorEducation(educationId);
    return res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting Education:", error);
    return res.status(500).json({ message: "Error deleting Education" });
  }
};

const addDoctorInterest = async (req, res) => {
  const doctorUserId = req.id;
  const Interest = req.body.Interest;

  if (!doctorUserId || !Interest) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newInterest = await database.addDoctorInterest(
      doctorUserId,
      Interest
    );
    return res.status(201).json({ message: "New Interest added" });
  } catch (error) {
    console.error("Error adding Interest:", error);
    return res.status(500).json({ message: "Error adding Interest" });
  }
};

const deleteDoctorInterest = async (req, res) => {
  const interestId = req.params.doctor_interest_id;
  console.log(interestId);
  if (!interestId) {
    return res.status(400).json({ message: "interest ID is required" });
  }

  try {
    await database.deleteDoctorInterest(interestId);
    return res.status(200).json({ message: "Interest deleted successfully" });
  } catch (error) {
    console.error("Error deleting Interest:", error);
    return res.status(500).json({ message: "Error deleting Interest" });
  }
};

const addDoctorLanguage = async (req, res) => {
  const doctorUserId = req.id;
  const language = req.body.language;
  console.log(language);

  if (!doctorUserId || !language) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newLanguage = await database.addDoctorLanguage(
      doctorUserId,
      language
    );
    return res.status(201).json({ message: "New Language added" });
  } catch (error) {
    console.error("Error adding language:", error);
    return res.status(500).json({ message: "Error adding language" });
  }
};

const deleteDoctorLanguage = async (req, res) => {
  const language_id = req.params.language_id;

  if (!language_id) {
    return res.status(400).json({ message: "language_id ID is required" });
  }

  try {
    await database.deleteDoctorLanguage(language_id);
    return res.status(200).json({ message: "Language deleted successfully" });
  } catch (error) {
    console.error("Error deleting Language:", error);
    return res.status(500).json({ message: "Error deleting Language" });
  }
};

// const doctorExperience = async (req, res) => {
//     const doctorUserId = req.id;
//     const doctorEmail = req.email;
//     let message = '';
//     if (!doctorUserId) {
//         message = 'Doctor ID not found';
//         return res.status(404).json(message);
//     }
//     if (!doctorEmail) {
//         message = 'Doctor email not found';
//         return res.status(404).json(message);
//     }
//     const experience = await database.retrieveDoctorExperience(doctorUserId, doctorEmail);
//     if (!experience) {
//         message = 'No experience found';
//         return res.status(400).json(message);
//     }
//     return res.json(experience);
// }

// const doctorEducation = async (req, res) => {
//     const doctorUserId = req.id;
//     const doctorEmail = req.email;
//     let message = '';
//     if (!doctorUserId) {
//         message = 'Doctor ID not found';
//         return res.status(404).json(message);
//     }
//     if (!doctorEmail) {
//         message = 'Doctor email not found';
//         return res.status(404).json(message);
//     }
//     const education = await database.retrieveDoctorEducation(doctorUserId, doctorEmail);
//     if (!education) {
//         message = 'Could not retrieve education';
//         return res.status(400).json(message);
//     }
//     return res.json(education);
// }

// const doctorInterests = async (req, res) => {
//     const doctorUserId = req.id;
//     const doctorEmail = req.email;
//     let message = '';
//     if (!doctorUserId) {
//         message = 'Doctor ID not found';
//         return res.status(404).json(message);
//     }
//     if (!doctorEmail) {
//         message = 'Doctor email not found';
//         return res.status(404).json(message);
//     }
//     const interests = await database.retrieveDoctorInterests(doctorUserId, doctorEmail);
//     if (!interests) {
//         message = 'Could not retrieve interests';
//         return res.status(400).json(message);
//     }
//     return res.json(interests);
// }

// const doctorLanguages = async (req, res) => {
//     const doctorUserId = req.id;
//     const doctorEmail = req.email;
//     let message = '';
//     if (!doctorUserId) {
//         message = 'Doctor ID not found';
//         return res.status(404).json(message);
//     }
//     if (!doctorEmail) {
//         message = 'Doctor email not found';
//         return res.status(404).json(message);
//     }
//     const languages = await database.retrieveDoctorLanguages(doctorUserId, doctorEmail);
//     if (!languages) {
//         message = 'Could not retrieve languages';
//         return res.status(400).json(message);
//     }
//     return res.json(languages);
// }

module.exports = {
  doctor_Further_Informtion,
  doctorDeclinedRequests,
  doctorInfo,
  doctorPatients,
  doctorAppointments,
  doctorReviews,
  doctorPendingRequests,
  addDoctorExperience,
  addDoctorEducation,
  addDoctorLanguage,
  addDoctorInterest,
  deleteDoctorEducation,
  deleteDoctorExperience,
  deleteDoctorInterest,
  deleteDoctorLanguage,
};
