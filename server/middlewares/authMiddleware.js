const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el token JWT en el header Authorization.
 * Uso: app.use('/api/ruta-protegida', verificarToken, routerProtegido)
 *
 * Espera el header:  Authorization: Bearer <token>
 *
 * Si el token es válido, agrega `req.usuario` con { id, email } y llama a next().
 * Si no, responde con 401 Unauthorized.
 */
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado. Se requiere un token de autenticación.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // { id, email, iat, exp }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado. Por favor, vuelve a iniciar sesión.' });
        }
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = { verificarToken };
