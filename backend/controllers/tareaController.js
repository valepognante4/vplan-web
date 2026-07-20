const tareaService = require('../services/tareaService');

/**
 * GET /api/tareas
 * Devuelve todas las tareas del usuario autenticado.
 */
exports.obtenerTareas = async (req, res) => {
    try {
        // Seguridad extra: verificar que el middleware haya inyectado req.usuario
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        const tareas = await tareaService.obtenerTodasLasTareas(req.usuario.id);
        // Siempre devuelve array (vacío si el usuario no tiene tareas)
        res.status(200).json(Array.isArray(tareas) ? tareas : []);
    } catch (error) {
        console.error('[obtenerTareas] Error:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno al obtener las tareas.', detalle: error.message });
    }
};

/**
 * POST /api/tareas
 * Crea una nueva tarea para el usuario autenticado.
 */
exports.crearTarea = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        // Mapear campos del frontend (inglés) al formato del service/DB (español)
        const { title, description, priority, dueDate } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'El campo "title" es obligatorio.' });
        }
        const nuevaTarea = await tareaService.crearNuevaTarea({
            titulo:            title.trim(),
            descripcion:       description || null,
            prioridad:         priority    || 'MEDIA',
            fecha_vencimiento: dueDate     || null,
        }, req.usuario.id);
        res.status(201).json(nuevaTarea);
    } catch (error) {
        console.error('[crearTarea] Error:', error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * PATCH /api/tareas/:id/toggle
 * Alterna el estado de una tarea (PENDIENTE <-> COMPLETADA).
 */
exports.toggleTarea = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        const tarea = await tareaService.toggleTarea(req.params.id, req.usuario.id);
        res.status(200).json(tarea);
    } catch (error) {
        console.error('[toggleTarea] Error:', error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};

/**
 * DELETE /api/tareas/:id
 * Elimina una tarea del usuario autenticado.
 */
exports.eliminarTarea = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        await tareaService.eliminarTarea(req.params.id, req.usuario.id);
        res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('[eliminarTarea] Error:', error.message, error.stack);
        res.status(400).json({ error: error.message });
    }
};