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
