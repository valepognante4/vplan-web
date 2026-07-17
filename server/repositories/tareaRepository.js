const pool = require('../config/db');

const tareaRepository = {
    findAll: async () => {
        const query = 'SELECT * FROM tareas';
        const result = await pool.query(query);
        return result.rows;
    },
    create: async (tarea) => {
        const { titulo, descripcion, prioridad, fecha_vencimiento } = tarea;
        const query = 'INSERT INTO tareas (titulo, descripcion, prioridad, fecha_vencimiento) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [titulo, descripcion, prioridad, fecha_vencimiento];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = tareaRepository;