import React from 'react';

/**
 * TerminalButton - Precision terminal action button
 * No pill shapes, strict 4px radius, hairline borders, brass accent.
 */
export default function TerminalButton({
  children,
  onClick,
  type = 'button',
  variant = 'brass', // 'brass' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed select-none focus:outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5',
  };

  const variantStyles = {
    brass: 'bg-[#C9A24B] text-[#0E1013] font-semibold hover:bg-[#D4B263] active:bg-[#B38D36]',
    outline: 'bg-transparent text-[#F5F3EE] border border-[#2A2D33] hover:border-[#6B7280] hover:bg-[#14171C]',
    danger: 'bg-[#B23B3B] text-white hover:bg-[#C44646] active:bg-[#993131]',
    ghost: 'bg-transparent text-[#6B7280] hover:text-[#F5F3EE] hover:bg-[#1A1D23]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.brass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
