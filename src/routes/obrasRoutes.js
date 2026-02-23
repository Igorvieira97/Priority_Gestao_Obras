import { Router } from 'express';
import { listarObras, buscarObraPorId, criarObra, atualizarObra, deletarObra } from '../controllers/obrasController.js';

const router = Router();

router.get('/', listarObras);
router.get('/:id', buscarObraPorId);
router.post('/', criarObra);
router.put('/:id', atualizarObra);
router.delete('/:id', deletarObra);

export default router;
