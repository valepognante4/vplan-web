const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1rcmprjavt0iuYeM@db.rxrrojbnggynffouphdq.supabase.co:5432/postgres',
  family: 4, // Fuerza el uso de IPv4 evitando el error ENETUNREACH
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;