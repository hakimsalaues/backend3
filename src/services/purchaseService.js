const mongoose = require('mongoose');
const Product = require('../models/product');
const Ticket = require('../models/ticket');
const crypto = require('crypto');

class PurchaseService {
  constructor(cartRepo) {
    this.cartRepo = cartRepo;
  }

  async processPurchase(user, cartId) {
    const session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      let total = 0;
      const unprocessed = [];
      const cart = await this.cartRepo.getCartById(cartId);
      for (const item of cart.products) {
        const prod = await Product.findById(item.product._id).session(session);
        if (prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
          total += prod.price * item.quantity;
          await prod.save({ session });
        } else {
          unprocessed.push(item);
        }
      }
      const [ticket] = await Ticket.create([{
        code: crypto.randomUUID(),
        purchase_datetime: new Date(),
        amount: total,
        purchaser: user.email
      }], { session });
      cart.products = unprocessed;
      await cart.save({ session });
      result = { ticket, unprocessed, total };
    });
    session.endSession();
    return result;
  }
}

module.exports = PurchaseService;