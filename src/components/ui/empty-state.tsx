import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CrmButton } from './crm-button';

interface EmptyStateProps {
  icon?: ReactNode;
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
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction,
  className 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <CrmButton onClick={action.onClick}>
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
    </motion.div>
  );
}

interface EmptyStateIconProps {
  type: 'contacts' | 'tasks' | 'deals' | 'pipeline' | 'search';
}

const emptyStateIcons = {
  contacts: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  tasks: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  deals: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  pipeline: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  search: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

const emptyStateContent = {
  contacts: {
    title: 'No hay contactos aún',
    description: 'Comienza agregando tu primer contacto para gestionar tus leads y clientes.',
  },
  tasks: {
    title: 'No hay tareas pendientes',
    description: 'Crea una tarea para mantenerte organizado y no olvidar nada importante.',
  },
  deals: {
    title: 'No hay deals en esta etapa',
    description: 'Arrastra un contacto aquí para comenzar a seguir su progreso.',
  },
  pipeline: {
    title: 'Tu pipeline está vacío',
    description: 'Agrega contactos a tu pipeline para comenzar a gestionar tu ventas.',
  },
  search: {
    title: 'No se encontraron resultados',
    description: 'Intenta con otros términos de búsqueda o filtros.',
  },
};

interface PresetEmptyStateProps {
  type: EmptyStateIconProps['type'];
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function PresetEmptyState({ type, action, className }: PresetEmptyStateProps) {
  const content = emptyStateContent[type];
  const icon = emptyStateIcons[type];

  return (
    <EmptyState
      icon={icon}
      title={content.title}
      description={content.description}
      action={action}
      className={className}
    />
  );
}
