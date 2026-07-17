require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     parseInt(process.env.DB_PORT, 10),
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL —', process.env.DB_NAME);
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PG:', err.message);
});

module.exports = pool;