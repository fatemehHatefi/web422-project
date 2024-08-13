const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Import contact routes

const { Movie } = require('./models'); // Import Movie model from models.js
const { User } = require('./models');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5001;

// Connect to MongoDB using MONGO_URI from .env file
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); // Use /api/auth as the prefix for authentication routes
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes); // Use /api as the prefix for contact routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const movies = await Movie.find().skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments();

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
    const email = req.query.email;
    const user = await User.findOne({ email });

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
app.get('/category', async (req, res) => {
  const { category } = req.query;
  try {
    const movies = await Movie.find({
      category: new RegExp(category, 'i')
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
});

// Add movie to history
app.post('/history', async (req, res) => {
  try {
    const { userEmail, movieId } = req.body;

    console.log(`User ID: ${userEmail}, Movie ID: ${movieId}`);

    const user = await User.findOne({ email: userEmail });

    console.log(user);


    if (!user || !movieId) {
      return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.visitedMovies.includes(movieId)) {
      user.visitedMovies.push(movieId);
      await user.save();
    }

    res.status(200).json({ message: 'Movie added to history' });
  } catch (error) {
    console.error('Error adding movie to history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// view history
app.post('/historyView', async (req, res) => {
  try {
    const { userEmail } = req.body;

    const user = await User.findOne({ email: userEmail });

    console.log(user);


    if (!user) {
      return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.visitedMovies);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search movies by title
app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      title: new RegExp(query, 'i')
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error searching movies', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
