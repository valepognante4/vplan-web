const pool = require('../config/db');

const usuarioRepository = {
    /**
     * Busca un usuario por su email.
     * @param {string} email
     * @returns {Promise<Object|null>} El usuario encontrado o null.
     */
    findByEmail: async (email) => {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    },

    /**
     * Inserta un nuevo usuario en la base de datos.
     * @param {{ nombre: string, email: string, password_hash: string }} datos
     * @returns {Promise<Object>} El usuario recién creado (sin password_hash).
     */
    create: async ({ nombre, email, password_hash }) => {
        const query = `
            INSERT INTO usuarios (nombre, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, email, created_at
        `;
        const result = await pool.query(query, [nombre, email, password_hash]);
        return result.rows[0];
    },

    /**
     * Actualiza el hash de contraseña de un usuario por su ID.
     * @param {number} id
     * @param {string} password_hash  Nuevo hash generado con bcrypt
     * @returns {Promise<Object>} Fila actualizada (id, nombre, email, created_at)
     */
    updatePassword: async (id, password_hash) => {
        const query = `
            UPDATE usuarios
            SET password_hash = $1
            WHERE id = $2
            RETURNING id, nombre, email, created_at
        `;
        const result = await pool.query(query, [password_hash, id]);
        return result.rows[0] || null;
    },

    /**
     * Busca un usuario por su Google ID.
     * @param {string} googleId  Valor del campo `sub` del payload de Google
     * @returns {Promise<Object|null>}
     */
    findByGoogleId: async (googleId) => {
        const query = 'SELECT id, nombre, email, avatar, created_at FROM usuarios WHERE google_id = $1';
        const result = await pool.query(query, [googleId]);
        return result.rows[0] || null;
    },

    /**
     * Inserta o actualiza un usuario proveniente de Google OAuth.
     *
     * Casos contemplados:
     *  - Usuario nuevo → se crea con password_hash vacío (no puede hacer login con contraseña).
     *  - Ya existe por email pero aún no tiene google_id → se vincula.
     *  - Ya existe por google_id → se actualiza nombre/avatar si cambiaron.
     *
     * @param {{ googleId: string, email: string, nombre: string, avatar: string|null }} datos
     * @returns {Promise<Object>} Fila del usuario (sin password_hash)
     */
    findOrCreateByGoogle: async ({ googleId, email, nombre, avatar }) => {
        const query = `
            INSERT INTO usuarios (nombre, email, password_hash, google_id, avatar)
            VALUES ($1, $2, '', $3, $4)
            ON CONFLICT (email)
                DO UPDATE SET
                    google_id = EXCLUDED.google_id,
                    avatar    = EXCLUDED.avatar,
                    nombre    = EXCLUDED.nombre
            RETURNING id, nombre, email, avatar, created_at
        `;
        try {
            const result = await pool.query(query, [nombre, email, googleId, avatar]);
            return result.rows[0];
        } catch (err) {
            console.error('[usuarioRepository.findOrCreateByGoogle] Error en BD:', err);
            throw err;
        }
    },
};

module.exports = usuarioRepository;
