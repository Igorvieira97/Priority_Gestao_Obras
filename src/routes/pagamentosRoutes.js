import { Router } from 'express';
import { registrarPagamento, listarPagamentos } from '../controllers/pagamentosController.js';

const router = Router();

router.post('/', registrarPagamento);
router.get('/:obraId/:pessoaId', listarPagamentos);

export default router;
