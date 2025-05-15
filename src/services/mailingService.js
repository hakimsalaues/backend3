const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendPasswordResetEmail = async (email, token) => {
  const link = `http://localhost:3000/reset-password/${token}`;
  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Restablecer contraseña',
    html: `<h2>Restablecimiento de contraseña</h2>
           <p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido por 1 hora):</p>
           <a href="${link}">${link}</a>`
  });
};

module.exports = { sendPasswordResetEmail };
