import pool from '../db.js';

// Listar diárias de uma obra em uma data específica
export const listarDiariasPorObraData = async (req, res) => {
  try {
    const { obraId } = req.params;
    const { data } = req.query; // ?data=2026-02-17
    const result = await pool.query(
      `SELECT d.*, p.nome AS pessoa_nome, p.funcao
       FROM diarias d
       JOIN pessoas p ON d.pessoa_id = p.id
       WHERE d.obra_id = $1 AND d.data_diaria = $2
       ORDER BY p.nome ASC`,
      [obraId, data]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar diárias:', err.message);
    res.status(500).json({ error: 'Erro ao buscar diárias.', details: err.message });
  }
};

// Lançar diária (upsert) - status: 'Presença', 'Meia', 'Falta'
export const lancarDiaria = async (req, res) => {
  try {
    const { pessoa_id, obra_id, data_diaria, status } = req.body;
    const result = await pool.query(
      `INSERT INTO diarias (pessoa_id, obra_id, data_diaria, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (pessoa_id, obra_id, data_diaria)
       DO UPDATE SET status = $4
       RETURNING *`,
      [pessoa_id, obra_id, data_diaria, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao lançar diária:', err.message);
    res.status(500).json({ error: 'Erro ao lançar diária.', details: err.message });
  }
};

// Histórico de diárias de uma pessoa em uma obra
export const historicoPessoa = async (req, res) => {
  try {
    const { obraId, pessoaId } = req.params;
    const result = await pool.query(
      `SELECT * FROM diarias
       WHERE obra_id = $1 AND pessoa_id = $2
       ORDER BY data_diaria DESC`,
      [obraId, pessoaId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err.message);
    res.status(500).json({ error: 'Erro ao buscar histórico.', details: err.message });
  }
};

// Contar diárias não pagas de uma pessoa em uma obra
export const contarDiariasNaoPagas = async (req, res) => {
  try {
    const { obraId, pessoaId } = req.params;

    // Buscar data do último pagamento
    const pagamento = await pool.query(
      `SELECT data_corte FROM pagamentos_diarias
       WHERE obra_id = $1 AND pessoa_id = $2
       ORDER BY data_corte DESC LIMIT 1`,
      [obraId, pessoaId]
    );

    const dataCorte = pagamento.rows.length > 0 ? pagamento.rows[0].data_corte : '1900-01-01';

    // Conta 'Presença' como 1 diária e 'Meia' como 0.5
    const result = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN status = 'Presença' THEN 1 WHEN status = 'Meia' THEN 0.5 ELSE 0 END), 0) AS dias_pendentes
       FROM diarias
       WHERE obra_id = $1 AND pessoa_id = $2 AND status IN ('Presença', 'Meia') AND data_diaria > $3`,
      [obraId, pessoaId, dataCorte]
    );

    res.status(200).json({ dias_pendentes: parseFloat(result.rows[0].dias_pendentes) });
  } catch (err) {
    console.error('Erro ao contar diárias:', err.message);
    res.status(500).json({ error: 'Erro ao contar diárias.', details: err.message });
  }
};
