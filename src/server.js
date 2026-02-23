import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import obrasRoutes from './routes/obrasRoutes.js';
import materiaisRoutes from './routes/materiaisRoutes.js';
import estoqueRoutes from './routes/estoqueRoutes.js';
import pessoasRoutes from './routes/pessoasRoutes.js';
import alocacoesRoutes from './routes/alocacoesRoutes.js';
import diariasRoutes from './routes/diariasRoutes.js';
import pagamentosRoutes from './routes/pagamentosRoutes.js';
import despesasRoutes from './routes/despesasRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Rotas
app.use('/api/obras', obrasRoutes);
app.use('/api/materiais', materiaisRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/pessoas', pessoasRoutes);
app.use('/api/alocacoes', alocacoesRoutes);
app.use('/api/diarias', diariasRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/despesas', despesasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Priority Engenharia funcionando!' });
});

// Rota para testar conexão com o banco
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: err.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
