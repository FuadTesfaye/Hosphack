const database = require("../../Database/Patient/Register");
const { passwordValidation } = require("../../Utilities");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const patientRegister = async (req, res) => {
  let message = "";
  const { fName, lName, email, password, gender, phone, birthDate } = req.body;
  if (
    !fName ||
    !lName ||
    !email ||
    !password ||
    !gender ||
    !phone ||
    !birthDate
  ) {
    message = "Please fill all the fields";
    console.log(message);
    return res.status(404).json({ message });
  }
  const emailFlag = await database.checkUserEmail(email);
  if (emailFlag) {
    message = "Email already exists";
    console.log(message);
    return res.status(400).json({ message });
  }
  const passwordFlag = passwordValidation(password);
  if (!passwordFlag) {
    message =
      "Password must contain at least 8 characters, one number, one alphabet, and one special character";
    console.log(message);
    return res.status(400).json({ message });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  req.body.fName =
    req.body.fName[0].toUpperCase() + req.body.fName.slice(1).toLowerCase();
  req.body.lName =
    req.body.lName[0].toUpperCase() + req.body.lName.slice(1).toLowerCase();
  const user = {
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    role: "Patient",
    password: hashedPassword,
    birthDate: req.body.birthDate,
  };
  const patient = await database.insertPatient(user);
  if (patient) {
    message = "Patient created successfully";
    console.log(message, patient);
    return res.json({ message: message, patient: patient });
  }
  message = "Could not create patient";
  return res.status(400).json({ message });
};

module.exports = { patientRegister };
