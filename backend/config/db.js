const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1rcmprjavt0iuYeM@db.rxrrojbnggynffouphdq.supabase.co:5432/postgres',
  family: 4,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;