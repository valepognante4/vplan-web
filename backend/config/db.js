const { Pool } = require('pg');

const pool = new Pool({
  host: 'db.rxrrojbnggynffouphdq.supabase.co',
  port: 6543,
  user: 'postgres',
  password: '1rcmprjavt0iuYeM',
  database: 'postgres',
  family: 4, // Obliga al socket de red a usar IPv4 de forma nativa
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;