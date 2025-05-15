// src/controllers/carts.js

const CartRepository = require('../dao/cart.repository');
const PurchaseService = require('../services/purchaseService');

const cartRepo = new CartRepository();
const purchaseService = new PurchaseService(cartRepo);

/**
 * Crear un nuevo carrito
 */
async function createCart(req, res) {
  try {
    const cart = await cartRepo.createCart();
    res.status(201).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Obtener carrito por ID
 */
async function getCartById(req, res) {
  try {
    const cart = await cartRepo.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Agregar producto al carrito
 */
async function addProductToCart(req, res) {
  try {
    const updated = await cartRepo.addProductToCart(req.params.cid, req.params.pid);
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Eliminar producto del carrito
 */
async function deleteProductFromCart(req, res) {
  try {
    const updated = await cartRepo.deleteProductFromCart(req.params.cid, req.params.pid);
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Reemplazar todos los productos del carrito
 */
async function updateCart(req, res) {
  try {
    const updated = await cartRepo.updateCart(req.params.cid, req.body.products);
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Actualizar cantidad de un producto
 */
async function updateProductQuantity(req, res) {
  try {
    const updated = await cartRepo.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Vaciar carrito
 */
async function clearCart(req, res) {
  try {
    const cleared = await cartRepo.clearCart(req.params.cid);
    res.json({ status: 'success', data: cleared });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Finalizar compra y generar ticket
 */
async function purchaseCart(req, res) {
  try {
    const result = await purchaseService.processPurchase(req.user, req.params.cid);
    res.json({ status: 'success', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  purchaseCart
};
