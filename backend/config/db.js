const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  family: 4, // Fuerza el uso de IPv4 para evitar errores de red ENETUNREACH en la nube
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;