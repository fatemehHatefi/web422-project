// migration.js
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as necessary

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Add the `visitedMovies` field to all users if it doesn't already exist
    const result = await User.updateMany(
      { visitedMovies: { $exists: false } },
      { $set: { visitedMovies: [] } }
    );

    console.log('Migration complete:', result.modifiedCount, 'documents updated');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    mongoose.disconnect();
  });
