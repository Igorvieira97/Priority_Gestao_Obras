import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  MapPin, Plus, ArrowLeft, Building2, Check, Edit2, Trash2, ChevronRight, 
  Calendar, UserCheck, UserX, RotateCcw, DollarSign, History, X, Clock, Wallet,
  Package, UserPlus, Timer, FileText, Search
} from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Obras: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedObraId, setSelectedObraId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'estoque' | 'equipe' | 'diarias'>('equipe');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newObraName, setNewObraName] = useState('');
  const [newObraEndereco, setNewObraEndereco] = useState('');
  const [newObraStatus, setNewObraStatus] = useState('Em Andamento');

  // States de Edição de Obra
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editObraId, setEditObraId] = useState<number | null>(null);
  const [editObraName, setEditObraName] = useState('');
  const [editObraEndereco, setEditObraEndereco] = useState('');
  const [editObraStatus, setEditObraStatus] = useState('Em Andamento');
  
  // States Globais
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // diariasData: registros de diárias da obra/data vindos da API
  const [diariasData, setDiariasData] = useState<any[]>([]);

  // States de Equipe (Pessoas → Alocações)
  const [equipeGlobal, setEquipeGlobal] = useState<any[]>([]);
  const [equipeObra, setEquipeObra] = useState<any[]>([]);
  const [alocModalOpen, setAlocModalOpen] = useState(false);
  const [alocPessoaId, setAlocPessoaId] = useState<number | ''>('');

  // States dos Modais
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [paymentHistoryModalOpen, setPaymentHistoryModalOpen] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState<any[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // States de Estoque da Obra
  const [estoqueObra, setEstoqueObra] = useState<any[]>([]);
  const [estoqueModalOpen, setEstoqueModalOpen] = useState(false);
  const [estoqueEditItem, setEstoqueEditItem] = useState<any | null>(null);
  const [estoqueNovaQtd, setEstoqueNovaQtd] = useState('');
  const [searchEstoque, setSearchEstoque] = useState('');

  // States de Vínculo (Catálogo → Obra)
  const [catalogoGlobal, setCatalogoGlobal] = useState<any[]>([]);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkMaterialId, setLinkMaterialId] = useState<number | ''>('');
  const [linkQuantidade, setLinkQuantidade] = useState('');

  // Buscar estoque da obra selecionada
  const fetchEstoqueObra = useCallback(async () => {
    if (!selectedObraId) return;
    try {
      const res = await axios.get(`${API_URL}/estoque/obra/${selectedObraId}`);
      setEstoqueObra(res.data);
    } catch (err) {
      console.error('Erro ao buscar estoque da obra:', err);
    }
  }, [selectedObraId]);

  // Buscar catálogo global de materiais
  const fetchCatalogo = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/materiais`);
      setCatalogoGlobal(res.data);
    } catch (err) {
      console.error('Erro ao buscar catálogo:', err);
    }
  }, []);

  // Buscar equipe global (RH)
  const fetchEquipeGlobal = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/pessoas`);
      setEquipeGlobal(res.data);
    } catch (err) {
      console.error('Erro ao buscar equipe global:', err);
    }
  }, []);

  // Buscar equipe alocada na obra selecionada
  const fetchEquipeObra = useCallback(async () => {
    if (!selectedObraId) return;
    try {
      const res = await axios.get(`${API_URL}/alocacoes/obra/${selectedObraId}`);
      setEquipeObra(res.data);
    } catch (err) {
      console.error('Erro ao buscar equipe da obra:', err);
    }
  }, [selectedObraId]);

  // Buscar obras da API
  const fetchObras = async () => {
    try {
      const response = await axios.get(`${API_URL}/obras`);
      setProjects(response.data);
    } catch (err) {
      console.error('Erro ao buscar obras:', err);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  // Carregar estoque e catálogo quando aba mudar para 'estoque'
  useEffect(() => {
    if (activeTab === 'estoque' && selectedObraId) {
      fetchEstoqueObra();
      fetchCatalogo();
    }
  }, [activeTab, selectedObraId, fetchEstoqueObra, fetchCatalogo]);

  // Buscar diárias de uma obra em uma data
  const fetchDiarias = useCallback(async () => {
    if (!selectedObraId || !selectedDate) return;
    try {
      const res = await axios.get(`${API_URL}/diarias/obra/${selectedObraId}?data=${selectedDate}`);
      setDiariasData(res.data);
    } catch (err) {
      console.error('Erro ao buscar diárias:', err);
    }
  }, [selectedObraId, selectedDate]);

  // Carregar equipe quando aba mudar para 'equipe' ou 'diarias'
  useEffect(() => {
    if ((activeTab === 'equipe' || activeTab === 'diarias') && selectedObraId) {
      fetchEquipeObra();
      fetchEquipeGlobal();
    }
  }, [activeTab, selectedObraId, fetchEquipeObra, fetchEquipeGlobal]);

  // Carregar diárias quando a aba for 'diarias' ou a data mudar
  useEffect(() => {
    if (activeTab === 'diarias' && selectedObraId) {
      fetchDiarias();
    }
  }, [activeTab, selectedObraId, selectedDate, fetchDiarias]);

  // Handler para abrir modal de atualização de saldo
  const openEstoqueModal = (item: any) => {
    setEstoqueEditItem(item);
    setEstoqueNovaQtd(item.quantidade?.toString() || '0');
    setEstoqueModalOpen(true);
  };

  // Remover material do estoque da obra
  const handleRemoveMaterial = async (itemId: number) => {
    if (!window.confirm('Tem certeza que deseja remover este material desta obra?')) return;
    try {
      await axios.delete(`${API_URL}/estoque/${itemId}`);
      fetchEstoqueObra();
    } catch (err) {
      console.error('Erro ao remover material:', err);
    }
  };

  // Abrir modal de vínculo
  const openLinkModal = () => {
    setLinkMaterialId('');
    setLinkQuantidade('');
    setLinkModalOpen(true);
  };

  // Vincular material do catálogo à obra
  const handleLinkMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkMaterialId || !selectedObraId) return;
    try {
      const qty = Number(linkQuantidade) || 0;
      const status = qty > 100 ? 'OK' : qty > 20 ? 'Baixo' : 'Crítico';
      await axios.post(`${API_URL}/estoque`, {
        obra_id: selectedObraId,
        material_id: linkMaterialId,
        quantidade: qty,
        status
      });
      setLinkModalOpen(false);
      fetchEstoqueObra();
    } catch (err) {
      console.error('Erro ao vincular material:', err);
    }
  };

  // Handler para salvar nova quantidade
  const handleUpdateEstoque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estoqueEditItem || !selectedObraId) return;
    try {
      const qty = Number(estoqueNovaQtd) || 0;
      const status = qty > 100 ? 'OK' : qty > 20 ? 'Baixo' : 'Crítico';
      await axios.post(`${API_URL}/estoque`, {
        obra_id: selectedObraId,
        material_id: estoqueEditItem.material_id,
        quantidade: qty,
        status
      });
      setEstoqueModalOpen(false);
      setEstoqueEditItem(null);
      fetchEstoqueObra();
    } catch (err) {
      console.error('Erro ao atualizar estoque:', err);
    }
  };

  // Criar obra via API
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/obras`, { nome: newObraName, endereco: newObraEndereco, status: newObraStatus });
      setIsAddModalOpen(false);
      setNewObraName('');
      setNewObraEndereco('');
      setNewObraStatus('Em Andamento');
      fetchObras();
    } catch (err) {
      console.error('Erro ao criar obra:', err);
    }
  };

  // Abrir modal de edição
  const handleOpenEditObra = (obra: any) => {
    setEditObraId(obra.id);
    setEditObraName(obra.nome || obra.name);
    setEditObraEndereco(obra.endereco || obra.address);
    setEditObraStatus(obra.status || 'Em Andamento');
    setIsEditModalOpen(true);
  };

  // Salvar edição de obra
  const handleEditObra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editObraId) return;
    try {
      await axios.put(`${API_URL}/obras/${editObraId}`, {
        nome: editObraName,
        endereco: editObraEndereco,
        status: editObraStatus,
        progresso: 0,
      });
      setIsEditModalOpen(false);
      setEditObraId(null);
      fetchObras();
    } catch (err) {
      console.error('Erro ao editar obra:', err);
    }
  };

  // Alocar colaborador à obra
  const handleAlocarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alocPessoaId || !selectedObraId) return;
    try {
      await axios.post(`${API_URL}/alocacoes`, {
        pessoa_id: alocPessoaId,
        obra_id: selectedObraId,
      });
      setAlocModalOpen(false);
      setAlocPessoaId('');
      fetchEquipeObra();
    } catch (err) {
      console.error('Erro ao alocar pessoa:', err);
    }
  };

  // Desalocar colaborador da obra
  const handleDesalocar = async (alocacaoId: number) => {
    try {
      await axios.delete(`${API_URL}/alocacoes/${alocacaoId}`);
      fetchEquipeObra();
    } catch (err) {
      console.error('Erro ao desalocar pessoa:', err);
    }
  };

  const selectedObra = useMemo(() => {
    const obra = projects.find(p => p.id === selectedObraId);
    if (!obra) return null;
    // Mapear campos do banco para os nomes usados no template
    return { ...obra, name: obra.nome, address: obra.endereco, progress: obra.progresso || 0 };
  }, [projects, selectedObraId]);

  // Helper para formatar data visualmente
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- LÓGICA DE CÁLCULO DE DIÁRIAS A RECEBER (API) ---
  const [unpaidCounts, setUnpaidCounts] = useState<Record<number, number>>({});

  const fetchUnpaidCounts = useCallback(async () => {
    if (!selectedObraId || equipeObra.length === 0) return;
    try {
      const results: Record<number, number> = {};
      await Promise.all(
        equipeObra.map(async (person) => {
          const res = await axios.get(`${API_URL}/diarias/pendentes/${selectedObraId}/${person.pessoa_id}`);
          results[person.pessoa_id] = res.data.dias_pendentes;
        })
      );
      setUnpaidCounts(results);
    } catch (err) {
      console.error('Erro ao buscar diárias pendentes:', err);
    }
  }, [selectedObraId, equipeObra]);

  useEffect(() => {
    if (activeTab === 'equipe' && selectedObraId && equipeObra.length > 0) {
      fetchUnpaidCounts();
    }
  }, [activeTab, selectedObraId, equipeObra, fetchUnpaidCounts]);

  const getUnpaidDays = (personId: number) => {
    return unpaidCounts[personId] ?? 0;
  };

  // --- AÇÕES DE PAGAMENTO ---
  const openPaymentModal = (person: any) => {
    setSelectedPerson(person);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedObra || !selectedPerson) return;
    const unpaidDays = getUnpaidDays(selectedPerson.id);
    const valorDiaria = Number(selectedPerson.valor_diaria || 0);
    const valorTotal = unpaidDays * valorDiaria;
    try {
      await axios.post(`${API_URL}/pagamentos`, {
        pessoa_id: selectedPerson.id,
        obra_id: selectedObra.id,
        data_corte: paymentDate,
        valor_pago: valorTotal,
        qtd_diarias: unpaidDays,
      });
      fetchUnpaidCounts();
      setPaymentModalOpen(false);
      setSelectedPerson(null);
    } catch (err) {
      console.error('Erro ao registrar pagamento:', err);
    }
  };

  // --- HISTÓRICO DE PAGAMENTOS ---
  const openPaymentHistoryModal = async (person: any) => {
    setSelectedPerson(person);
    setPaymentHistoryModalOpen(true);
    if (!selectedObra) return;
    try {
      const res = await axios.get(`${API_URL}/pagamentos/${selectedObra.id}/${person.id}`);
      setPaymentHistoryData(res.data);
    } catch (err) {
      console.error('Erro ao buscar histórico de pagamentos:', err);
      setPaymentHistoryData([]);
    }
  };

  // --- AÇÕES DE PRESENÇA (ABA DIÁRIAS) ---
  const setAttendance = async (personId: number, statusValue: string) => {
    if (!selectedObra) return;
    try {
      await axios.post(`${API_URL}/diarias`, {
        pessoa_id: personId,
        obra_id: selectedObra.id,
        data_diaria: selectedDate,
        status: statusValue,
      });
      fetchDiarias();
    } catch (err) {
      console.error('Erro ao lançar diária:', err);
    }
  };

  const getAttendanceStatus = (personId: number): string | null => {
    const record = diariasData.find(d => d.pessoa_id === personId);
    return record ? record.status : null;
  };

  // --- HISTÓRICO ---
  const [historyData, setHistoryData] = useState<any[]>([]);

  const openHistoryModal = async (person: any) => {
    setSelectedPerson(person);
    setHistoryModalOpen(true);
    if (!selectedObra) return;
    try {
      const res = await axios.get(`${API_URL}/diarias/historico/${selectedObra.id}/${person.id}`);
      setHistoryData(res.data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      setHistoryData([]);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/obras/${id}`);
      setDeletingId(null);
      fetchObras();
    } catch (err) {
      console.error('Erro ao deletar obra:', err);
    }
  };

  if (selectedObraId && selectedObra) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-300 max-w-7xl mx-auto pb-12">
        <button onClick={() => setSelectedObraId(null)} className="flex items-center gap-2 text-gray-400 hover:text-priority-green mb-8 transition-colors font-black uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        {/* --- HEADER SIMPLIFICADO --- */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden mb-8">
          <div className="bg-priority-green p-10 text-white relative">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Building2 size={120} /></div>
            <div className="flex flex-col gap-6 relative z-10">
               <div>
                  <span className="px-4 py-1 bg-priority-gold text-priority-green text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">{selectedObra.status}</span>
                  <h1 className="text-5xl font-black tracking-tighter leading-none mb-2">{selectedObra.name}</h1>
                  <p className="text-white/60 flex items-center gap-2 font-bold italic"><MapPin size={16} className="text-priority-gold" /> {selectedObra.address}</p>
               </div>
            </div>
          </div>

          <div className="flex border-b border-gray-100 bg-gray-50/30">
            {['equipe', 'diarias', 'estoque'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-10 py-6 text-xs font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab ? 'border-priority-gold text-priority-green bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {tab === 'diarias' ? 'Lançar Diária' : tab === 'equipe' ? 'Equipe Alocada' : tab}
              </button>
            ))}
          </div>

          <div className="p-10">
            
            {/* --- ABA EQUIPE (PAGAMENTOS) --- */}
            {activeTab === 'equipe' && (
              <div className="animate-in fade-in">
                {/* Cabeçalho com botão de alocar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 text-blue-800 flex-1">
                    <Wallet size={20} />
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest">Controle de Pagamentos</p>
                       <p className="text-sm">Clique em "Zerar Diárias" para confirmar o pagamento. Isso resetará o contador.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setAlocPessoaId(''); setAlocModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-priority-green text-priority-gold rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-priority-greenLight hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    <UserPlus size={16} /> Alocar Colaborador
                  </button>
                </div>

                {equipeObra.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                    <UserPlus size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 uppercase text-xs font-black">Nenhum colaborador alocado nesta obra.</p>
                    <p className="text-gray-300 text-xs mt-2">Clique em "Alocar Colaborador" acima para começar.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {equipeObra.map(person => {
                      const unpaidDays = getUnpaidDays(person.pessoa_id);
                      
                      return (
                        <div key={person.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-priority-gold transition-all group">
                          <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                            <div className="w-14 h-14 rounded-2xl bg-priority-green text-priority-gold flex items-center justify-center font-black text-xl shadow-lg">{person.nome.charAt(0)}</div>
                            <div>
                              <p className="font-black text-priority-green text-lg leading-tight">{person.nome}</p>
                              <p className="text-[10px] font-black text-priority-gold uppercase">{person.funcao}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">A Receber</p>
                              <div className="flex items-center gap-1 justify-end">
                                 <Clock size={16} className={unpaidDays > 0 ? "text-priority-gold" : "text-gray-300"} />
                                 <span className={`text-2xl font-black ${unpaidDays > 0 ? "text-priority-green" : "text-gray-300"}`}>{unpaidDays}</span>
                                 <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Diárias</span>
                              </div>
                              {Number(person.valor_diaria) > 0 && unpaidDays > 0 && (
                                <p className="text-[10px] font-bold text-priority-gold mt-1">R$ {(unpaidDays * Number(person.valor_diaria || 0)).toFixed(2).replace('.', ',')}</p>
                              )}
                            </div>

                            <button 
                              onClick={() => openPaymentModal({...person, id: person.pessoa_id})}
                              disabled={unpaidDays === 0}
                              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                                unpaidDays > 0 
                                 ? 'bg-priority-gold text-white hover:bg-priority-goldHover hover:scale-105' 
                                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <DollarSign size={16} /> Zerar Diárias
                            </button>

                            <button 
                              onClick={() => openPaymentHistoryModal({...person, id: person.pessoa_id})}
                              className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 hover:bg-blue-100 hover:scale-110 active:scale-95 transition-all"
                              title="Histórico de Pagamentos"
                            >
                              <FileText size={18} />
                            </button>

                            <button 
                              onClick={() => handleDesalocar(person.id)}
                              className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                              title="Remover da obra"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* --- ABA DIÁRIAS (PRESENÇA) --- */}
            {activeTab === 'diarias' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Seletor de Data */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-[2rem] border border-gray-100 gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-priority-green text-priority-gold rounded-xl flex items-center justify-center shadow-lg shrink-0">
                       <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Selecionar Data do Lançamento</p>
                      <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-xl font-black text-priority-green outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {equipeObra.map(person => {
                    const currentStatus = getAttendanceStatus(person.pessoa_id);
                    const avatarBg = currentStatus === 'Presença' ? 'bg-green-600 text-white' : currentStatus === 'Meia' ? 'bg-yellow-500 text-white' : currentStatus === 'Falta' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400';
                    return (
                      <div key={person.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-[1.5rem] border bg-white border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-colors ${avatarBg}`}>
                            {person.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-priority-green text-lg leading-tight">{person.nome}</p>
                            <p className="text-[10px] font-black text-priority-gold uppercase">{person.funcao}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto justify-center">
                          <button 
                            onClick={() => setAttendance(person.pessoa_id, 'Presença')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                              currentStatus === 'Presença'
                                ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-green-200 hover:text-green-600'
                            }`}
                          >
                            <UserCheck size={16} /> Presença
                          </button>

                          <button 
                            onClick={() => setAttendance(person.pessoa_id, 'Meia')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                              currentStatus === 'Meia'
                                ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-200'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-yellow-200 hover:text-yellow-600'
                            }`}
                          >
                            <Timer size={16} /> Meia
                          </button>

                          <button 
                            onClick={() => setAttendance(person.pessoa_id, 'Falta')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                              currentStatus === 'Falta'
                                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-500'
                            }`}
                          >
                            <UserX size={16} /> Falta
                          </button>

                          <button 
                            onClick={() => openHistoryModal({...person, id: person.pessoa_id})}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all border border-blue-100"
                            title="Ver Histórico Completo"
                          >
                            <History size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'estoque' && (
              <div className="animate-in fade-in">
                {/* Cabeçalho com botão de vincular */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-priority-gold" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{estoqueObra.length} {estoqueObra.length === 1 ? 'material' : 'materiais'} nesta obra</span>
                  </div>
                  <button
                    onClick={openLinkModal}
                    className="flex items-center gap-2 px-6 py-3 bg-priority-green text-priority-gold rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-priority-greenLight hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={16} /> Vincular Material do Catálogo
                  </button>
                </div>

                {/* Campo de pesquisa */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Pesquisar material..."
                    value={searchEstoque}
                    onChange={(e) => setSearchEstoque(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 border-2 border-gray-100 rounded-2xl focus:border-priority-gold focus:outline-none font-bold text-sm text-priority-green bg-gray-50/50"
                  />
                </div>

                {estoqueObra.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 uppercase text-xs font-black">Nenhum material vinculado a esta obra.</p>
                    <p className="text-gray-300 text-xs mt-2">Clique em "Vincular Material do Catálogo" acima para começar.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="p-6">Material</th>
                          <th className="p-6">Categoria</th>
                          <th className="p-6 text-center">Saldo</th>
                          <th className="p-6 text-center">Status</th>
                          <th className="p-6 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(estoqueObra?.filter((item) => {
                          const nome = item?.material_nome || item?.material?.nome || item?.nome || '';
                          const categoria = item?.categoria || item?.material?.categoria || '';
                          const termoBusca = searchEstoque?.toLowerCase() || '';
                          return nome.toLowerCase().includes(termoBusca) || categoria.toLowerCase().includes(termoBusca);
                        }) || []).map((item) => {
                          const qty = Number(item.quantidade);
                          const statusColor = qty > 100 ? 'border-green-100 bg-green-50 text-green-700' : qty > 20 ? 'border-yellow-100 bg-yellow-50 text-yellow-700' : 'border-red-100 bg-red-50 text-red-700';
                          const statusLabel = qty > 100 ? 'OK' : qty > 20 ? 'Baixo' : 'Crítico';

                          return (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 bg-priority-green rounded-xl flex items-center justify-center text-priority-gold shadow-md group-hover:rotate-6 transition-transform">
                                    <Package size={22} />
                                  </div>
                                  <p className="font-black text-lg text-priority-green leading-none">{item.material_nome}</p>
                                </div>
                              </td>
                              <td className="p-6">
                                <span className="text-[10px] font-black text-priority-gold uppercase">{item.categoria}</span>
                              </td>
                              <td className="p-6 text-center">
                                <div className="inline-flex flex-col items-center">
                                  <span className="text-2xl font-black text-priority-green">{qty}</span>
                                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{item.unidade_medida}</span>
                                </div>
                              </td>
                              <td className="p-6 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${statusColor}`}>{statusLabel}</span>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEstoqueModal(item)}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-priority-gold text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-priority-goldHover hover:scale-105 active:scale-95 transition-all"
                                  >
                                    <Edit2 size={14} /> Atualizar Saldo
                                  </button>
                                  <button
                                    onClick={() => handleRemoveMaterial(item.id)}
                                    className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 active:scale-95 transition-all"
                                    title="Remover material desta obra"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- MODAL DE PAGAMENTO --- */}
        {paymentModalOpen && selectedPerson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="bg-priority-gold p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <DollarSign size={28} />
                   <h2 className="text-xl font-black uppercase tracking-tighter">Confirmar Pagamento</h2>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-4 text-sm font-medium">
                  Você está prestes a zerar as <strong>{getUnpaidDays(selectedPerson.id)} diárias</strong> acumuladas de <span className="text-priority-green font-bold">{selectedPerson.nome || selectedPerson.name}</span>.
                </p>

                {Number(selectedPerson.valor_diaria) > 0 && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Total a Pagar</p>
                    <p className="text-3xl font-black text-priority-green">R$ {(getUnpaidDays(selectedPerson.id) * Number(selectedPerson.valor_diaria || 0)).toFixed(2).replace('.', ',')}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{getUnpaidDays(selectedPerson.id)} diárias × R$ {Number(selectedPerson.valor_diaria || 0).toFixed(2).replace('.', ',')} cada</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data de Corte (Pagamento)</label>
                  <input 
                    type="date" 
                    value={paymentDate} 
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic">Todas as presenças até esta data serão consideradas pagas.</p>
                </div>

                <div className="flex gap-3">
                   <button onClick={() => setPaymentModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                   <button onClick={confirmPayment} className="flex-1 py-4 bg-priority-green text-white font-black uppercase text-xs rounded-2xl shadow-xl">Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE HISTÓRICO --- */}
        {historyModalOpen && selectedPerson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 h-[600px] flex flex-col">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                   <History size={24} />
                   <div>
                     <h2 className="text-lg font-black uppercase tracking-tighter">Histórico</h2>
                     <p className="text-xs opacity-80">{selectedPerson.nome || selectedPerson.name}</p>
                   </div>
                </div>
                <button onClick={() => setHistoryModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                {historyData.length === 0 ? (
                   <p className="text-center text-gray-400 text-sm py-10">Nenhum registro encontrado para esta obra.</p>
                ) : (
                  <div className="space-y-3">
                    {historyData.map((record, idx) => {
                      const statusStyle = record.status === 'Presença'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : record.status === 'Meia'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'bg-red-100 text-red-700 border-red-200';
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="font-bold text-gray-700">{new Date(record.data_diaria).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-md border ${statusStyle}`}>{record.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE HISTÓRICO DE PAGAMENTOS --- */}
        {paymentHistoryModalOpen && selectedPerson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 h-[600px] flex flex-col">
              <div className="bg-priority-gold p-8 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                   <FileText size={24} />
                   <div>
                     <h2 className="text-lg font-black uppercase tracking-tighter">Pagamentos</h2>
                     <p className="text-xs opacity-80">{selectedPerson.nome || selectedPerson.name}</p>
                   </div>
                </div>
                <button onClick={() => setPaymentHistoryModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                {paymentHistoryData.length === 0 ? (
                   <p className="text-center text-gray-400 text-sm py-10">Nenhum pagamento registrado para esta obra.</p>
                ) : (
                  <div className="space-y-4">
                    {paymentHistoryData.map((pag, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="font-bold text-gray-700 text-sm">{new Date(pag.data_pagamento || pag.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <span className="text-lg font-black text-priority-green">R$ {Number(pag.valor_pago || 0).toFixed(2).replace('.', ',')}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">
                          Pago <strong className="text-priority-green">R$ {Number(pag.valor_pago || 0).toFixed(2).replace('.', ',')}</strong> no dia <strong>{new Date(pag.data_pagamento || pag.created_at).toLocaleDateString('pt-BR')}</strong> referente a <strong className="text-priority-gold">{pag.qtd_diarias || '—'} diárias</strong>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Corte até: {new Date(pag.data_corte).toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE VINCULAR MATERIAL DO CATÁLOGO --- */}
        {linkModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="bg-priority-green p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package size={28} />
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter">Adicionar Material</h2>
                    <p className="text-xs opacity-80">Vincular do catálogo global</p>
                  </div>
                </div>
                <button onClick={() => setLinkModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleLinkMaterial} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Material do Catálogo</label>
                  <select
                    required
                    value={linkMaterialId}
                    onChange={(e) => setLinkMaterialId(Number(e.target.value))}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none appearance-none"
                  >
                    <option value="">Selecione um material...</option>
                    {catalogoGlobal
                      .filter(m => !estoqueObra.some(e => e.material_id === m.id))
                      .map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nome} — {m.categoria} ({m.unidade_medida})
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantidade Inicial</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={linkQuantidade}
                    onChange={(e) => setLinkQuantidade(e.target.value)}
                    placeholder="Ex: 500"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setLinkModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"><Check size={20} /> Vincular</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL DE ALOCAR COLABORADOR --- */}
        {alocModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="bg-priority-green p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <UserPlus size={28} />
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter">Alocar Colaborador</h2>
                    <p className="text-xs opacity-80">Vincular do diretório global (RH)</p>
                  </div>
                </div>
                <button onClick={() => setAlocModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleAlocarPessoa} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Colaborador</label>
                  <select
                    required
                    value={alocPessoaId}
                    onChange={(e) => setAlocPessoaId(Number(e.target.value))}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none appearance-none"
                  >
                    <option value="">Selecione um colaborador...</option>
                    {equipeGlobal
                      .filter(p => !equipeObra.some(e => e.pessoa_id === p.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {p.funcao}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setAlocModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"><Check size={20} /> Alocar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL DE ATUALIZAÇÃO DE SALDO --- */}
        {estoqueModalOpen && estoqueEditItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="bg-priority-gold p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package size={28} />
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter">Atualizar Saldo</h2>
                    <p className="text-xs opacity-80">{estoqueEditItem.material_nome}</p>
                  </div>
                </div>
                <button onClick={() => setEstoqueModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdateEstoque} className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-priority-green rounded-xl flex items-center justify-center text-priority-gold">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-black text-priority-green text-sm">{estoqueEditItem.material_nome}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{estoqueEditItem.categoria} • {estoqueEditItem.unidade_medida}</p>
                    </div>
                  </div>

                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nova Quantidade</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={estoqueNovaQtd}
                    onChange={(e) => setEstoqueNovaQtd(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none text-2xl text-center"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic text-center">Saldo atual: {estoqueEditItem.quantidade} {estoqueEditItem.unidade_medida}</p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setEstoqueModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-priority-green text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"><Check size={20} /> Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- LISTAGEM DE OBRAS (HOME) ---
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-priority-green tracking-tighter uppercase italic">Canteiros de Obra</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-priority-gold hover:bg-priority-goldHover text-white px-8 py-4 rounded-[1.2rem] flex items-center gap-3 text-sm font-black shadow-xl transition-all whitespace-nowrap">
          <Plus size={20} /> Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => {
          const nome = project.nome || project.name;
          const endereco = project.endereco || project.address;
          const status = project.status || 'Em Andamento';
          const statusStyles: Record<string, string> = {
            'Em Andamento': 'bg-green-100 text-green-800',
            'Concluída': 'bg-blue-100 text-blue-800',
            'Pausada': 'bg-yellow-100 text-yellow-800',
          };
          return (
          <div key={project.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div onClick={() => setSelectedObraId(project.id)} className="p-10 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-priority-green text-priority-gold flex items-center justify-center font-black text-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform">{nome.charAt(0)}</div>
              <h3 className="font-black text-2xl text-priority-green mb-1 leading-tight group-hover:text-priority-gold transition-colors">{nome}</h3>
              <p className="text-gray-400 text-xs font-bold italic mb-6 flex items-center gap-2 truncate"><MapPin size={14} className="text-priority-gold shrink-0" /> {endereco}</p>
              
              <div className="mb-6">
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                 <button className="flex items-center gap-1 text-priority-green font-black text-[10px] uppercase tracking-widest">Gerenciar Projeto <ChevronRight size={14} /></button>
                 <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditObra(project); }} className="w-11 h-11 bg-priority-gold text-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-all"><Edit2 size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeletingId(project.id); }} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-all"><Trash2 size={18} /></button>
                 </div>
              </div>
              {deletingId === project.id && (
                <div className="absolute inset-0 bg-red-600/95 backdrop-blur-sm p-10 flex flex-col items-center justify-center text-center animate-in fade-in">
                  <p className="text-white font-black uppercase text-sm mb-6">Remover este projeto permanentemente?</p>
                  <div className="flex gap-4">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="bg-white text-red-600 px-8 py-3 rounded-xl font-black uppercase text-xs shadow-xl">Confirmar</button>
                    <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="bg-red-800 text-white px-8 py-3 rounded-xl font-black uppercase text-xs">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* --- MODAL DE CRIAÇÃO DE OBRA --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-priority-green/90 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-priority-green p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-priority-gold rounded-2xl flex items-center justify-center text-priority-green"><Building2 size={32} /></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Nova Obra</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="p-10 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome da Obra</label>
                <input 
                  type="text" 
                  required 
                  value={newObraName} 
                  onChange={(e) => setNewObraName(e.target.value)} 
                  placeholder="Ex: Residencial Altos do Parque" 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Endereço</label>
                <input 
                  type="text" 
                  required 
                  value={newObraEndereco} 
                  onChange={(e) => setNewObraEndereco(e.target.value)} 
                  placeholder="Ex: Av. das Nações, 1500" 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={newObraStatus} 
                  onChange={(e) => setNewObraStatus(e.target.value)} 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-priority-green focus:border-priority-gold outline-none"
                >
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Pausada">Pausada</option>
                </select>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl whitespace-nowrap">Cancelar</button>
                <button type="submit" className="flex-1 py-4 px-6 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"><Check size={20}/> Criar Obra</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Obra */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-priority-green p-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Editar Obra</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} className="text-white" /></button>
            </div>
            <form onSubmit={handleEditObra} className="p-10 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome da Obra</label>
                <input
                  type="text"
                  required
                  value={editObraName}
                  onChange={(e) => setEditObraName(e.target.value)}
                  placeholder="Ex: Residencial Altos do Parque"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Endereço</label>
                <input
                  type="text"
                  required
                  value={editObraEndereco}
                  onChange={(e) => setEditObraEndereco(e.target.value)}
                  placeholder="Ex: Av. das Nações, 1500"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-priority-green focus:border-priority-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select
                  value={editObraStatus}
                  onChange={(e) => setEditObraStatus(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-priority-green focus:border-priority-gold outline-none"
                >
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Pausada">Pausada</option>
                </select>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl whitespace-nowrap">Cancelar</button>
                <button type="submit" className="flex-1 py-4 px-6 bg-priority-gold text-white font-black uppercase text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"><Check size={20}/> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obras;