import { Router } from 'express';
import { listarPessoas, criarPessoa, atualizarPessoa, deletarPessoa } from '../controllers/pessoasController.js';

const router = Router();

router.get('/', listarPessoas);
router.post('/', criarPessoa);
router.put('/:id', atualizarPessoa);
router.delete('/:id', deletarPessoa);

export default router;
