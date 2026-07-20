const pool = require('../config/db');

const tareaRepository = {
    /**
     * Obtiene todas las tareas de un usuario ordenadas por id desc.
     */
    findAll: async (usuario_id) => {
        const query = 'SELECT * FROM tareas WHERE usuario_id = $1 ORDER BY id DESC';
        const result = await pool.query(query, [usuario_id]);
        return result.rows;
    },

    /**
     * Busca una tarea por id y usuario (para verificar existencia y propiedad).
     */
    findById: async (id, usuario_id) => {
        const query = 'SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2';
        const result = await pool.query(query, [id, usuario_id]);
        return result.rows[0] || null;
    },

    /**
     * Crea una nueva tarea. La columna 'estado' usa 'PENDIENTE' como default (ver schema).
     */
    create: async (tarea, usuario_id) => {
        const { titulo, descripcion, prioridad, fecha_vencimiento } = tarea;
        const query = `
            INSERT INTO tareas (titulo, descripcion, prioridad, fecha_vencimiento, usuario_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [titulo, descripcion, prioridad, fecha_vencimiento || null, usuario_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Alterna el estado de una tarea entre 'PENDIENTE' y 'COMPLETADA'.
     * NOTA: la columna en la DB es 'estado VARCHAR(20)', NO un booleano 'completada'.
     */
    toggle: async (id, usuario_id) => {
        const query = `
            UPDATE tareas
            SET estado = CASE
                WHEN estado = 'COMPLETADA' THEN 'PENDIENTE'
                ELSE 'COMPLETADA'
            END
            WHERE id = $1 AND usuario_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [id, usuario_id]);
        if (result.rowCount === 0) throw new Error('Tarea no encontrada o no autorizada');
        return result.rows[0];
    },

    /**
     * Elimina una tarea verificando que pertenezca al usuario.
     */
    remove: async (id, usuario_id) => {
        const query = 'DELETE FROM tareas WHERE id = $1 AND usuario_id = $2';
        const result = await pool.query(query, [id, usuario_id]);
        if (result.rowCount === 0) throw new Error('Tarea no encontrada o no autorizada');
    },
};

module.exports = tareaRepository;