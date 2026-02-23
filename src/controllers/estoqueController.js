import pool from '../db.js';

// Listar todo o estoque (visão global: material + obra + quantidade)
export const listarTodoEstoque = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT eo.id, eo.obra_id, eo.material_id, eo.quantidade, eo.status, eo.updated_at,
              mc.nome AS material_nome, mc.categoria, mc.unidade_medida,
              o.nome AS obra_nome
       FROM estoque_obras eo
       JOIN materiais_catalogo mc ON eo.material_id = mc.id
       JOIN obras o ON eo.obra_id = o.id
       ORDER BY mc.nome ASC, o.nome ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar estoque global:', err.message);
    res.status(500).json({ error: 'Erro ao buscar estoque.', details: err.message });
  }
};

// Listar estoque de uma obra específica (com nome do material)
export const listarEstoquePorObra = async (req, res) => {
  try {
    const { obraId } = req.params;
    const result = await pool.query(
      `SELECT eo.*, mc.nome AS material_nome, mc.categoria, mc.unidade_medida
       FROM estoque_obras eo
       JOIN materiais_catalogo mc ON eo.material_id = mc.id
       WHERE eo.obra_id = $1
       ORDER BY mc.nome ASC`,
      [obraId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar estoque:', err.message);
    res.status(500).json({ error: 'Erro ao buscar estoque.', details: err.message });
  }
};

// Adicionar ou atualizar item no estoque de uma obra
export const upsertEstoque = async (req, res) => {
  try {
    const { obra_id, material_id, quantidade, status } = req.body;
    const result = await pool.query(
      `INSERT INTO estoque_obras (obra_id, material_id, quantidade, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (obra_id, material_id)
       DO UPDATE SET quantidade = $3, status = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [obra_id, material_id, quantidade, status || 'OK']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar estoque:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar estoque.', details: err.message });
  }
};

export const deletarEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM estoque_obras WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item de estoque não encontrado.' });
    }
    res.status(200).json({ message: 'Item removido do estoque.' });
  } catch (err) {
    console.error('Erro ao deletar estoque:', err.message);
    res.status(500).json({ error: 'Erro ao deletar estoque.', details: err.message });
  }
};
