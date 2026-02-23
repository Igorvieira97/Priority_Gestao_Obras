import { Router } from 'express';
import { listarUsuarios, criarUsuario, atualizarUsuario, deletarUsuario, loginUsuario, alterarSenhaPrimeiroAcesso } from '../controllers/usuariosController.js';

const router = Router();

router.get('/', listarUsuarios);
router.post('/', criarUsuario);
router.post('/login', loginUsuario);
router.post('/primeiro-acesso', alterarSenhaPrimeiroAcesso);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);

export default router;
