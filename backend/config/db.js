const { Pool } = require('pg');

const pool = new Pool({
  // En Render, debes configurar la variable de entorno DATABASE_URL
  // con la "Transaction pooler connection string" de Supabase (puerto 6543).
  // NO uses el host "db.rxrrojbnggynffouphdq.supabase.co" ya que solo tiene IPv6.
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || '1rcmprjavt0iuYeM'}@${process.env.DB_HOST || 'db.rxrrojbnggynffouphdq.supabase.co'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'postgres'}`,
  ssl: process.env.DB_HOST !== 'localhost' ? {
    rejectUnauthorized: false
  } : false
});

module.exports = pool;