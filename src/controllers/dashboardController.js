import pool from '../db.js';

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const getDashboardStats = async (req, res) => {
  try {
    const [obrasResult, colaboradoresResult, despesasResult, chartObrasResult, chartDespesasResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM obras"),
      pool.query("SELECT COUNT(*) FROM pessoas"),
      pool.query("SELECT COALESCE(SUM(valor), 0) AS total FROM despesas"),
      pool.query("SELECT COALESCE(status, 'Em Andamento') AS status, COUNT(*)::int AS value FROM obras GROUP BY status"),
      pool.query("SELECT data_despesa, valor FROM despesas WHERE data_despesa >= CURRENT_DATE - INTERVAL '6 months'"),
    ]);

    // Agrupar despesas por mês
    const now = new Date();
    const mesesMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      mesesMap[key] = { mes: MESES_PT[d.getMonth()], valor: 0 };
    }
    for (const row of chartDespesasResult.rows) {
      const d = new Date(row.data_despesa);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (mesesMap[key]) {
        mesesMap[key].valor += Number(row.valor);
      }
    }
    const chartDespesas = Object.values(mesesMap);

    // Chart obras: renomear campo para name (Recharts)
    const chartObras = chartObrasResult.rows.map(r => ({ name: r.status, value: r.value }));

    res.status(200).json({
      totalObras: Number(obrasResult.rows[0].count),
      totalColaboradores: Number(colaboradoresResult.rows[0].count),
      totalDespesas: Number(despesasResult.rows[0].total),
      chartObras,
      chartDespesas,
    });
  } catch (err) {
    console.error('Erro ao buscar stats do dashboard:', err.message);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard.', details: err.message });
  }
};
