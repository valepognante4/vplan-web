const authService = require('../services/authService');

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
