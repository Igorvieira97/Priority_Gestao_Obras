import pool from '../db.js';

// Lista todos os materiais do catálogo (dicionário puro)
export const listarMateriais = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM materiais_catalogo ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar materiais:', err.message);
    res.status(500).json({ error: 'Erro ao buscar materiais.', details: err.message });
  }
};

// Cria um novo material no catálogo
export const criarMaterial = async (req, res) => {
  try {
    const { nome, categoria, unidade_medida } = req.body;
    const result = await pool.query(
      'INSERT INTO materiais_catalogo (nome, categoria, unidade_medida) VALUES ($1, $2, $3) RETURNING *',
      [nome, categoria, unidade_medida]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar material:', err.message);
    res.status(500).json({ error: 'Erro ao criar material.', details: err.message });
  }
};

// Atualiza um material do catálogo
export const atualizarMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, unidade_medida } = req.body;
    const result = await pool.query(
      'UPDATE materiais_catalogo SET nome = $1, categoria = $2, unidade_medida = $3 WHERE id = $4 RETURNING *',
      [nome, categoria, unidade_medida, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar material:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar material.', details: err.message });
  }
};

// Deleta material do catálogo (e registros associados em estoque_obras)
export const deletarMaterial = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');
    await client.query('DELETE FROM estoque_obras WHERE material_id = $1', [id]);
    const result = await client.query('DELETE FROM materiais_catalogo WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Material não encontrado.' });
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Material deletado com sucesso.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao deletar material:', err.message);
    res.status(500).json({ error: 'Erro ao deletar material.', details: err.message });
  } finally {
    client.release();
  }
};
