// src/dao/cart.repository.js
const Cart = require('../models/cart');

class CartRepository {
  async createCart() {
    return await Cart.create({});
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx !== -1) {
      cart.products[idx].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    return await cart.save();
  }

  async deleteProductFromCart(cid, pid) {
    return await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
  }

  async updateCart(cid, products) {
    return await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  }

  async updateProductQuantity(cid, pid, qty) {
    const cart = await Cart.findById(cid);
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return null;
    item.quantity = qty;
    return await cart.save();
  }

  async clearCart(cid) {
    return await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
  }
}

module.exports = CartRepository;