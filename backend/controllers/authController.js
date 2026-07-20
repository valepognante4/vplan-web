const authService       = require('../services/authService');
const googleAuthService = require('../services/googleAuthService');
const jwt               = require('jsonwebtoken');

/**
 * POST /api/auth/registro
 * Body: { nombre, email, password }
 */
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Los campos nombre, email y password son obligatorios.' });
        }

        const resultado = await authService.registrar({ nombre, email, password });

        return res.status(201).json({
            mensaje: '¡Usuario registrado con éxito!',
            token:   resultado.token,
            usuario: resultado.usuario,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ error: error.message });
    }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!email || !password) {
            return res.status(400).json({ error: 'Los campos email y password son obligatorios.' });
        }

        const resultado = await authService.login({ email, password });

        return res.status(200).json({
            mensaje: '¡Inicio de sesión exitoso!',
            token:   resultado.token,
            usuario: resultado.usuario,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ error: error.message });
    }
};

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 *
 * Siempre responde 200 con el mismo mensaje genérico para evitar
 * la enumeración de emails (no revelamos si el email existe o no).
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ error: 'El campo email es obligatorio.' });
        }

        // El servicio se encarga de enviar el correo solo si el usuario existe.
        // Si no existe, simplemente retorna sin error (respuesta genérica intencional).
        await authService.solicitarReset(email.trim().toLowerCase());

        return res.status(200).json({
            mensaje: 'Si ese email está registrado, recibirás un correo con las instrucciones.',
        });
    } catch (error) {
        // Errores de transporte SMTP u otros inesperados
        console.error('[forgot-password] Error interno:', error);
        return res.status(500).json({ error: 'No se pudo procesar la solicitud. Inténtalo más tarde.' });
    }
};

/**
 * POST /api/auth/reset-password
 * Body: { token, nuevaPassword }
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, nuevaPassword } = req.body;

        if (!token || !nuevaPassword) {
            return res.status(400).json({ error: 'Los campos token y nuevaPassword son obligatorios.' });
        }

        await authService.restablecerPassword(token, nuevaPassword);

        return res.status(200).json({ mensaje: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ error: error.message });
    }
};
/**
 * POST /api/auth/google
 * Body: { credential }  ← ID Token devuelto por @react-oauth/google
 *
 * 1. Verifica el ID Token con Google.
 * 2. Hace upsert del usuario en la BD.
 * 3. Emite un JWT propio y lo devuelve en cookie HTTP-only Y en el body.
 */
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        const usuario = await googleAuthService.loginConGoogle(credential);

        // Generar JWT propio (mismo formato que el login tradicional)
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // ── Cookie HTTP-only segura ──────────────────────────────────────
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('vplan_token', token, {
            httpOnly: true,              // JavaScript NO puede leer esta cookie
            secure:   isProduction,      // Solo HTTPS en producción; HTTP en dev
            sameSite: 'lax',             // Protección CSRF; funciona en mismo host (localhost)
            maxAge:   24 * 60 * 60 * 1000, // 24 horas en ms
        });

        return res.status(200).json({
            mensaje: '¡Sesión iniciada con Google!',
            token,       // También en body para compatibilidad con localStorage actual
            usuario,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('[googleLogin] Error:', error.message);
        return res.status(statusCode).json({ error: error.message });
    }
};
