'use client';

import { cn } from '@/lib/utils';
import { CrmButton } from './crm-button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Algo salió mal',
  message = 'Ha ocurrido un error inesperado. Por favor, intentá de nuevo.',
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-500/20 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <CrmButton onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </CrmButton>
      )}
    </div>
  );
}

interface NotFoundStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NotFoundState({
  title = 'No encontrado',
  message = 'El recurso que buscas no existe o fue eliminado.',
  actionLabel = 'Volver al inicio',
  onAction,
  className
}: NotFoundStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <svg 
          className="h-8 w-8 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {message}
      </p>
      {onAction && (
        <CrmButton onClick={onAction}>
          <Home className="h-4 w-4 mr-2" />
          {actionLabel}
        </CrmButton>
      )}
    </div>
  );
}
