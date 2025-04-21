const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  cart:       { type: Schema.Types.ObjectId, ref: 'Cart' },
  role:       { type: String, default: 'user' }
});

// Antes de guardar, hashear la contraseña si cambió
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Método para verificar contraseña
userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = model('User', userSchema);