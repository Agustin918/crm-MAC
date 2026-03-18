'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare,
  Calendar,
  Inbox, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  Bell,
  FolderKanban
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ui/theme-toggle';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contactos', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/calendar', label: 'Calendario', icon: Calendar },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
];

const bottomNavItems = [
  { href: '/capture', label: 'Vista Cliente', icon: ExternalLink, external: true },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col h-screen border-r bg-card dark:bg-[#0A0A0B] border-border dark:border-[#27272A]",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "flex items-center border-b border-border dark:border-[#27272A] px-4 py-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A7</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Arquitectura
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1C1C1F] transition-colors",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive 
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500 dark:border-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C1C1F] hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-indigo-600 dark:text-indigo-400")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        
        <div className="pt-4 pb-2">
          <p className={cn(
            "px-3 text-xs font-semibold uppercase tracking-wider",
            collapsed && "hidden",
            "text-gray-400 dark:text-gray-500"
          )}>
            Acceso rápido
          </p>
        </div>
        
        <a 
          href="/capture"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
        >
          <ExternalLink className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Vista Cliente</span>}
        </a>
      </nav>
      
      <div className="border-t border-border dark:border-[#27272A] p-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Tema</span>
            <ThemeToggle />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <ThemeToggle />
          </div>
        )}
        
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive 
                  ? "bg-gray-100 dark:bg-[#1C1C1F] text-gray-900 dark:text-gray-200"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C1C1F] hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        
        <div className="flex items-center gap-3 p-3 mt-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-sm">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@crm.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
