const express = require('express');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/user'); // asegúrate que existe este modelo
const Pet = require('../models/pet');   // asegúrate que existe este modelo

const router = express.Router();

// Endpoint antiguo movido aquí
router.get('/mockingpets', (req, res) => {
  const pets = Array.from({ length: 100 }, () => ({
    name: faker.animal.cat(),
    species: faker.animal.type(),
    birthDate: faker.date.birthdate(),
  }));
  res.json({ pets });
});

// Función para generar usuarios
const generateUsers = (count) => {
  const users = [];
  const passwordHash = bcrypt.hashSync('coder123', 10);
  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Math.random() > 0.5 ? 'user' : 'admin',
      pets: [],
    });
  }
  return users;
};

// GET /mockingusers
router.get('/mockingusers', (req, res) => {
  const count = parseInt(req.query.count) || 50;
  const users = generateUsers(count);
  res.json(users);
});

// POST /generateData
router.post('/generateData', async (req, res) => {
  const { users = 0, pets = 0 } = req.body;
  const userData = generateUsers(Number(users));

  const petData = Array.from({ length: Number(pets) }, () => ({
    name: faker.animal.dog(),
    species: faker.animal.type(),
    birthDate: faker.date.past(),
  }));

  const insertedUsers = await User.insertMany(userData);
  const insertedPets = await Pet.insertMany(petData);

  res.json({
    status: 'success',
    insertedUsers: insertedUsers.length,
    insertedPets: insertedPets.length,
  });
});

module.exports = router;
