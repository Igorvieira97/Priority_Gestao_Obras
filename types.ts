import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isAction?: boolean; // For "Instalar App" specific styling
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}