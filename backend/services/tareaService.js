const tareaRepository = require('../repositories/tareaRepository');

const tareaService = {
    obtenerTodasLasTareas: async (usuario_id) => {
        return await tareaRepository.findAll(usuario_id);
    },
    crearNuevaTarea: async (datosTarea, usuario_id) => {
        return await tareaRepository.create(datosTarea, usuario_id);
    },
    toggleTarea: async (id, usuario_id) => {
        return await tareaRepository.toggle(id, usuario_id);
    },
    eliminarTarea: async (id, usuario_id) => {
        return await tareaRepository.remove(id, usuario_id);
    },
};

module.exports = tareaService;