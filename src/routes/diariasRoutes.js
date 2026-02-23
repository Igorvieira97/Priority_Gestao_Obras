import { Router } from 'express';
import { listarDiariasPorObraData, lancarDiaria, historicoPessoa, contarDiariasNaoPagas } from '../controllers/diariasController.js';

const router = Router();

router.get('/obra/:obraId', listarDiariasPorObraData);       // GET /api/diarias/obra/1?data=2026-02-17
router.post('/', lancarDiaria);
router.get('/historico/:obraId/:pessoaId', historicoPessoa);
router.get('/pendentes/:obraId/:pessoaId', contarDiariasNaoPagas);

export default router;
