const tareaService = require('../services/tareaService');

exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await tareaService.obtenerTodasLasTareas();
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearTarea = async (req, res) => {
    try {
        // Mapear campos del frontend (inglés) al formato del service/DB (español)
        const { title, description, priority, dueDate } = req.body;
        const nuevaTarea = await tareaService.crearNuevaTarea({
            titulo:            title,
            descripcion:       description,
            prioridad:         priority,
            fecha_vencimiento: dueDate || null,
        });
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.toggleTarea = async (req, res) => {
    try {
        const tarea = await tareaService.toggleTarea(req.params.id);
        res.status(200).json(tarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        await tareaService.eliminarTarea(req.params.id);
        res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};