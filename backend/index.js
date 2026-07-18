require('dotenv').config();
const express     = require('express');
const app         = express();

// ── Importar rutas ────────────────────────────────────────────────────────────
const tareasRoutes = require('./routes/tareasRoutes');
const authRoutes   = require('./routes/authRoutes');

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(express.json()); // Parsear JSON en req.body

// ── Montar rutas ──────────────────────────────────────────────────────────────
app.use('/api/tareas', tareasRoutes);
app.use('/api/auth',   authRoutes);

// ── Ruta de salud (útil para verificar que el server está activo) ─────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── Arrancar servidor ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});