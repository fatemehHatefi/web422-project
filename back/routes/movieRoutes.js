const express = require('express');
const { addMovie, getWishlist, addToWishlist } = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, addMovie);
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/:movieId', authMiddleware, addToWishlist);

module.exports = router;
