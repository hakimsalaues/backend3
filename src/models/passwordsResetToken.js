const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
