import pool from '../db.js';

// Registrar pagamento (data de corte)
export const registrarPagamento = async (req, res) => {
  try {
    const { pessoa_id, obra_id, data_corte, valor_pago, qtd_diarias } = req.body;
    const result = await pool.query(
      'INSERT INTO pagamentos_diarias (pessoa_id, obra_id, data_corte, valor_pago, qtd_diarias) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pessoa_id, obra_id, data_corte, valor_pago || 0, qtd_diarias || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao registrar pagamento:', err.message);
    res.status(500).json({ error: 'Erro ao registrar pagamento.', details: err.message });
  }
};

// Listar histórico de pagamentos de uma pessoa em uma obra
export const listarPagamentos = async (req, res) => {
  try {
    const { obraId, pessoaId } = req.params;
    const result = await pool.query(
      `SELECT * FROM pagamentos_diarias
       WHERE obra_id = $1 AND pessoa_id = $2
       ORDER BY data_pagamento DESC`,
      [obraId, pessoaId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar pagamentos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar pagamentos.', details: err.message });
  }
};
