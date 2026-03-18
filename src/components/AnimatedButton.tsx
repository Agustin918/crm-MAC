'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

const variants = {
  default: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg',
  outline: 'border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700',
  ghost: 'hover:bg-slate-100 text-slate-700',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
};

const sizes = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
};

export function AnimatedButton({ 
  children, 
  className, 
  variant = 'default', 
  size = 'default',
  asChild = false,
  type = 'button',
  disabled = false,
  onClick,
}: AnimatedButtonProps) {
  const baseClassName = cn(
    'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );

  if (asChild) {
    return (
      <Slot className={baseClassName} onClick={onClick}>
        {children}
      </Slot>
    );
  }

  return (
    <motion.button
      className={baseClassName}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedIconButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedIconButton({ 
  children, 
  className,
  type = 'button',
  disabled = false,
  onClick,
}: AnimatedIconButtonProps) {
  return (
    <motion.button
      className={cn(
        'p-2 rounded-lg hover:bg-slate-100 transition-colors',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
