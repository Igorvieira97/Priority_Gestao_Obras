import pool from '../db.js';

// Listar alocações de uma obra
export const listarAlocacoesPorObra = async (req, res) => {
  try {
    const { obraId } = req.params;
    const result = await pool.query(
      `SELECT a.id, a.pessoa_id, a.obra_id, p.nome, p.funcao, p.telefone, p.valor_diaria
       FROM alocacoes a
       JOIN pessoas p ON a.pessoa_id = p.id
       WHERE a.obra_id = $1
       ORDER BY p.nome ASC`,
      [obraId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar alocações:', err.message);
    res.status(500).json({ error: 'Erro ao buscar alocações.', details: err.message });
  }
};

// Alocar pessoa a uma obra
export const criarAlocacao = async (req, res) => {
  try {
    const { pessoa_id, obra_id } = req.body;
    const result = await pool.query(
      'INSERT INTO alocacoes (pessoa_id, obra_id) VALUES ($1, $2) ON CONFLICT (pessoa_id, obra_id) DO NOTHING RETURNING *',
      [pessoa_id, obra_id]
    );
    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'Pessoa já está alocada nesta obra.' });
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar alocação:', err.message);
    res.status(500).json({ error: 'Erro ao criar alocação.', details: err.message });
  }
};

// Remover alocação
export const deletarAlocacao = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alocacoes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alocação não encontrada.' });
    }
    res.status(200).json({ message: 'Alocação removida com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar alocação:', err.message);
    res.status(500).json({ error: 'Erro ao deletar alocação.', details: err.message });
  }
};
