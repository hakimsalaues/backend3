const express = require('express');
const passport = require('../config/passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  purchaseCart
} = require('../controllers/carts');

const router = express.Router();
router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/products/:pid',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  addProductToCart
);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);
router.post('/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  purchaseCart
);
module.exports = router;