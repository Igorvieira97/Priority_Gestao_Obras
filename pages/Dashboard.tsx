import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, DollarSign, HardHat } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const API_URL = 'http://localhost:3000/api';

const PIE_COLOR_MAP: Record<string, string> = {
  'Em Andamento': '#C5A059',
  'Concluída': '#0B2822',
  'Pausada': '#94a3b8',
};

interface DashboardStats {
  totalObras: number;
  totalColaboradores: number;
  totalDespesas: number;
  chartObras: { name: string; value: number }[];
  chartDespesas: { mes: string; valor: number }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalObras: 0,
    totalColaboradores: 0,
    totalDespesas: 0,
    chartObras: [],
    chartDespesas: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Obras Ativas',
      value: String(stats.totalObras),
      subtitle: 'Cadastradas no sistema',
      icon: HardHat,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Colaboradores',
      value: String(stats.totalColaboradores),
      subtitle: 'Ativos no sistema',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      label: 'Total Despesas',
      value: Number(stats.totalDespesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      subtitle: 'Total acumulado',
      icon: DollarSign,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-priority-green tracking-tighter uppercase italic">Painel de Controle</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Visão geral das operações</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-3xl font-black text-priority-green mt-2 leading-none">{card.value}</h3>
                <p className="text-xs text-gray-400 font-medium mt-2">{card.subtitle}</p>
              </div>
              <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center`}>
                <card.icon className={`h-7 w-7 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Despesas Mensais */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-black text-priority-green uppercase tracking-tight">Evolução de Custos</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Despesas mensais (últimos 6 meses)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartDespesas} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Despesas']}
                  cursor={{ fill: 'rgba(197, 160, 89, 0.08)' }}
                />
                <Bar dataKey="valor" fill="#C5A059" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Status das Obras */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-black text-priority-green uppercase tracking-tight">Status das Obras</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Distribuição por situação atual</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartObras}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {stats.chartObras.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLOR_MAP[entry.name] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
                  formatter={(value: number, name: string) => [`${value} obras`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => <span className="text-xs font-bold text-gray-500 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;