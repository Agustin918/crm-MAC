'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Bell, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onNewLead?: () => void;
}

export function Topbar({ onNewLead }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/contacts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const notifications = [
    { id: 1, title: 'Nueva tarea asignada', time: '2 min', read: false },
    { id: 2, title: 'Lead sin seguimiento (7 días)', time: '1 hora', read: false },
    { id: 3, title: 'Presupuesto enviado a Amalia', time: 'ayer', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] flex items-center justify-between px-4">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contacto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewLead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Lead</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notificaciones</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        !notif.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900 dark:text-gray-100">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/inbox"
                  className="block p-3 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Ver todas
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
