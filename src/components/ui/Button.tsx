import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const BASE_STYLES = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:pointer-events-none disabled:opacity-45';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_10px_24px_rgba(5,86,170,0.38)] hover:-translate-y-0.5',
  secondary: 'bg-white/88 text-slate-900 border border-blue-100 shadow-sm hover:bg-white',
  ghost: 'bg-transparent text-slate-700 hover:bg-white/70',
  danger: 'bg-rose-600 text-white shadow-[0_8px_20px_rgba(190,24,93,0.3)] hover:bg-rose-500',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'min-h-[38px] px-3.5 text-sm',
  md: 'min-h-[44px] px-4 text-sm sm:text-base',
  lg: 'min-h-[50px] px-5 text-base',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
