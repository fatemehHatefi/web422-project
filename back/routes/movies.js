// back/routes/movies.js

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Route to get movie details by ID
router.get('/:id', movieController.getMovieById);

module.exports = router;
