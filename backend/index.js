require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors    = require('cors');
const app     = express();

// ── CORS: permite peticiones desde cualquier puerto de localhost ──────────────
const LOCALHOST_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
    origin: (origin, callback) => {
        // Sin origen → Postman, curl, herramientas internas → permitir
        if (!origin || LOCALHOST_REGEX.test(origin)) {
            return callback(null, true);
        }
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// ⚡ Manejar explícitamente el preflight OPTIONS en TODAS las rutas
// Express 5 no acepta '*' como wildcard; se usa una regexp que cubre todo.
app.options(/(.*)/, cors(corsOptions));

app.use(cors(corsOptions));

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(express.json());

// ── Importar rutas ────────────────────────────────────────────────────────────
const tareasRoutes = require('./routes/tareasRoutes');
const authRoutes   = require('./routes/authRoutes');

// ── Montar rutas ──────────────────────────────────────────────────────────────
app.use('/api/tareas', tareasRoutes);
app.use('/api/auth',   authRoutes);

// ── Ruta de salud ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── Arrancar servidor ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});