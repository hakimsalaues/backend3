const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/user');
const UserDTO = require('../dao/dtos/user.dto');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const newUser = await User.create({ first_name, last_name, email, age, password });
    res.status(201).json({ message: 'Usuario registrado', user: { id: newUser._id, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info?.message || 'Error autenticación' });
    const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logueo exitoso', token });
  })(req, res, next);
});

router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const dto = new UserDTO(req.user);
    res.json({ status: 'success', user: dto });
  }
);

module.exports = router;