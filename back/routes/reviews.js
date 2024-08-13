const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Add a review for a movie
router.post('/', async (req, res) => {
  try {
    const { userEmail, movieId, rating, comment } = req.body;

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a review
    const review = {
      movie: movieId,
      rating,
      comment,
      date: new Date()
    };

    // Add review to user's reviews array
    user.reviews.push(review);
    await user.save();

    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
