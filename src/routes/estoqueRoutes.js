import { Router } from 'express';
import { listarTodoEstoque, listarEstoquePorObra, upsertEstoque, deletarEstoque } from '../controllers/estoqueController.js';

const router = Router();

router.get('/', listarTodoEstoque);
router.get('/obra/:obraId', listarEstoquePorObra);
router.post('/', upsertEstoque);
router.delete('/:id', deletarEstoque);

export default router;
