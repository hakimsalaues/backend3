const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/user');
const UserDTO = require('../dao/dtos/user.dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error en el registro
 */
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const newUser = await User.create({ first_name, last_name, email, age, password });
    res.status(201).json({ message: 'Usuario registrado', user: { id: newUser._id, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Iniciar sesión con JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logueo exitoso con token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info?.message || 'Error autenticación' });
    const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logueo exitoso', token });
  })(req, res, next);
});

/* *
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtener datos del usuario actual (requiere JWT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *       401:
 *         description: No autorizado
 */
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const dto = new UserDTO(req.user);
    res.json({ status: 'success', user: dto });
  }
);

module.exports = router;
