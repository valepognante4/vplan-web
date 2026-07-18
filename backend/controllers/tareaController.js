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
        const nuevaTarea = await tareaService.crearNuevaTarea(req.body);
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};