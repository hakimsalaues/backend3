const Cart = require('../models/cart');
const Product = require('../models/product');

const createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito', details: error.message });
    }
};

const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito', details: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const cartProduct = cart.products.find(p => p.product.toString() === pid);
        if (!cartProduct) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        cartProduct.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad', details: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito', details: error.message });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart
};
