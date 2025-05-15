// src/controllers/products.js

const ProductRepository = require('../dao/product.repository');
const repo = new ProductRepository();

/**
 * Obtener todos los productos, con paginación, filtros y ordenamiento.
 */
async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 10, sort, stock, category } = req.query;
    const filters = {};
    if (stock)    filters.stock = { $gte: Number(stock) };
    if (category) filters.category = category;

    // Construir objeto de ordenamiento
    const sortOption = sort ? { [sort]: 1 } : {};

    // Llamada paginada al repositorio
    const result = await repo.getAllPaginated(filters, {
      page:  Number(page),
      limit: Number(limit),
      sort:  sortOption
    });

    // Devolver estructura de paginación de mongoose-paginate
    return res.json({ status: 'success', ...result });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener productos', details: err.message });
  }
}

/**
 * Obtener un producto por ID.
 */
async function getProductById(req, res) {
  try {
    const product = await repo.getById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json({ status: 'success', data: product });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener el producto', details: err.message });
  }
}

/**
 * Crear un nuevo producto.
 */
async function createProduct(req, res) {
  try {
    const saved = await repo.create(req.body);
    return res.status(201).json({ status: 'success', data: saved });
  } catch (err) {
    return res.status(400).json({ error: 'Error al crear el producto', details: err.message });
  }
}

/**
 * Actualizar un producto existente por ID.
 */
async function updateProduct(req, res) {
  try {
    const updated = await repo.update(req.params.pid, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json({ status: 'success', data: updated });
  } catch (err) {
    return res.status(400).json({ error: 'Error al actualizar el producto', details: err.message });
  }
}

/**
 * Eliminar un producto por ID.
 */
async function deleteProduct(req, res) {
  try {
    await repo.delete(req.params.pid);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar el producto', details: err.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
