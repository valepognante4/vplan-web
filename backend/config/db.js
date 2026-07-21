const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para conexiones externas como Supabase
    },
});

pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL via DATABASE_URL');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PG:', err.message);
});

module.exports = pool;