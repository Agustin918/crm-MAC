import Link from 'next/link';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-bold">CRM Básico</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/contacts"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <Users className="h-5 w-5" />
          Contactos
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <Settings className="h-5 w-5" />
          Configuración
        </Link>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-full bg-slate-300"></div>
          <div>
            <p className="font-medium">Usuario</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
