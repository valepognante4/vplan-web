require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const app          = express();

// ── CORS: permite peticiones desde cualquier puerto de localhost ──────────────
const LOCALHOST_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || LOCALHOST_REGEX.test(origin) || origin === FRONTEND_URL) {
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
app.use(cookieParser()); // Necesario para leer req.cookies (cookies HTTP-only)

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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});