const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  birthDate: Date,
});

module.exports = mongoose.model('Pet', petSchema);
