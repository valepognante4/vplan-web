// ─────────────────────────────────────────────────────────────────────────────
// NOTA: dotenv NO se carga aquí. La única llamada a dotenv debe estar en el
// punto de entrada (index.js) antes de requerir cualquier otro módulo.
// Si dotenv se llama aquí también, puede pisar las variables de entorno
// inyectadas por Render con valores del .env local (que no existe en producción).
// ─────────────────────────────────────────────────────────────────────────────
const { Pool } = require('pg');

// ── Log de diagnóstico (no expone contraseñas) ────────────────────────────────
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    // Muestra solo el host de la URL, nunca el password
    try {
        const parsed = new URL(dbUrl);
        console.log(`[db] DATABASE_URL detectada → host: ${parsed.hostname}, db: ${parsed.pathname.slice(1)}`);
    } catch {
        console.log('[db] DATABASE_URL presente pero no se pudo parsear la URL.');
    }
} else {
    console.warn('[db] ⚠️  DATABASE_URL NO está definida. Intentando con variables individuales...');
    console.log(`[db] DB_HOST=${process.env.DB_HOST || '(no definido)'}, DB_NAME=${process.env.DB_NAME || '(no definido)'}`);
}

// ── Configuración del pool ────────────────────────────────────────────────────
// Prioridad 1: DATABASE_URL (formato: postgres://user:pass@host:port/dbname)
// Prioridad 2: Variables individuales DB_HOST / DB_USER / etc.
const poolConfig = dbUrl
    ? {
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }, // requerido por Supabase / Render
      }
    : {
        user:     process.env.DB_USER,
        host:     process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port:     parseInt(process.env.DB_PORT, 10) || 5432,
      };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
    const target = dbUrl
        ? (() => { try { return new URL(dbUrl).hostname; } catch { return 'via DATABASE_URL'; } })()
        : process.env.DB_HOST;
    console.log(`✅ Conectado a PostgreSQL — host: ${target}`);
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PG:', err.message);
});

module.exports = pool;