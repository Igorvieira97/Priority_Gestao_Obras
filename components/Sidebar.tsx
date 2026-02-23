import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Users, 
  Receipt, 
  Smartphone, 
  X,
  Building2,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { NavItem, SidebarProps } from '../types';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Minhas Obras', href: '/obras', icon: Building2 },
  { label: 'Catálogo de Materiais', href: '/materiais', icon: PackageSearch },
  { label: 'Gestão de Pessoas', href: '/pessoas', icon: Users },
  { label: 'Custos e Despesas', href: '/financeiro', icon: Receipt },
  { label: 'Gestão de Acessos', href: '/usuarios', icon: ShieldCheck },
  { label: 'Instalar App', href: '/instalar-app', icon: Smartphone, isAction: true },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const overlayClass = isOpen 
    ? 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden' 
    : 'hidden';

  const sidebarClass = `
    fixed top-0 left-0 z-50 h-full w-72 
    bg-priority-green text-white 
    transform transition-transform duration-300 ease-in-out shadow-2xl
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:static md:shadow-none
  `;

  return (
    <>
      <div className={overlayClass} onClick={() => setIsOpen(false)} aria-hidden="true" />

      <aside className={sidebarClass}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-priority-gold">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    <path d="M12 6V18" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 12H18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold tracking-widest text-white uppercase">
                  Priority
                </h1>
              </div>
              <span className="text-[10px] tracking-[0.3em] text-priority-gold uppercase pl-10">
                Engenharia
              </span>
            </div>

            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const isAction = item.isAction;

              let itemClass = `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
              `;

              if (isAction) {
                itemClass += ` mt-8 border border-priority-gold text-priority-gold hover:bg-priority-gold hover:text-priority-green`;
              } else if (isActive) {
                itemClass += ` bg-white/10 text-priority-gold border-r-4 border-priority-gold`;
              } else {
                itemClass += ` text-gray-300 hover:bg-white/5 hover:text-white`;
              }

              return (
                <NavLink 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={itemClass}
                >
                  <item.icon 
                    size={20} 
                    className={isActive || isAction ? 'text-current' : 'text-gray-400 group-hover:text-white'} 
                  />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black/20 mb-2">
              <div className="w-8 h-8 rounded-full bg-priority-gold flex items-center justify-center text-priority-green font-bold">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Admin User</span>
                <span className="text-[10px] text-gray-400">Engenheiro Chefe</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;