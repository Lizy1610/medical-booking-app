const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Ruta para registrar: POST /api/auth/register
router.post('/register', register);

// Ruta para login: POST /api/auth/login
router.post('/login', login);

module.exports = router;