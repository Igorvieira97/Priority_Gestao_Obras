import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, X, Check, Search, UserCog, Edit2 } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface Usuario {
  id: number;
  nome: string;
  email: string;
  status: string;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: '', email: '' });

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({ nome: user.nome, email: user.email });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/usuarios/${editingUser.id}`, {
          nome: formData.nome,
          email: formData.email,
          status: editingUser.status,
        });
      } else {
        await axios.post(`${API_URL}/usuarios`, {
          nome: formData.nome,
          email: formData.email,
        });
        alert('Usuário criado com sucesso! A senha padrão é 123456');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ nome: '', email: '' });
      fetchUsuarios();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert('E-mail já cadastrado.');
      } else {
        console.error('Erro ao salvar usuário:', err);
        alert('Erro ao salvar usuário.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`);
      setDeletingId(null);
      fetchUsuarios();
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
    }
  };

  const filtered = usuarios.filter(u =>
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-priority-green uppercase italic tracking-tighter">Gestão de Acessos</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Administradores do Sistema</p>
        </div>
        <button onClick={() => { setEditingUser(null); setFormData({ nome: '', email: '' }); setIsModalOpen(true); }} className="bg-priority-gold hover:bg-priority-goldHover text-white px-8 py-4 rounded-[1.2rem] flex items-center gap-3 text-sm font-black shadow-xl transition-all active:scale-95">
          <UserPlus size={24} /> Criar Admin
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-priority-gold rounded-xl flex items-center justify-center text-white"><UserCog size={24} /></div>
             <h3 className="font-black text-priority-green uppercase text-xs tracking-widest">Administradores</h3>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Filtrar por nome ou e-mail..." className="w-full md:w-80 pl-10 pr-6 py-3 border-2 border-gray-100 rounded-xl font-bold text-priority-green focus:border-priority-gold outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
              <tr>
                <th className="p-8">Nome / E-mail</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-priority-green group-hover:text-priority-gold transition-colors font-black text-lg">
                        {user.nome?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <span className="font-black text-xl text-priority-green">{user.nome}</span>
                        <p className="text-sm text-gray-400 font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase ${
                      user.status === 'Ativo'
                        ? 'text-green-600 bg-green-50 border-green-100'
                        : 'text-red-600 bg-red-50 border-red-100'
                    }`}>
                      {user.status || 'Ativo'}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(user)} className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all" title="Editar"><Edit2 size={18}/></button>
                      {deletingId === user.id ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                          <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px]">Apagar</button>
                          <button onClick={() => setDeletingId(null)} className="p-2 text-gray-400"><X size={20}/></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(user.id)} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all" title="Excluir"><Trash2 size={18}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-400 font-bold">Nenhum administrador encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-priority-green p-10 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-priority-gold rounded-xl flex items-center justify-center text-priority-green shadow-xl"><UserCog size={24}/></div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{editingUser ? 'Editar Acesso' : 'Novo Admin'}</h2>
                  {!editingUser && <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Senha padrão: 123456</p>}
                </div>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingUser(null); }} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-10 space-y-4">
              <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Nome Completo" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-priority-green focus:border-priority-gold outline-none transition-all" />
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="E-mail" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none transition-all" />
              {!editingUser && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-amber-500 text-lg">🔑</span>
                  <p className="text-xs font-bold text-amber-700">O usuário será criado com a senha padrão <span className="font-black">123456</span>. Ele deverá alterá-la no primeiro acesso.</p>
                </div>
              )}
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingUser(null); }} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl whitespace-nowrap">Cancelar</button>
                <button type="submit" className="flex-1 py-4 px-6 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-3 whitespace-nowrap"><Check size={20}/> {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;