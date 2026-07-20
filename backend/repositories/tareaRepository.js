const pool = require('../config/db');

const tareaRepository = {
    findAll: async () => {
        const query = 'SELECT * FROM tareas ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },
    create: async (tarea) => {
        const { titulo, descripcion, prioridad, fecha_vencimiento } = tarea;
        const query = `
            INSERT INTO tareas (titulo, descripcion, prioridad, fecha_vencimiento)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [titulo, descripcion, prioridad, fecha_vencimiento];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    toggle: async (id) => {
        const query = `
            UPDATE tareas
            SET completada = NOT completada
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    remove: async (id) => {
        const query = 'DELETE FROM tareas WHERE id = $1';
        await pool.query(query, [id]);
    },
};

module.exports = tareaRepository;