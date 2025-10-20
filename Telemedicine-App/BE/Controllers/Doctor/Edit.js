const  database  = require('../../Database/Doctor/Edit');
const { passwordValidation } = require('../../Utilities');


const editInfo = async (req, res) => {
    const doctorId = req.id;
    const doctorEmail = req.email;
    let message = '';
    if (!doctorId) {
        message = 'Doctor ID not found';
        return res.status(404).json(message);
    }
    if (!doctorEmail) {
        message = 'Doctor email not found';
        return res.status(404).json(message);
    }
    const { firstName, lastName, gender, phone, birthdate, residenceCountry, sixtyMinPrice, thirtyMinPrice, specialization, languages } = req.body;
    const updatedInfo = {
        user_first_name: firstName,
        user_last_name: lastName,
        user_gender: gender,
        user_phone_number: phone,
        user_birth_date: birthdate,
        doctor_country: residenceCountry,
        doctor_sixty_min_price: sixtyMinPrice,
        doctor_thirty_min_price: thirtyMinPrice,
        doctor_specialization: specialization,
        languages: languages
    };
    const doctor = await database.updateInfo(doctorId, doctorEmail, updatedInfo);
    if (!doctor) {
        message = 'Could not update doctor info';
        return res.status(400).json(message);
    }
    message = 'Doctor info updated successfully';
    return res.json( {message, doctor });
}

const editPassword = async (req, res) => {
    const doctorId = req.id;
    const doctorEmail = req.email;
    let message = '';
    if (!doctorId) {
        message = 'Doctor ID not found';
        return res.status(404).json({message});
    }
    if (!doctorEmail) {
        message = 'Doctor email not found';
        return res.status(404).json({message});
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
    const doctor = await database.updatePassword(doctorId, doctorEmail, oldPassword, confirmPassword);
    if (!doctor) {
        message = 'Could not update doctor password';
        return res.status(400).json({message});
    }
    message = 'Doctor password updated successfully';
    return res.json({ message, doctor });
}

module.exports = { editInfo, editPassword };