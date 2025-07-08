// src/routes/adoption.router.js

const express = require('express');
const router = express.Router();

// Aquí deberías conectar con tu modelo Adoption (Mongo, Sequelize, etc.)
const Adoption = require('../models/adoption'); // crea el modelo o ajusta la ruta

// GET todas las adopciones
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find(); // ejemplo con Mongoose
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear adopción
router.post('/', async (req, res) => {
  try {
    const newAdoption = await Adoption.create(req.body);
    res.status(201).json({ adoption: newAdoption });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
