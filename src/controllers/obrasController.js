import pool from '../db.js';

export const listarObras = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obras ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar obras:', err.message);
    res.status(500).json({ error: 'Erro ao buscar obras.', details: err.message });
  }
};

export const buscarObraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM obras WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar obra:', err.message);
    res.status(500).json({ error: 'Erro ao buscar obra.', details: err.message });
  }
};

export const criarObra = async (req, res) => {
  try {
    const { nome, endereco, status, progresso } = req.body;
    const result = await pool.query(
      'INSERT INTO obras (nome, endereco, status, progresso) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, endereco, status || 'Em Andamento', progresso || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar obra:', err.message);
    res.status(500).json({ error: 'Erro ao criar obra.', details: err.message });
  }
};

export const atualizarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, status, progresso } = req.body;
    const result = await pool.query(
      'UPDATE obras SET nome = $1, endereco = $2, status = $3, progresso = $4 WHERE id = $5 RETURNING *',
      [nome, endereco, status, progresso, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar obra:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar obra.', details: err.message });
  }
};

export const deletarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM obras WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada.' });
    }
    res.status(200).json({ message: 'Obra deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar obra:', err.message);
    res.status(500).json({ error: 'Erro ao deletar obra.', details: err.message });
  }
};
