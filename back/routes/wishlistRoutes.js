const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Add movie to wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    console.log(`User ID: ${userId}, Movie ID: ${movieId}`);

    if (!userId || !movieId) {
      return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();
    }

    res.status(200).json({ message: 'Movie added to wishlist' });
  } catch (error) {
    console.error('Error adding movie to wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from wishlist
router.post('/remove', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    console.log(`User ID: ${userId}, Movie ID: ${movieId}`);

    if (!userId || !movieId) {
      return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const movieIndex = user.wishlist.indexOf(movieId);
    if (movieIndex > -1) {
      user.wishlist.splice(movieIndex, 1);
      await user.save();
    }

    res.status(200).json({ message: 'Movie removed from wishlist' });
  } catch (error) {
    console.error('Error removing movie from wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View user's wishlist by email
router.get('/view', async (req, res) => {
  try {
    const email = req.query.email; // Get email from query parameters
    console.log(email);
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Error retrieving wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
