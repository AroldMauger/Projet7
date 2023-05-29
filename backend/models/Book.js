const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  userId: String,
  title: String,
  author: String,
  year : Number,
  imageUrl: String,
  genre: String,
  ratings: [{
      userId: String,
      grade: Number
  }],
  averageRating: Number
})

module.exports = mongoose.model('Book', BookSchema);