const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');

// ── Helpers de validación ────────────────────────────────────────────────────

/**
 * Valida el formato de un email con una expresión regular estándar.
 * @param {string} email
 * @returns {boolean}
 */
const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida la fortaleza de la contraseña:
 *  - Mínimo 8 caracteres
 *  - Al menos 1 letra mayúscula
 *  - Al menos 1 número
 * @param {string} password
 * @returns {{ valida: boolean, mensaje: string }}
 */
const validarPassword = (password) => {
    if (!password || password.length < 8) {
        return { valida: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valida: false, mensaje: 'La contraseña debe contener al menos una letra mayúscula.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valida: false, mensaje: 'La contraseña debe contener al menos un número.' };
    }
    return { valida: true, mensaje: 'OK' };
};

/**
 * Genera un JWT firmado con el id y email del usuario.
 * @param {{ id: number, email: string }} usuario
 * @returns {string} Token JWT
 */
const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// ── Lógica de negocio ────────────────────────────────────────────────────────

const authService = {
    /**
     * Registra un nuevo usuario.
     * 1. Valida formato de email y fortaleza de contraseña.
     * 2. Verifica que el email no esté ya registrado.
     * 3. Hashea la contraseña con bcrypt (salt 12).
     * 4. Guarda el usuario y devuelve un JWT + datos del usuario.
     *
     * @param {{ nombre: string, email: string, password: string }} datos
     * @returns {Promise<{ token: string, usuario: Object }>}
     */
    registrar: async ({ nombre, email, password }) => {
        // 1. Validaciones de formato
        if (!nombre || nombre.trim().length < 2) {
            const err = new Error('El nombre debe tener al menos 2 caracteres.');
            err.statusCode = 400;
            throw err;
        }
        if (!esEmailValido(email)) {
            const err = new Error('El formato del email no es válido.');
            err.statusCode = 400;
            throw err;
        }
        const { valida, mensaje } = validarPassword(password);
        if (!valida) {
            const err = new Error(mensaje);
            err.statusCode = 400;
            throw err;
        }

        // 2. Verificar si el email ya existe
        const usuarioExistente = await usuarioRepository.findByEmail(email);
        if (usuarioExistente) {
            const err = new Error('Ya existe una cuenta con ese email.');
            err.statusCode = 409; // Conflict
            throw err;
        }

        // 3. Hashear contraseña (salt rounds = 12 — buen equilibrio seguridad/performance)
        const password_hash = await bcrypt.hash(password, 12);

        // 4. Crear usuario y generar token
        const nuevoUsuario = await usuarioRepository.create({ nombre, email, password_hash });
        const token = generarToken(nuevoUsuario);

        return { token, usuario: nuevoUsuario };
    },

    /**
     * Autentica un usuario existente.
     * 1. Busca el usuario por email.
     * 2. Compara la contraseña con el hash almacenado.
     * 3. Devuelve un JWT + datos del usuario.
     *
     * @param {{ email: string, password: string }} credenciales
     * @returns {Promise<{ token: string, usuario: Object }>}
     */
    login: async ({ email, password }) => {
        // 1. Buscar usuario — mismo mensaje genérico para no revelar si el email existe
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario) {
            const err = new Error('Email o contraseña incorrectos.');
            err.statusCode = 401;
            throw err;
        }

        // 2. Comparar contraseña con hash
        const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecta) {
            const err = new Error('Email o contraseña incorrectos.');
            err.statusCode = 401;
            throw err;
        }

        // 3. Generar token — excluir password_hash de la respuesta
        const token = generarToken(usuario);
        const { password_hash, ...usuarioSinHash } = usuario;

        return { token, usuario: usuarioSinHash };
    },
};

module.exports = authService;
