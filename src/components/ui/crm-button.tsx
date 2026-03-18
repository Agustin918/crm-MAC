'use client';

import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const crmButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /* Primary Actions */
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md focus:ring-primary-500/50',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500/50',
        
        /* Semantic Colors */
        success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-sm hover:shadow-md focus:ring-success-500/50',
        warning: 'bg-warning-500 text-gray-900 hover:bg-warning-600 active:bg-warning-700 shadow-sm hover:shadow-md focus:ring-warning-500/50',
        error: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-sm hover:shadow-md focus:ring-error-500/50',
        info: 'bg-info-600 text-white hover:bg-info-700 active:bg-info-800 shadow-sm hover:shadow-md focus:ring-info-500/50',
        
        /* Outline Variants */
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/50',
        outlineSuccess: 'border border-success-300 bg-success-50 text-success-700 hover:bg-success-100 hover:border-success-400 focus:ring-success-500/50',
        outlineWarning: 'border border-warning-300 bg-warning-50 text-warning-700 hover:bg-warning-100 hover:border-warning-400 focus:ring-warning-500/50',
        outlineError: 'border border-error-300 bg-error-50 text-error-700 hover:bg-error-100 hover:border-error-400 focus:ring-error-500/50',
        outlineInfo: 'border border-info-300 bg-info-50 text-info-700 hover:bg-info-100 hover:border-info-400 focus:ring-info-500/50',
        
        /* Ghost Variants */
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500/50',
        ghostSuccess: 'text-success-700 hover:bg-success-100 active:bg-success-200 focus:ring-success-500/50',
        ghostWarning: 'text-warning-700 hover:bg-warning-100 active:bg-warning-200 focus:ring-warning-500/50',
        ghostError: 'text-error-700 hover:bg-error-100 active:bg-error-200 focus:ring-error-500/50',
        ghostInfo: 'text-info-700 hover:bg-info-100 active:bg-info-200 focus:ring-info-500/50',
        
        /* Destructive */
        destructive: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-sm focus:ring-error-500/50',
        
        /* Subtle Variants */
        subtle: 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300',
        subtleSuccess: 'bg-success-100 text-success-700 hover:bg-success-200 active:bg-success-300 focus:ring-success-500/50',
        subtleWarning: 'bg-warning-100 text-warning-700 hover:bg-warning-200 active:bg-warning-300 focus:ring-warning-500/50',
        subtleError: 'bg-error-100 text-error-700 hover:bg-error-200 active:bg-error-300 focus:ring-error-500/50',
        subtleInfo: 'bg-info-100 text-info-700 hover:bg-info-200 active:bg-info-300 focus:ring-info-500/50',
        
        /* Link */
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-7 px-2.5 text-sm',
        md: 'h-8 px-3.5 text-sm',
        lg: 'h-10 px-4 text-base',
        xl: 'h-11 px-6 text-base',
        '2xl': 'h-12 px-8 text-lg',
        iconXs: 'h-6 w-6',
        iconSm: 'h-7 w-7',
        icon: 'h-8 w-8',
        iconLg: 'h-10 w-10',
        iconXl: 'h-11 w-11',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        wiggle: 'hover:animate-wiggle',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      animation: 'none',
    },
  }
);

interface CrmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: VariantProps<typeof crmButtonVariants>['variant'];
  size?: VariantProps<typeof crmButtonVariants>['size'];
  animation?: VariantProps<typeof crmButtonVariants>['animation'];
  asChild?: boolean;
  animate?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const CrmButton = forwardRef<HTMLButtonElement, CrmButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    animation = 'none',
    asChild = false, 
    animate = false,
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : (animate ? motion.button : 'button');
    const buttonClassName = cn(crmButtonVariants({ variant, size, animation }), className);
    
    const content = (
      <span className="flex items-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </span>
    );

    if (animate && !asChild) {
      return (
        <motion.button
          ref={ref}
          className={buttonClassName}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled || loading}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {content}
        </motion.button>
      );
    }

    if (asChild) {
      return (
        <Slot className={buttonClassName} {...(props as React.ComponentProps<typeof Slot>)}>
          {content}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

CrmButton.displayName = 'CrmButton';

interface IconButtonProps extends Omit<CrmButtonProps, 'children' | 'icon' | 'iconPosition'> {
  children: ReactNode;
  label?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <CrmButton
        ref={ref}
        className={cn('aspect-square', className)}
        aria-label={label}
        {...props}
      >
        {props.children}
      </CrmButton>
    );
  }
);

IconButton.displayName = 'IconButton';

export { CrmButton, IconButton, crmButtonVariants };
export type { CrmButtonProps, IconButtonProps };
