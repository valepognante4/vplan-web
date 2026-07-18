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
};

module.exports = usuarioRepository;
