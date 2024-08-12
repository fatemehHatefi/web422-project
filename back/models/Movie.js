const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseYear: { type: Number, required: true },
  image: { type: String },
  summary: { type: String },
  category: { type: String}
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
