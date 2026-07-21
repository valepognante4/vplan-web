const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // O tu cadena de conexión directa a Supabase
  family: 4, // <-- Esto fuerza el uso de IPv4 y evita el error ENETUNREACH
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;