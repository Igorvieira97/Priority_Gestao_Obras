import { Router } from 'express';
import { listarDespesas, criarDespesa, atualizarDespesa, deletarDespesa, alternarStatusPagamento } from '../controllers/despesasController.js';

const router = Router();

router.get('/', listarDespesas);
router.post('/', criarDespesa);
router.put('/:id', atualizarDespesa);
router.patch('/:id/pagamento', alternarStatusPagamento);
router.delete('/:id', deletarDespesa);

export default router;
