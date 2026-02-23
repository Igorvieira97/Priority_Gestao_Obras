import { Router } from 'express';
import { listarAlocacoesPorObra, criarAlocacao, deletarAlocacao } from '../controllers/alocacoesController.js';

const router = Router();

router.get('/obra/:obraId', listarAlocacoesPorObra);
router.post('/', criarAlocacao);
router.delete('/:id', deletarAlocacao);

export default router;
