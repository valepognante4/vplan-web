const tareaRepository = require('../repositories/tareaRepository');

const tareaService = {
    obtenerTodasLasTareas: async () => {
        return await tareaRepository.findAll();
    },
    crearNuevaTarea: async (datosTarea) => {
        return await tareaRepository.create(datosTarea);
    },
    toggleTarea: async (id) => {
        return await tareaRepository.toggle(id);
    },
    eliminarTarea: async (id) => {
        return await tareaRepository.remove(id);
    },
};

module.exports = tareaService;