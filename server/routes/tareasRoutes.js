const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareaController');

// Definimos los endpoints
// La ruta base ya es '/api/tareas', así que '/' aquí significa '/api/tareas/'
router.get('/', tareasController.obtenerTareas);
router.post('/', tareasController.crearTarea);

module.exports = router;