import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Package, Plus, X, Check, Edit2, Trash2, ShoppingCart } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface Material {
  id: number;
  nome: string;
  categoria: string;
  unidade_medida: string;
}

const categories = ['Estrutura', 'Alvenaria', 'Elétrico', 'Hidráulico', 'Cobertura', 'Acabamento', 'Outros'];

const Materiais: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: categories[0],
    unidade_medida: 'Unid',
  });

  // Buscar catálogo de materiais
  const fetchMateriais = async () => {
    try {
      const res = await axios.get(`${API_URL}/materiais`);
      setMaterials(res.data);
    } catch (err) {
      console.error('Erro ao carregar materiais:', err);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData({ nome: '', categoria: categories[0], unidade_medida: 'Unid' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      nome: material.nome,
      categoria: material.categoria,
      unidade_medida: material.unidade_medida,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        const res = await axios.put(`${API_URL}/materiais/${editingMaterial.id}`, formData);
        setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? { ...m, ...res.data } : m));
      } else {
        const res = await axios.post(`${API_URL}/materiais`, formData);
        setMaterials(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar material:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const itemRemovido = materials.find(m => m.id === id);
    setMaterials(prev => prev.filter(m => m.id !== id));
    setDeletingId(null);
    try {
      await axios.delete(`${API_URL}/materiais/${id}`);
    } catch (err) {
      console.error('Erro ao deletar material:', err);
      if (itemRemovido) setMaterials(prev => [...prev, itemRemovido]);
      alert('Erro ao excluir material. A operação foi revertida.');
    }
  };

  const filtered = materials.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-priority-green tracking-tighter uppercase italic">Catálogo Global</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Dicionário de Materiais e Suprimentos</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-priority-green hover:bg-priority-greenLight text-priority-gold px-10 py-5 rounded-2xl flex items-center gap-3 text-sm font-black shadow-2xl transition-all active:scale-95">
          <Plus size={24} /> Adicionar Novo Item
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input type="text" placeholder="Pesquisar material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:border-priority-gold focus:outline-none font-bold text-priority-green" />
           </div>
           <div className="flex items-center gap-2 px-6 py-2 bg-priority-gold/10 rounded-full border border-priority-gold/20">
              <ShoppingCart size={16} className="text-priority-gold" />
              <span className="text-[10px] font-black text-priority-gold uppercase">{materials.length} Itens Catalogados</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
              <tr>
                <th className="py-3 px-5">Material / Categoria</th>
                <th className="py-3 px-5 text-center">Unidade</th>
                <th className="py-3 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-2.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-priority-green rounded-xl flex items-center justify-center text-priority-gold shadow-lg group-hover:rotate-6 transition-transform flex-shrink-0">
                        <Package size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-priority-green leading-none">{item.nome}</p>
                        <p className="text-[10px] font-bold text-priority-gold uppercase mt-0.5">{item.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-5 text-center">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black text-priority-green uppercase">{item.unidade_medida}</span>
                  </td>
                  <td className="py-2.5 px-5 text-right">
                    {deletingId === item.id ? (
                      <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-2">
                        <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-4 py-1.5 rounded-lg font-black uppercase text-xs">Excluir</button>
                        <button onClick={() => setDeletingId(null)} className="p-1.5 text-gray-400"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="w-8 h-8 bg-priority-gold text-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeletingId(item.id)} className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL (NOVO / EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-priority-green p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-priority-gold rounded-2xl flex items-center justify-center text-priority-green"><Package size={32} /></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">{editingMaterial ? 'Editar' : 'Novo'} Item</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Material</label>
                <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Cimento CP II" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unidade</label>
                  <select value={formData.unidade_medida} onChange={(e) => setFormData({...formData, unidade_medida: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green outline-none">
                    <option value="Unid">Unid</option>
                    <option value="Sacos">Sacos</option>
                    <option value="m²">m²</option>
                    <option value="Rolos">Rolos</option>
                    <option value="Lts">Lts</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"><Check size={20}/> Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materiais;