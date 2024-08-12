const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const { Movie } = require('./models'); // Import Movie model from models.js
const { User } = require('./models');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
const port = 5001;

// Connect to MongoDB using MONGO_URI from .env file
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); // Use /api/auth as the prefix for authentication routes
app.use('/api/wishlist', wishlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(' to the Movie API');
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 4; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate number of items to skip

    // Fetch movies with pagination
    const movies = await Movie.find().skip(skip).limit(limit);

    // Get total number of movies to calculate total pages
    const totalMovies = await Movie.countDocuments();

    // Send paginated response
    res.json({
      movies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
});


// Get user by ID
app.get('/user', async (req, res) => {
  try {
    const email = req.query.email; // Retrieve the email from query parameters
    const user = await User.findOne({ email }); // Find the user by email

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});


// Get movie by ID
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie', error: err });
  }
});

// Get movies by category
// In your server file (e.g., server.js or app.js)
app.get('/category', async (req, res) => {
  const { category } = req.query;
  
  console.log("category");
  console.log(category);
  try {
  const movies = await Movie.find({
    category: new RegExp(category, 'i') // Case-insensitive search for the category
  });
      console.log("movies");
  console.log(movies);
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
});



// Search movies by title
app.get('/search', async (req, res) => {
  const { query } = req.query; // Access the query parameter
  try {
    const movies = await Movie.find({
      title: new RegExp(query, 'i') // Case-insensitive search
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error searching movies', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
