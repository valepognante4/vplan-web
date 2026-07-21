const { Pool } = require('pg');

// Forzamos la lectura estricta de la URL de producción o de tu .env local
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("¡ERROR CRÍTICO! Falta la variable DATABASE_URL.");
}

const pool = new Pool({
  connectionString: connectionString,
  family: 4, // Fuerza IPv4 para evitar bloqueos en la nube
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;