import React from 'react';

/**
 * StatusBadge - Functional telemetric status indicator with micro-beacons
 * Variants:
 *  - 'signal' | 'success' | 'active' -> #1B7A5A (Signal Green, pulsing live beacon)
 *  - 'brick' | 'danger' | 'critical' | 'defaulted' -> #B23B3B (Brick Red, alert beacon)
 *  - 'brass' | 'warning' | 'pending' -> #C9A24B (Brass Gold, steady pulse)
 *  - 'neutral' | 'muted' -> #6B7280 (Cool Grey, solid status)
 */
export default function StatusBadge({ 
  children, 
  label,
  variant = 'neutral', 
  className = '',
  dot = true,
  pulse = true
}) {
  const content = children || label;

  const styles = {
    signal: 'bg-[#1B7A5A]/15 text-[#34D399] border-[#1B7A5A]/40',
    success: 'bg-[#1B7A5A]/15 text-[#34D399] border-[#1B7A5A]/40',
    active: 'bg-[#1B7A5A]/15 text-[#34D399] border-[#1B7A5A]/40',
    
    brick: 'bg-[#B23B3B]/15 text-[#F87171] border-[#B23B3B]/40',
    danger: 'bg-[#B23B3B]/15 text-[#F87171] border-[#B23B3B]/40',
    critical: 'bg-[#B23B3B]/15 text-[#F87171] border-[#B23B3B]/40',
    defaulted: 'bg-[#B23B3B]/15 text-[#F87171] border-[#B23B3B]/40',

    brass: 'bg-[#C9A24B]/15 text-[#C9A24B] border-[#C9A24B]/40',
    warning: 'bg-[#C9A24B]/15 text-[#C9A24B] border-[#C9A24B]/40',
    pending: 'bg-[#C9A24B]/15 text-[#C9A24B] border-[#C9A24B]/40',

    neutral: 'bg-[#14171C] text-[#6B7280] border-[#2A2D33]',
    muted: 'bg-[#14171C] text-[#6B7280] border-[#2A2D33]',
  };

  const dotColors = {
    signal: 'bg-[#1B7A5A]',
    success: 'bg-[#1B7A5A]',
    active: 'bg-[#1B7A5A]',
    brick: 'bg-[#B23B3B]',
    danger: 'bg-[#B23B3B]',
    critical: 'bg-[#B23B3B]',
    defaulted: 'bg-[#B23B3B]',
    brass: 'bg-[#C9A24B]',
    warning: 'bg-[#C9A24B]',
    pending: 'bg-[#C9A24B]',
    neutral: 'bg-[#6B7280]',
    muted: 'bg-[#6B7280]',
  };

  const activeStyle = styles[variant] || styles.neutral;
  const activeDot = dotColors[variant] || dotColors.neutral;

  const isSignal = variant === 'signal' || variant === 'active' || variant === 'success';
  const isBrick = variant === 'brick' || variant === 'danger' || variant === 'critical' || variant === 'defaulted';
  const isBrass = variant === 'brass' || variant === 'warning' || variant === 'pending';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono border rounded-[3px] uppercase tracking-wider select-none ${activeStyle} ${className}`}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && isSignal && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B7A5A] opacity-75" />
          )}
          {pulse && isBrick && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B23B3B] opacity-75" />
          )}
          {pulse && isBrass && (
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#C9A24B] opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${activeDot}`} />
        </span>
      )}
      {content}
    </span>
  );
}
