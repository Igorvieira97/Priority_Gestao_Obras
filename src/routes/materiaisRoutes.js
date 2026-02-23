import { Router } from 'express';
import { listarMateriais, criarMaterial, atualizarMaterial, deletarMaterial } from '../controllers/materiaisController.js';

const router = Router();

router.get('/', listarMateriais);
router.post('/', criarMaterial);
router.put('/:id', atualizarMaterial);
router.delete('/:id', deletarMaterial);

export default router;
