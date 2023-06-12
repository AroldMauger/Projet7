const mongoose = require('mongoose');

// Définition du schéma de modèle de livre //
const BookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],

  averageRating: { type: Number },
});

module.exports = mongoose.model('Book', BookSchema);

