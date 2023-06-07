const express = require('express');
const userModel = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();

// Set up nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'nassreddine.trigui@hotmail.com', // Your Hotmail.com email address
    pass: 'Nass..1989' // Your Hotmail.com password
  }
});

// Function to generate a random validation code
function generateValidationCode() {
  const codeLength = 6;
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
}

router.post('/', async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    // Generate a validation code
    const validationCode = generateValidationCode();

    // Set the reset token and expiration in the user document
    user.resetToken = validationCode;
    user.resetTokenExpiration = Date.now() + 3600000; // One hour validity
    await user.save();

    // Compose the email
    const mailOptions = {
      from: 'nassreddine.trigui@hotmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Use this validation code to reset your password: ${validationCode}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.json({ message: "Le code de validation est envoyé par email" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'envoi du code de validation" });
  }
});

router.post('/verify', async (req, res, next) => {
  const { email, validationCode, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.resetToken || user.resetToken !== validationCode || !user.resetTokenExpiration || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ error: "le code de validation est expiré ou invalide" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return res.status(200).json({ message: "le mot de passe est mis à jour" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur de modification du mot de passe" });
  }
});

module.exports = router;