const { OAuth2Client } = require('google-auth-library');
const usuarioRepository = require('../repositories/usuarioRepository');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifica un ID Token emitido por Google y retorna la información
 * del payload (nombre, email, sub, picture).
 *
 * @param {string} idToken  Token recibido desde el frontend (@react-oauth/google)
 * @returns {Promise<{ email: string, nombre: string, googleId: string, avatar: string }>}
 */
const verificarGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email_verified) {
        const err = new Error('El token de Google no es válido o el email no está verificado.');
        err.statusCode = 401;
        throw err;
    }

    return {
        googleId: payload.sub,
        email:    payload.email,
        nombre:   payload.name || payload.email.split('@')[0],
        avatar:   payload.picture || null,
    };
};

/**
 * Flujo completo de Google Sign-In:
 * 1. Verifica el ID Token con Google.
 * 2. Busca o crea el usuario en la BD (upsert por google_id / email).
 *
 * @param {string} idToken
 * @returns {Promise<Object>}  Fila del usuario (sin password_hash)
 */
const googleAuthService = {
    loginConGoogle: async (idToken) => {
        if (!idToken) {
            const err = new Error('El campo credential (ID Token) es obligatorio.');
            err.statusCode = 400;
            throw err;
        }

        const { googleId, email, nombre, avatar } = await verificarGoogleToken(idToken);

        // Buscar o crear el usuario — el repositorio hace UPSERT
        const usuario = await usuarioRepository.findOrCreateByGoogle({
            googleId,
            email,
            nombre,
            avatar,
        });

        return usuario;
    },
};

module.exports = googleAuthService;
