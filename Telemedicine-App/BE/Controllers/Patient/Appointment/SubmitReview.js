const database = require('../../../Database/Patient/Appointment/SubmitReview.js');

const SubmitReview = async (req, res) => {
  try {
    const { doctorId, communication_rating, understanding_rating, providing_solution_rating, commitment_rating } = req.body;
    const appointment_id = req.params.appointment_id; 
    const rating = await database.SubmitReview(appointment_id, communication_rating, understanding_rating, providing_solution_rating, commitment_rating);
    if (!rating) {
      return res.status(400).json({ message: 'Failed to submit review' });
    }
    // Retrieve current doctor rating
    const doctorRatingResult = await database.RetrieveDoctorRating(doctorId);
    if (!doctorRatingResult) {
      return res.status(400).json({ message: 'Failed to Retrieve Doctor Rating' });
    }
    console.log(doctorRatingResult)
    if (doctorRatingResult) {
     const { doctor_rating, review_count } = doctorRatingResult;

      // Calculate the new doctor rating
      const newReview_Count=review_count+1;
      const newRating = ((doctor_rating * review_count + (communication_rating + understanding_rating + providing_solution_rating + commitment_rating)) / 4) / (review_count + 1);
      console.log(newRating);
      // Update the new doctor rating
      await database.NewDoctorRating(doctorId, newRating,newReview_Count);
    }

  
  res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { SubmitReview };
