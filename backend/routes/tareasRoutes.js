const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareaController');

// La ruta base ya es '/api/tareas'
router.get('/',               tareasController.obtenerTareas);
router.post('/',              tareasController.crearTarea);
router.patch('/:id/toggle',   tareasController.toggleTarea);
router.delete('/:id',         tareasController.eliminarTarea);

module.exports = router;