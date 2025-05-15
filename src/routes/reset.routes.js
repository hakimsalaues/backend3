const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const PasswordResetToken = require('../models/passwordsResetToken');
const { sendPasswordResetEmail } = require('../services/mailingService');

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600000;
  await PasswordResetToken.create({ userId: user._id, token, expires });
  await sendPasswordResetEmail(email, token);
  res.json({ status: 'ok', message: 'Revisa tu correo para continuar' });
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const record = await PasswordResetToken.findOne({ token });
  if (!record || record.expires < Date.now()) return res.status(400).json({ error: 'Token inválido/expirado' });

  const user = await User.findById(record.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (user.isValidPassword(newPassword)) return res.status(400).json({ error: 'Contraseña igual a anterior' });

  user.password = newPassword;
  await user.save();
  await record.deleteOne();
  res.json({ status: 'success', message: 'Contraseña actualizada' });
});

module.exports = router;