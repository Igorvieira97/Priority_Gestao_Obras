import pool from '../db.js';

export const listarDespesas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM despesas ORDER BY data_despesa DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar despesas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar despesas.', details: err.message });
  }
};

export const criarDespesa = async (req, res) => {
  try {
    const { descricao, categoria, valor, data_despesa, observacao, comprovante } = req.body;
    const result = await pool.query(
      'INSERT INTO despesas (descricao, categoria, valor, data_despesa, observacao, comprovante) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [descricao, categoria, valor, data_despesa, observacao || null, comprovante || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar despesa:', err.message);
    res.status(500).json({ error: 'Erro ao criar despesa.', details: err.message });
  }
};

export const atualizarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, categoria, valor, data_despesa, observacao, comprovante } = req.body;
    const result = await pool.query(
      'UPDATE despesas SET descricao=$1, categoria=$2, valor=$3, data_despesa=$4, observacao=$5, comprovante=$6 WHERE id=$7 RETURNING *',
      [descricao, categoria, valor, data_despesa, observacao || null, comprovante || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar despesa:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar despesa.', details: err.message });
  }
};

export const alternarStatusPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { pago } = req.body;
    const result = await pool.query('UPDATE despesas SET pago = $1 WHERE id = $2 RETURNING *', [pago, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao alterar status de pagamento:', err.message);
    res.status(500).json({ error: 'Erro ao alterar status.', details: err.message });
  }
};

export const deletarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM despesas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }
    res.status(200).json({ message: 'Despesa deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar despesa:', err.message);
    res.status(500).json({ error: 'Erro ao deletar despesa.', details: err.message });
  }
};
