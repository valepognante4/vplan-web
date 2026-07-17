const tareaRepository = require('../repositories/tareaRepository');

const tareaService = {
    obtenerTodasLasTareas: async () => {
        return await tareaRepository.findAll();
    },
    crearNuevaTarea: async (datosTarea) => {
        // Aquí podrías validar reglas de negocio antes de guardar
        if (datosTarea.prioridad === 'ALTA' && !datosTarea.descripcion) {
            throw new Error('Las tareas de alta prioridad deben tener descripción');
        }
        return await tareaRepository.create(datosTarea);
    }
};

module.exports = tareaService;