const express = require('express');
const passport = require('../config/passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');

const router = express.Router();
router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin'),
  createProduct
);
router.put('/:pid',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin'),
  updateProduct
);
router.delete('/:pid',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin'),
  deleteProduct
);
module.exports = router;
