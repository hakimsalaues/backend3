const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/user');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await User.create({ first_name, last_name, email, age, password });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info?.message || 'Error de autenticacion' });
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
    res.json({ message: 'Logueo exitoso', token });
  })(req, res, next);
});

// Ruta protegida: devuelve el user actual
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { _id, first_name, last_name, email, age, role, cart } = req.user;
    res.json({ _id, first_name, last_name, email, age, role, cart });
  }
);

module.exports = router;