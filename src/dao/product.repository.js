// src/dao/product.repository.js
const Product = require('../models/product');

class ProductRepository {
  async getAllPaginated(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = {} } = options;
    return await Product.paginate(filters, { page, limit, sort });
  }

  async getAll(filters = {}) {
    return await Product.find(filters);
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async create(data) {
    return await Product.create(data);
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;
