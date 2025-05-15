const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code:             { type: String, required: true, unique: true },
  purchase_datetime:{ type: Date,   default: Date.now },
  amount:           { type: Number, required: true },
  purchaser:        { type: String, required: true }
});

// Evita el error "Cannot overwrite `Ticket` model once compiled"
module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);