// src/dao/user.repository.js
const User = require('../models/user');

class UserRepository {
  async createUser(data) {
    return await User.create(data);
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id).populate('cart');
  }

  async updateUser(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }
}

module.exports = UserRepository;