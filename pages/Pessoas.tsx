import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Award, Plus, X, Building2, Check, Edit2, Trash2, Search, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

interface ObraAlocada {
  id: number;
  nome: string;
}

interface Person {
  id: number;
  nome: string;
  funcao: string;
  telefone: string;
  valor_diaria: number;
  obras: ObraAlocada[];
}

const roles = ['Engenheiro(a)', 'Arquiteto(a)', 'Mestre de Obras', 'Pedreiro', 'Eletricista', 'Encanador', 'Auxiliar'];

const Pessoas: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    funcao: roles[0],
    telefone: '',
    valor_diaria: 0,
  });

  const fetchPessoas = async () => {
    try {
      const res = await axios.get(`${API_URL}/pessoas`);
      setPeople(res.data);
    } catch (err) {
      console.error('Erro ao carregar pessoas:', err);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const handleOpenAdd = () => {
    setEditingPerson(null);
    setFormData({ nome: '', funcao: roles[0], telefone: '', valor_diaria: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      nome: person.nome,
      funcao: person.funcao,
      telefone: person.telefone,
      valor_diaria: person.valor_diaria || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await axios.put(`${API_URL}/pessoas/${editingPerson.id}`, formData);
      } else {
        await axios.post(`${API_URL}/pessoas`, formData);
      }
      setIsModalOpen(false);
      fetchPessoas();
    } catch (err) {
      console.error('Erro ao salvar pessoa:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/pessoas/${id}`);
      setDeletingId(null);
      fetchPessoas();
    } catch (err) {
      console.error('Erro ao deletar pessoa:', err);
    }
  };

  const filtered = people.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.obras.some(o => o.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-priority-green uppercase tracking-tighter italic">Equipe e Gestão</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Diretório Global de Colaboradores (RH)</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou função..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl w-full md:w-80 font-bold text-priority-green focus:border-priority-gold outline-none transition-all shadow-sm"
            />
          </div>
          <button onClick={handleOpenAdd} className="bg-priority-gold hover:bg-priority-goldHover text-white px-8 py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-black shadow-xl transition-all active:scale-95">
            <Plus size={20} /> Novo Colaborador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((person) => (
          <div key={person.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-priority-green text-priority-gold flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-105 transition-transform">{person.nome.charAt(0)}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(person)} 
                    className="w-11 h-11 bg-priority-gold text-white rounded-xl flex items-center justify-center shadow-md shadow-priority-gold/20 hover:bg-priority-goldHover transition-all active:scale-90"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => setDeletingId(person.id)} 
                    className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200 hover:bg-red-600 transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {deletingId === person.id && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3 animate-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center">Remover colaborador?</p>
                   <div className="flex gap-2">
                      <button onClick={() => handleDelete(person.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-[9px] font-black uppercase shadow-sm">Sim</button>
                      <button onClick={() => setDeletingId(null)} className="flex-1 bg-white text-gray-400 py-2 rounded-lg text-[9px] font-black uppercase border border-gray-200">Não</button>
                   </div>
                </div>
              )}

              <h3 className="font-black text-2xl text-priority-green mb-1 leading-tight group-hover:text-priority-gold transition-colors">{person.nome}</h3>
              <div className="text-priority-gold text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Award size={14} /> {person.funcao}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-50">
                {person.obras.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <div className="w-full flex items-center gap-2 mb-1">
                      <Building2 size={12} className="text-priority-gold" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alocações Ativas</span>
                    </div>
                    {person.obras.map((obra) => (
                      <span key={obra.id} className="px-2.5 py-1 bg-priority-gold/5 text-priority-gold rounded-md text-[9px] font-black uppercase border border-priority-gold/10">
                        {obra.nome}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-xs font-black text-priority-green">
                    <Phone size={14} className="text-gray-300" />
                    <span>{person.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                    <DollarSign size={14} className="text-priority-gold" />
                    <span>Diária: <strong className="text-priority-green">R$ {Number(person.valor_diaria || 0).toFixed(2).replace('.', ',')}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-priority-green p-10 text-white relative">
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-priority-gold rounded-2xl flex items-center justify-center text-priority-green shadow-xl">
                    {editingPerson ? <Edit2 size={28} /> : <Plus size={28} />}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    {editingPerson ? 'Atualizar' : 'Novo'} <br/> Colaborador
                  </h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all group"
                >
                  <X size={28} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome Completo</label>
                  <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Carlos Mendes" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-priority-green text-lg focus:border-priority-gold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Função</label>
                    <select value={formData.funcao} onChange={(e) => setFormData({...formData, funcao: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-priority-green outline-none">
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Celular</label>
                    <input type="text" required value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} placeholder="(11) 99999-9999" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-priority-green outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor da Diária (R$)</label>
                  <input type="number" min="0" step="0.01" required value={formData.valor_diaria} onChange={(e) => setFormData({...formData, valor_diaria: parseFloat(e.target.value) || 0})} placeholder="Ex: 150.00" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-priority-green outline-none" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl whitespace-nowrap">Cancelar</button>
                <button type="submit" className="flex-1 py-4 px-6 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-3 whitespace-nowrap">
                  <Check size={20} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pessoas;