const database = require('../Database/Chat');

const sendAppointmentMessage = async (req, res) => {
  const userId = req.id;
  const { appointmentId, message, receiverId } = req.body;

  if (!appointmentId) {
    return res.status(400).json({ message: 'Appointment ID is required' });
  }

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  if (!receiverId) {
    return res.status(400).json({ message: 'Receiver ID is required' });
  }

  try {
    const newMessage = await database.addChatMessage(appointmentId, userId, receiverId, message);

    if (!newMessage) {
      return res.status(500).json({ message: 'Error sending message' });
    }
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
const getAppointmentChat = async (req, res) => {
  const userId = req.id;
  const appointmentId = req.params.appointmentId;

  if (!appointmentId) {
    return res.status(400).json({ message: 'Appointment ID is required' });
  }

  try {
    // const appointmentDetails = await database.getAppointmentDoctorandPatient(appointmentId);

    // if (userId !== appointmentDetails[0].appointment_doctor_id && userId !== appointmentDetails[0].appointment_patient_id) {
    //   return res.status(401).json({ message: 'User is not authorized to get the chat history' });
    // }

    const chatMessages = await database.getChatMessages(appointmentId);

    if (!chatMessages.length) {
      return res.status(404).json({ message: 'No messages found' });
    }

    res.status(200).json(chatMessages);

  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
  module.exports = { sendAppointmentMessage, getAppointmentChat };