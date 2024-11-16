const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  authors: { type: String, required: true },
  favorite: { type: String, required: true },
  fileCover: { type: String, required: true },
  fileName: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
