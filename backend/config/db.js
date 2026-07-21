const path = require('path');
// Cargar el .env desde la raíz del proyecto sin importar el CWD desde donde se lanza Node
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      user:     process.env.DB_USER,
      host:     process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port:     parseInt(process.env.DB_PORT, 10) || 5432,
    };

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL —', process.env.DB_NAME || 'via DATABASE_URL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PG:', err.message);
});

module.exports = pool;