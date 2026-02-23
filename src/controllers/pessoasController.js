import pool from '../db.js';

export const listarPessoas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        COALESCE(json_agg(json_build_object('id', o.id, 'nome', o.nome)) FILTER (WHERE o.id IS NOT NULL), '[]') AS obras
       FROM pessoas p
       LEFT JOIN alocacoes a ON p.id = a.pessoa_id
       LEFT JOIN obras o ON a.obra_id = o.id
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar pessoas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar pessoas.', details: err.message });
  }
};

export const criarPessoa = async (req, res) => {
  try {
    const { nome, funcao, telefone, valor_diaria } = req.body;
    const result = await pool.query(
      'INSERT INTO pessoas (nome, funcao, telefone, valor_diaria) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, funcao, telefone, valor_diaria || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar pessoa:', err.message);
    res.status(500).json({ error: 'Erro ao criar pessoa.', details: err.message });
  }
};

export const atualizarPessoa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, funcao, telefone, valor_diaria } = req.body;
    const result = await pool.query(
      'UPDATE pessoas SET nome = $1, funcao = $2, telefone = $3, valor_diaria = $4 WHERE id = $5 RETURNING *',
      [nome, funcao, telefone, valor_diaria || 0, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar pessoa:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar pessoa.', details: err.message });
  }
};

export const deletarPessoa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM pessoas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada.' });
    }
    res.status(200).json({ message: 'Pessoa deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar pessoa:', err.message);
    res.status(500).json({ error: 'Erro ao deletar pessoa.', details: err.message });
  }
};
