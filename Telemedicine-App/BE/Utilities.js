const { query } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ACCESS_TOKEN_EXPIRATION_IN_DAYS, ACCESS_TOKEN_SECRET_KEY } =
  process.env;

const passwordValidation = (str) => {
  const hasNumbers = /\d/.test(str);
  const hasAlphabets = /[a-zA-Z]/.test(str);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(str);

  return hasNumbers && hasAlphabets && hasSpecialChars && str.length >= 8;
};

const splitAndToLower = (str) => {
  const [str_1, str_2] = str.split(" ");
  if (str_1 && str_2) {
    return [str_1.toLowerCase(), str_2.toLowerCase()];
  }
  return [str_1 ? str_1.toLowerCase() : "", str_2 ? str_2.toLowerCase() : ""];
};

const createToken = (id, email, role, firstName, lastName) => {
  if (!id || !email || !role || !firstName || !lastName) {
    console.log("Please provide all required fields.");
    return false;
  }
  return jwt.sign(
    { id, email, role, firstName, lastName },
    ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION_IN_DAYS,
    }
  );
};

const createAppointmentToken = (patientId, doctorId) => {
  return jwt.sign({ patientId, doctorId }, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_IN_DAYS,
  });
};

const dateValidation = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    console.log("Invalid date format. Please provide a valid date and time.");
    return false;
  }
  const currentDate = new Date();
  const sixHoursLater = new Date(currentDate.getTime() + 6 * 60 * 60 * 1000);
  if (dateObj <= sixHoursLater) {
    console.log("Date must be at least 6 hours in the future.");
    return false;
  }
  return true;
};
//prescription validation by  yahya
const validatePrescriptionData = (medicationData) => {
  // Check if medicationData is an array
  if (!Array.isArray(medicationData)) {
    return false;
  }

  // Validate each medication object
  for (const medication of medicationData) {
    if (
      !medication.medicationName ||
      typeof medication.medicationName !== "string"
    ) {
      return false;
    }
    if (!medication.dosage || typeof medication.dosage !== "string") {
      return false;
    }
  }

  return true;
};

function mapPrescriptionData(prescriptionData) {
  return prescriptionData.map((prescription) => ({
    mid: prescription.prescription_id,
    doctorName: prescription.doctor_name, // Use empty strings if names are missing
    doctorImage: "/assets/doctorM.jpg", // Replace with actual image URL
    visitDate: prescription.doctor_availability_day_hour, // Set null for missing appointment ID
    specialty: prescription.doctor_specialization || null, // Set null for missing specialization
    medicationList: prescription.medications.map((medication) => ({
      id: medication.prescription_medication_reference_id,
      name: medication.prescription_medication_name,
      dose: medication.prescription_medications_dosage,
      frequency: medication.prescription_medications_dosage,
      start: medication.prescription_medications_end_date,
      end: medication.prescription_medications_end_date,
    })),
  }));
}
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}
const globalErrorHanlder = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    ok: false,
    message: err.message,
    err,
  });
};
const restrictTo = (...roles) => {
  return (req, res, next) => {
    const { role } = req;
    console.log("role123", role);
    if (!roles.includes(role))
      return next(
        new AppError(
          `Role '${role}' is not allowed to reach this data....💣💣⛔`,
          401
        )
      );

    next();
  };
};

const queryHandler = (query) => {
  // const validParams = ['user_email' , 'user_phone_number' , 'user_gender' ,'user_birth_date' , 'user_first_name' ,'user_last_name']
  let { order, limit } = query;
  if (!limit || !Number.isInteger(+limit) || +limit > 10000 || +limit < 0) {
    limit = 100;
  }
  console.log(limit);
  let queryOptions = "";

  if (order) {
    const orderArr = order.split(",");
    const orderDir = orderArr
      .map((el, i) => {
        if (el.startsWith("-")) {
          orderArr[i] = el.slice(1);
          return "DESC";
        }
        return "ASC";
      })
      .join("|");
    // const isValidCol = orderArr.every((el) => validCol.includes(el));
    // if (!isValidCol) {
    //   return next(new AppError("Invalid order fields....", 400));
    // }
    queryOptions = `ORDER BY ${orderArr.join(" ")} ${orderDir}         `;
    queryOptions += ` LIMIT ${limit} `;
  }
  delete query.limit;
  delete query.order;
  const arr = Object.entries(query);

  let queryAtributes = arr
    .map((atribute) => {
      if (atribute[0] === "user_id") return `${atribute[0]} = ${+atribute[1]}`;

      if (atribute[0] === "user_phone_number") {
        return `${atribute[0]} = '+${atribute[1]}'`;
      }
      if (
        atribute[0] === "user_first_name" ||
        atribute[0] === "user_last_name"
      ) {
        return `${atribute[0]} = '${
          atribute[1][0].toUpperCase() + atribute[1].slice(1).toLowerCase()
        }'`;
      }
      return `${atribute[0]} = '${atribute[1]}'`;
    })
    .join(" AND ");
  console.log(queryAtributes);

  return { queryOptions, queryAtributes };
  //
};

const createResetPasswordToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
};
// module.exports = AppError;

module.exports = {
  passwordValidation,
  splitAndToLower,
  createToken,
  createAppointmentToken,
  dateValidation,
  validatePrescriptionData,
  mapPrescriptionData,
  AppError,
  catchAsyncError,
  globalErrorHanlder,
  restrictTo,
  queryHandler,
  createResetPasswordToken,
};
