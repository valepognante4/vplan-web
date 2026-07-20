const express    = require('express');
const router     = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/registro
router.post('/registro', authController.registro);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/forgot-password — solicitar enlace de reseteo
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password — confirmar nueva contraseña con el token recibido
router.post('/reset-password', authController.resetPassword);

module.exports = router;
