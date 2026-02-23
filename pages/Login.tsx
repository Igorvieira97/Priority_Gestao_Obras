import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempUserData, setTempUserData] = useState<any>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, { email, senha: password });
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
      }
      if (res.data.primeiro_acesso) {
        setTempUserData(res.data);
        setRequirePasswordChange(true);
      } else {
        localStorage.setItem('usuarioLogado', JSON.stringify(res.data));
        navigate('/');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Usuário inativo. Contate o administrador.');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/primeiro-acesso`, {
        id: tempUserData.id,
        novaSenha: newPassword,
      });
      const updatedUser = { ...tempUserData, primeiro_acesso: false };
      localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
      navigate('/');
    } catch (err: any) {
      setError('Erro ao alterar senha. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-priority-green flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header / Brand Area */}
        <div className="bg-priority-greenLight p-8 text-center border-b border-priority-green/30">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-priority-green rounded-xl flex items-center justify-center border-2 border-priority-gold shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-priority-gold">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M12 6V18" stroke="currentColor" strokeWidth="2" />
                <path d="M12 12H18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Priority</h1>
          <p className="text-priority-gold text-xs tracking-[0.3em] uppercase mt-1">Engenharia</p>
        </div>

        {/* Form Area */}
        <div className="p-8 pt-10">

          {/* ===== TELA DE TROCA DE SENHA (primeiro acesso) ===== */}
          {requirePasswordChange ? (
            <>
              <div className="mb-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-priority-gold/10 rounded-full flex items-center justify-center">
                    <ShieldCheck size={28} className="text-priority-gold" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Bem-vindo, {tempUserData?.nome?.split(' ')[0]}!</h2>
                <p className="text-sm text-gray-500 mt-1">Crie sua nova senha de acesso para continuar.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      name="new-password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-priority-gold/50 focus:border-priority-gold transition-colors text-gray-900 font-semibold"
                      style={{ color: '#0B2822' }}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      name="confirm-password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-priority-gold/50 focus:border-priority-gold transition-colors text-gray-900 font-semibold"
                      style={{ color: '#0B2822' }}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-priority-gold hover:bg-priority-goldHover text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShieldCheck size={18} />
                  <span>Salvar e Entrar</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </>
          ) : (
            /* ===== TELA DE LOGIN PADRÃO ===== */
            <>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-500 mt-1">Acesse sua conta para gerenciar as obras.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: admin@empresa.com.br"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-priority-gold/50 focus:border-priority-gold transition-colors text-gray-900 font-semibold"
                  style={{ color: '#0B2822' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-priority-gold/50 focus:border-priority-gold transition-colors text-gray-900 font-semibold"
                  style={{ color: '#0B2822' }}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="w-4 h-4 rounded border-gray-300 text-priority-gold focus:ring-priority-gold/50 accent-[#C5A059] cursor-pointer"
              />
              <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Lembrar meus dados</span>
            </label>

            <button 
              type="submit"
              className="w-full bg-priority-gold hover:bg-priority-goldHover text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
            </>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400">
              © 2026 Priority Engenharia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;