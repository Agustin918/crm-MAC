'use client';

import { cn } from '@/lib/utils';
import { CrmButton } from './crm-button';
import { Search, Inbox, Users, Calendar, FileText, Plus, LucideIcon } from 'lucide-react';

type EmptyVariant = 'default' | 'contacts' | 'tasks' | 'calendar' | 'search' | 'custom';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  icon?: LucideIcon;
  className?: string;
}

const variantConfig = {
  default: {
    icon: Inbox,
    title: 'No hay elementos',
    description: 'No se encontró ningún contenido para mostrar.',
  },
  contacts: {
    icon: Users,
    title: 'No hay contactos',
    description: 'Comienza agregando tu primer contacto para gestionar tus leads y clientes.',
  },
  tasks: {
    icon: Inbox,
    title: 'No hay tareas',
    description: 'Crea una tarea para mantenerte organizado.',
  },
  calendar: {
    icon: Calendar,
    title: 'Sin eventos',
    description: 'No hay eventos programados para esta fecha.',
  },
  search: {
    icon: Search,
    title: 'Sin resultados',
    description: 'Intenta con otros términos de búsqueda.',
  },
  custom: {
    icon: FileText,
    title: 'Sin datos',
    description: 'No hay información disponible.',
  },
};

export function EmptyState({ 
  variant = 'default',
  title,
  description,
  action,
  secondaryAction,
  icon,
  className 
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const IconComponent: LucideIcon = icon || config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {IconComponent && (
        <div className="p-4 rounded-full bg-gray-100 dark:bg-[#1C1C1F] mb-4">
          <IconComponent className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title || config.title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {!description && variant !== 'custom' && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {config.description}
        </p>
      )}
      {action && (
        <CrmButton onClick={action.onClick}>
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </CrmButton>
      )}
      {secondaryAction && (
        <CrmButton 
          variant="outline" 
          onClick={secondaryAction.onClick}
          className="mt-2"
        >
          {secondaryAction.label}
        </CrmButton>
      )}
    </div>
  );
}

interface EmptyTableProps {
  columns: number;
  message?: string;
}

export function EmptyTable({ columns, message = 'No hay datos para mostrar' }: EmptyTableProps) {
  return (
    <tr>
      <td colSpan={columns} className="text-center py-12">
        <EmptyState 
          variant="default" 
          title="" 
          description={message}
          className="py-0"
        />
      </td>
    </tr>
  );
}
