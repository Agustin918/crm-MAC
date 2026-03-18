'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'text' | 'circle';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'text', count = 1, className }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className={cn("space-y-3", className)}>
        {skeletons.map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-[#27272A] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("space-y-2", className)}>
        {skeletons.map((i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="h-10 w-10 bg-gray-200 dark:bg-[#27272A] rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-[#27272A] rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-[#27272A] rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {skeletons.map((i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
      ))}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-indigo-500", sizeClasses[size])} />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
}

interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = 'Cargando...' }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-50 rounded-lg">
      <LoadingSpinner text={text} />
    </div>
  );
}
