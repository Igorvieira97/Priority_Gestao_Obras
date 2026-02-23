import pool from '../db.js';
import bcrypt from 'bcryptjs';

export const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, status FROM usuarios ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar usuários:', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.', details: err.message });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const { nome, email } = req.body;
    const senhaPadrao = process.env.DEFAULT_PASSWORD || '123456';
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaPadrao, salt);
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, status',
      [nome, email, senhaHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('Erro ao criar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao criar usuário.', details: err.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, status } = req.body;
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, status = $3 WHERE id = $4 RETURNING id, nome, email, status, primeiro_acesso, created_at',
      [nome, email, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar usuário.', details: err.message });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao deletar usuário.', details: err.message });
  }
};

// Login com bcrypt
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash, status, primeiro_acesso FROM usuarios WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    if (usuario.status !== 'Ativo') {
      return res.status(403).json({ error: 'Usuário inativo.' });
    }
    const { senha_hash, ...usuarioSemSenha } = usuario;
    res.status(200).json(usuarioSemSenha);
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro ao realizar login.', details: err.message });
  }
};

export const alterarSenhaPrimeiroAcesso = async (req, res) => {
  try {
    const { id, novaSenha } = req.body;
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);
    const result = await pool.query(
      'UPDATE usuarios SET senha_hash = $1, primeiro_acesso = FALSE WHERE id = $2 RETURNING id, nome, email, status, primeiro_acesso',
      [senhaHash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao alterar senha:', err.message);
    res.status(500).json({ error: 'Erro ao alterar senha.', details: err.message });
  }
};
