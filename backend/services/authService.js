const bcrypt              = require('bcryptjs');
const jwt                 = require('jsonwebtoken');
const usuarioRepository   = require('../repositories/usuarioRepository');
const transporter         = require('../config/mailer');

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

    /**
     * Solicita el reseteo de contraseña.
     * 1. Verifica que el usuario exista (sin revelar si no existe — respuesta genérica).
     * 2. Genera un JWT de corta duración firmado con JWT_RESET_SECRET.
     * 3. Envía un correo con el enlace de reseteo usando Nodemailer.
     *
     * @param {string} email  Email del usuario que solicita el reset
     * @returns {Promise<void>}
     */
    solicitarReset: async (email) => {
        // 1. Buscar usuario (sin revelar existencia en la respuesta pública)
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario) {
            // Respuesta genérica para evitar enumeración de emails
            return;
        }

        // 2. Generar token de reseteo con clave y expiración propias
        const resetToken = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_RESET_SECRET,
            { expiresIn: process.env.JWT_RESET_EXPIRES_IN || '1h' }
        );

        // 3. Construir el enlace de reseteo
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl    = `${frontendUrl}/reset-password?token=${resetToken}`;

        // 4. Enviar correo con Nodemailer
        await transporter.sendMail({
            from:    `"VPlan" <${process.env.SMTP_USER}>`,
            to:      usuario.email,
            subject: 'Restablecer tu contraseña — VPlan',
            text: `Hola ${usuario.nombre},\n\nRecibimos una solicitud para restablecer tu contraseña.\nUsa el siguiente enlace (válido por 1 hora):\n\n${resetUrl}\n\nSi no solicitaste este cambio, ignora este mensaje.\n\n— El equipo de VPlan`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a2e;">
                    <h2 style="color: #6c63ff;">Restablecer contraseña</h2>
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>VPlan</strong>.</p>
                    <p>Este enlace es válido durante <strong>1 hora</strong>:</p>
                    <p style="text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}"
                           style="background: #6c63ff; color: #fff; text-decoration: none;
                                  padding: 12px 28px; border-radius: 8px; font-size: 16px;">
                            Restablecer contraseña
                        </a>
                    </p>
                    <p style="font-size: 13px; color: #666;">
                        Si no solicitaste este cambio, puedes ignorar este correo con total seguridad.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;">
                    <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} VPlan</p>
                </div>
            `,
        });
    },

    /**
     * Restablece la contraseña de un usuario.
     * 1. Verifica y decodifica el token con JWT_RESET_SECRET.
     * 2. Valida la fortaleza de la nueva contraseña.
     * 3. Hashea la nueva contraseña con bcrypt.
     * 4. Actualiza el hash en la base de datos.
     *
     * @param {string} token         JWT de reseteo recibido del frontend
     * @param {string} nuevaPassword Nueva contraseña en texto plano
     * @returns {Promise<void>}
     */
    restablecerPassword: async (token, nuevaPassword) => {
        // 1. Verificar y decodificar el token de reseteo
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
        } catch (err) {
            const error = new Error(
                err.name === 'TokenExpiredError'
                    ? 'El enlace de recuperación ha expirado. Solicita uno nuevo.'
                    : 'El enlace de recuperación no es válido.'
            );
            error.statusCode = 400;
            throw error;
        }

        // 2. Validar la fortaleza de la nueva contraseña
        const { valida, mensaje } = validarPassword(nuevaPassword);
        if (!valida) {
            const err = new Error(mensaje);
            err.statusCode = 400;
            throw err;
        }

        // 3. Hashear la nueva contraseña
        const password_hash = await bcrypt.hash(nuevaPassword, 12);

        // 4. Persistir el cambio en la base de datos
        const usuarioActualizado = await usuarioRepository.updatePassword(payload.id, password_hash);
        if (!usuarioActualizado) {
            const err = new Error('No se encontró el usuario asociado a este enlace.');
            err.statusCode = 404;
            throw err;
        }
    },
};

module.exports = authService;
