const  database  = require('../../Database/Patient/Edit');
const { passwordValidation } = require('../../Utilities');

const editInfo = async (req, res) => {
    const patientId = req.id;
    const patientEmail = req.email;
    let message = '';
    if (!patientId) {
        message = 'Patient ID not found';
        console.log(message);
        return res.status(404).json({ message });
    }
    if (!patientEmail) {
        message = 'Patient email not found';
        console.log(message);
        return res.status(404).json({ message });
    }
    const { firstName, lastName, gender, phone, birthDate, languages } = req.body;
    const updatedInfo = {
        user_first_name: firstName,
        user_last_name: lastName,
        user_gender: gender,
        user_phone_number: phone,
        user_birth_date: birthDate,
        languages: languages
    };
    console.log(updatedInfo);
    const patient = await database.updateInfo(patientId, patientEmail, updatedInfo);
    if (patient) {
        message = 'Patient info updated successfully';
        return res.json({ message, patient });
    }
    message = 'Could not update patient info';
    console.log(message);
    return res.status(400).json({ message });
}

const editPassword = async (req, res) => {
    const patientId = req.id;
    const patientEmail = req.email;
    let message = '';
    if (!patientId) {
        return res.status(404).json(message);
    }
    if (!patientEmail) {
        message = 'Patient email not found';
        return res.status(404).json(message);
    }
    let { oldPassword , password, confirmPassword } = req.body;
    if (!oldPassword) {
        message = 'Please provide old password';
        return res.status(404).json({message});
    }
    if (!password) {
        message = 'Please provide new password';
        return res.status(404).json({message});
    }
    if (!confirmPassword) {
        message = 'Please confirm new password';
        return res.status(404).json({message});
    }
    if (password !== confirmPassword) {
        message = 'Passwords do not match';
        return res.status(400).json({message});
    }
    const passwordFlag = passwordValidation(confirmPassword);
    if (!passwordFlag) {
        message = 'Password must contain at least 8 characters, one number, one alphabet, and one special character';
        return res.status(400).json({message});
    }
    const patient = await database.updatePassword(patientId, patientEmail, oldPassword, confirmPassword);
    if (patient) {
        message = 'Patient password updated successfully';
        return res.json({ message, patient });
    }
    message = 'Could not update patient password';
    return res.status(400).json(message);
}

module.exports = { editInfo, editPassword };