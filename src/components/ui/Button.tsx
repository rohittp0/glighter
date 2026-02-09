interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'min-h-[44px] px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200';

  const variantClasses = variant === 'primary'
    ? 'bg-primary text-white hover:bg-opacity-90'
    : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
