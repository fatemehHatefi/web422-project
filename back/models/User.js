// back/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Ensure Movie model exists
  visitedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Track last 4 visited movies
  reviews: [{ 
    movie: { type: String, required: true }, // Movie being reviewed
    rating: { type: Number, required: true }, // Rating given by the user
    comment: { type: String, required: true }, // Review comment
    date: { type: Date, default: Date.now } // Date of review
  }]
});

userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Middleware to limit visitedMovies to the last 4 entries
userSchema.pre('save', function(next) {
  if (this.visitedMovies.length > 4) {
    this.visitedMovies = this.visitedMovies.slice(-4); // Keep only the last 4 entries
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
