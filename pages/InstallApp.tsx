import React from 'react';
import { Share, PlusSquare, MoreVertical, Smartphone, Download, CheckCircle2 } from 'lucide-react';

const InstallApp: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-priority-green mb-2">
          Instalar Aplicativo
        </h1>
        <p className="text-gray-600">
          Tenha o acesso rápido ao sistema Priority Engenharia diretamente da tela inicial do seu celular.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* IOS Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 384 512" fill="currentColor" className="w-6 h-6">
                 <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">iPhone / iPad</h2>
              <span className="text-sm text-gray-500 font-medium">iOS</span>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-green/10 flex items-center justify-center text-priority-green font-bold">
                1
              </div>
              <div>
                <p className="text-gray-700 font-medium">Abra no Safari</p>
                <p className="text-sm text-gray-500 mt-1">Acesse este sistema usando o navegador Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-green/10 flex items-center justify-center text-priority-green font-bold">
                2
              </div>
              <div>
                <p className="text-gray-700 font-medium">Toque em Compartilhar</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Procure pelo ícone <Share size={16} className="text-blue-500 inline" /> na barra inferior.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-green/10 flex items-center justify-center text-priority-green font-bold">
                3
              </div>
              <div>
                <p className="text-gray-700 font-medium">Adicionar à Tela de Início</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Role para baixo e selecione <PlusSquare size={16} className="text-gray-600 inline" /> "Adicionar à Tela de Início".
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-priority-green/5 border border-priority-green/10 rounded-lg">
                <p className="text-xs text-priority-green font-semibold text-center">
                    Pronto! O ícone dourado da Priority aparecerá no seu menu.
                </p>
            </div>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3DDC84] rounded-full flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Android</h2>
              <span className="text-sm text-gray-500 font-medium">Chrome / Edge</span>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-gold/20 flex items-center justify-center text-priority-green font-bold">
                1
              </div>
              <div>
                <p className="text-gray-700 font-medium">Abra no Google Chrome</p>
                <p className="text-sm text-gray-500 mt-1">Acesse o sistema pelo navegador padrão do Android.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-gold/20 flex items-center justify-center text-priority-green font-bold">
                2
              </div>
              <div>
                <p className="text-gray-700 font-medium">Abra o Menu</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Toque nos três pontinhos <MoreVertical size={16} className="text-gray-600 inline" /> no canto superior direito.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-priority-gold/20 flex items-center justify-center text-priority-green font-bold">
                3
              </div>
              <div>
                <p className="text-gray-700 font-medium">Instalar Aplicativo</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Selecione "Instalar aplicativo" ou "Adicionar à tela inicial" <Smartphone size={16} className="text-gray-600 inline" />.
                </p>
              </div>
            </div>

             <div className="mt-4 p-4 bg-priority-gold/10 border border-priority-gold/20 rounded-lg">
                <p className="text-xs text-priority-green font-semibold text-center">
                    Pronto! O sistema funcionará como um aplicativo nativo.
                </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Support Info */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm border border-gray-100">
            <Download size={18} className="text-priority-gold" />
            <span className="text-sm text-gray-600">Dúvidas? Entre em contato com o suporte de TI da <strong>Priority</strong>.</span>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;