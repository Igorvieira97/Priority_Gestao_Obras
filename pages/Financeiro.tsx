import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, Plus, X, 
  Check, Trash2,
  Receipt, Search, TrendingDown, Calendar, Paperclip, Upload, Edit2
} from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data_despesa: string;
  categoria: string;
  observacao?: string;
  comprovante?: string;
  pago?: boolean;
}

const categorias = ['Materiais', 'Mão de Obra', 'Equipamentos', 'Logística', 'Administrativo', 'Outros'];

const Financeiro: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ 
    descricao: '', 
    valor: '', 
    categoria: categorias[0], 
    data: new Date().toISOString().split('T')[0],
    observacao: '',
    comprovante: '',
  });

  const [fileName, setFileName] = useState('');

  const fetchDespesas = async () => {
    try {
      const res = await axios.get(`${API_URL}/despesas`);
      setDespesas(res.data);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  // Comprimir imagem via Canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Converter arquivo para Base64 (com compressão para imagens)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, comprovante: compressed }));
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, comprovante: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(formData.valor.replace(',', '.'));
    const payload = {
      descricao: formData.descricao,
      valor: val,
      categoria: formData.categoria,
      data_despesa: formData.data,
      observacao: formData.observacao || null,
      comprovante: formData.comprovante || null,
    };
    try {
      if (editId) {
        await axios.put(`${API_URL}/despesas/${editId}`, payload);
      } else {
        await axios.post(`${API_URL}/despesas`, payload);
      }
      setIsModalOpen(false);
      setEditId(null);
      setFormData({ descricao: '', valor: '', categoria: categorias[0], data: new Date().toISOString().split('T')[0], observacao: '', comprovante: '' });
      setFileName('');
      fetchDespesas();
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
    }
  };

  const handleEdit = (despesa: Despesa) => {
    setEditId(despesa.id);
    setFormData({
      descricao: despesa.descricao,
      valor: String(Number(despesa.valor)).replace('.', ','),
      categoria: despesa.categoria,
      data: despesa.data_despesa?.split('T')[0] || '',
      observacao: despesa.observacao || '',
      comprovante: despesa.comprovante || '',
    });
    setFileName(despesa.comprovante ? 'Comprovante existente' : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/despesas/${id}`);
      setDeletingId(null);
      fetchDespesas();
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
    }
  };

  const handleTogglePago = async (despesa: Despesa) => {
    try {
      await axios.patch(`${API_URL}/despesas/${despesa.id}/pagamento`, { pago: !despesa.pago });
      fetchDespesas();
    } catch (err) {
      console.error('Erro ao alterar status de pagamento:', err);
    }
  };

  // Abrir comprovante Base64 em nova aba
  const openComprovante = (base64: string) => {
    const win = window.open();
    if (!win) return;
    if (base64.startsWith('data:image')) {
      win.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6"><img src="${base64}" style="max-width:100%;max-height:100vh;object-fit:contain" /></body></html>`);
    } else if (base64.startsWith('data:application/pdf')) {
      win.document.write(`<html><body style="margin:0"><iframe src="${base64}" style="width:100%;height:100vh;border:none"></iframe></body></html>`);
    } else {
      win.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6"><p>Formato não suportado para visualização.</p></body></html>`);
    }
    win.document.close();
  };

  const totalGeral = despesas.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  const filtered = despesas.filter(d => 
    d.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-priority-green tracking-tighter uppercase italic">Fluxo Financeiro</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Controle de Custos e Despesas Operacionais</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Acumulado</p>
              <p className="text-3xl font-black text-priority-green">
                R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="bg-priority-gold hover:bg-priority-goldHover text-white px-8 py-4 rounded-[1.2rem] flex items-center gap-3 text-sm font-black shadow-xl transition-all active:scale-95">
             <Plus size={20} /> Lançar Despesa
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-gray-50/30 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Filtrar por descrição ou categoria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-priority-green focus:border-priority-gold focus:outline-none transition-all" />
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100">
              <TrendingDown size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{filtered.length} Lançamentos</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
              <tr>
                <th className="p-8">Descrição</th>
                <th className="p-8">Data / Categoria</th>
                <th className="p-8 text-right">Valor</th>
                <th className="p-8 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((despesa) => (
                <tr key={despesa.id} className={`transition-colors group ${despesa.pago ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-priority-green group-hover:text-priority-gold transition-colors">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <p className="font-black text-priority-green text-lg leading-none">{despesa.descricao}</p>
                        {despesa.observacao && (
                          <p className="text-[10px] font-bold text-gray-400 mt-1 italic truncate max-w-xs">{despesa.observacao}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Calendar size={14} className="text-priority-gold" /> {new Date(despesa.data_despesa).toLocaleDateString('pt-BR')}
                      </div>
                      <span className="inline-block px-3 py-1 bg-gray-100 text-[9px] font-black uppercase text-gray-400 rounded-md w-fit">{despesa.categoria}</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <span className="text-xl font-black text-priority-green">R$ {Number(despesa.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {despesa.comprovante && (
                        <button
                          onClick={() => openComprovante(despesa.comprovante!)}
                          className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 hover:bg-blue-100 hover:scale-110 active:scale-95 transition-all"
                          title="Ver Comprovante"
                        >
                          <Paperclip size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleTogglePago(despesa)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center border hover:scale-110 active:scale-95 transition-all ${
                          despesa.pago
                            ? 'bg-green-500 text-white border-green-600 shadow-md'
                            : 'bg-gray-200 text-gray-500 border-gray-300 hover:bg-green-100 hover:text-green-600 hover:border-green-200'
                        }`}
                        title={despesa.pago ? 'Marcar como não paga' : 'Marcar como paga'}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(despesa)}
                        className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all"
                        title="Editar Despesa"
                      >
                        <Edit2 size={18} />
                      </button>
                      {deletingId === despesa.id ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                          <button onClick={() => handleDelete(despesa.id)} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px]">Apagar</button>
                          <button onClick={() => setDeletingId(null)} className="p-2 text-gray-400"><X size={20}/></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(despesa.id)} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-priority-green p-10 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-priority-gold rounded-xl flex items-center justify-center text-priority-green shadow-xl"><DollarSign size={24}/></div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">{editId ? 'Editar Despesa' : 'Lançamento de Despesa'}</h2>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditId(null); setFormData({ descricao: '', valor: '', categoria: categorias[0], data: new Date().toISOString().split('T')[0], observacao: '', comprovante: '' }); setFileName(''); }} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-4">
              <input type="text" required value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} placeholder="Descrição da Despesa" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required value={formData.valor} onChange={(e) => setFormData({...formData, valor: e.target.value})} placeholder="Valor (ex: 4500,80)" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-priority-green outline-none" />
                <input type="date" required value={formData.data} onChange={(e) => setFormData({...formData, data: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green outline-none" />
              </div>
              <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-priority-green outline-none">
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                value={formData.observacao} 
                onChange={(e) => setFormData({...formData, observacao: e.target.value})} 
                placeholder="Observações (opcional)" 
                rows={3}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none resize-none"
              />
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Anexar Comprovante (opcional)</label>
                <label className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-priority-gold transition-all">
                  <Upload size={20} className="text-gray-400" />
                  <span className="font-bold text-sm text-gray-400">{fileName || 'Selecionar imagem ou PDF...'}</span>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditId(null); setFormData({ descricao: '', valor: '', categoria: categorias[0], data: new Date().toISOString().split('T')[0], observacao: '', comprovante: '' }); setFileName(''); }} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-2 py-4 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"><Check size={20}/> {editId ? 'Salvar Alterações' : 'Confirmar Lançamento'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;