// src/models/adoption.js
const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  petId: { type: String, required: true },
  adopterName: { type: String, required: true },
  contact: { type: String, required: true },
  adoptedAt: { type: Date, default: Date.now }
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;
