const database = require("../../Database/Doctor/Register");
const { passwordValidation } = require("../../Utilities");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const doctorRegister = async (req, res) => {
  let message = "";
  const { personalInfo, certificates, experiences, interests, Languages } =
    req.body;
  // if (
  //   !personalInfo.firstName ||
  //   !personalInfo.lastName ||
  //   !personalInfo.birthdate ||
  //   !personalInfo.email ||
  //   !personalInfo.gender ||
  //   !personalInfo.password ||
  //   !personalInfo.phone ||
  //   !personalInfo.speciality
  // ) {
  //   message = "Please fill all personalInfo fields";
  //   console.log(message);
  //   return res.status(400).json({ message });
  // }
  const emailFlag = await database.checkUserEmail(personalInfo.email);
  if (emailFlag) {
    message = "Email already exists";
    console.log(message);
    return res.status(400).json({ message });
  }
  const passwordFlag = passwordValidation(personalInfo.password);
  if (!passwordFlag) {
    message =
      "Password must contain at least 8 characters, one number, one alphabet, and one special character";
    console.log(message);
    return res.status(400).json({ message });
  }
  const hashedPassword = await bcrypt.hash(personalInfo.password, saltRounds);
  personalInfo.firstName =
    personalInfo.firstName[0].toUpperCase() +
    personalInfo.firstName.slice(1).toLowerCase();
  personalInfo.lastName =
    personalInfo.lastName[0].toUpperCase() +
    personalInfo.lastName.slice(1).toLowerCase();
  const user = {
    fName: personalInfo.firstName,
    lName: personalInfo.lastName,
    email: personalInfo.email,
    phone: personalInfo.phone,
    gender: personalInfo.gender,
    role: "Doctor",
    password: hashedPassword,
    birthDate: personalInfo.birthdate,
    speciality: personalInfo.speciality,
    country: personalInfo.country,
    city: personalInfo.city,
    location: personalInfo.location,
    state: "On_hold",
  };
  const doctor = await database.insertDoctor(user);
  console.log(doctor);
  if (doctor) {
    message = "Doctor created successfully";
    try {
      const added_certificates = await database.saveDoctorcertificates(
        certificates,
        doctor.user_id
      );
      const added_experiences = await database.saveDoctorexperiences(
        experiences,
        doctor.user_id
      );
      const added_interests = await database.saveDoctorinterests(
        interests,
        doctor.user_id
      );
      const added_Languages = await database.saveDoctorlanguage(
        Languages,
        doctor.user_id
      );
      return res.json({
        message: message,
        doctor: doctor,
        certificates: added_certificates,
        experiences: added_experiences,
        interests: added_interests,
        Languages: added_Languages,
      });
    } catch (error) {
      console.error("Error saving additional doctor data:", error.stack);
      // Handle errors appropriately, e.g., rollback database changes if possible
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  message = "Could not create doctor";
  return res.status(400).json({ message });
};

module.exports = { doctorRegister };
