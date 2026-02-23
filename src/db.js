import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => {
    console.log('Banco de dados conectado com sucesso ao Supabase!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  });

export default pool;
