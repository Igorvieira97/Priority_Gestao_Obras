import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-priority-green text-white px-6 py-4 shadow-md z-30">
          <div className="flex items-center gap-2">
             {/* Simple Logo for Mobile Header */}
             <div className="w-6 h-6 text-priority-gold">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                   <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                </svg>
             </div>
             <span className="font-bold tracking-widest text-sm">PRIORITY</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;