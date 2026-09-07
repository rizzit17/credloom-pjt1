import React from 'react';

/**
 * TerminalPanel - Precision financial ledger container
 * Features:
 * - Flat surface (#14171C) with hairline border (#2A2D33)
 * - Calibrated corner registration marks (+) for an engineered workstation feel
 * - Semantic variant borders (signal, brick, brass, inset)
 * - Header/subheader metadata slots
 */
export default function TerminalPanel({ 
  children, 
  className = '', 
  header = null,
  title = null,
  subheader = null,
  badge = null,
  action = null,
  variant = 'default',
  cornerMarks = true,
  noPadding = false
}) {
  const displayTitle = header || title;

  const getVariantStyles = () => {
    switch (variant) {
      case 'signal':
        return 'border-[#1B7A5A]/50 bg-[#0E1512]/60';
      case 'brick':
        return 'border-[#B23B3B]/50 bg-[#170E10]/60';
      case 'brass':
        return 'border-[#C9A24B]/50 bg-[#16140E]/60';
      case 'inset':
        return 'border-[#1F2228] bg-[#0A0C0E]';
      default:
        return 'border-[#2A2D33] bg-[#14171C]';
    }
  };

  return (
    <div className={`relative border rounded-[4px] ${getVariantStyles()} ${className}`}>
      
      {/* Precision Corner Registration Marks (+) */}
      {cornerMarks && (
        <>
          <span className="absolute top-1 left-1.5 text-[8px] font-mono text-[#3D424D] select-none pointer-events-none leading-none z-10">
            +
          </span>
          <span className="absolute top-1 right-1.5 text-[8px] font-mono text-[#3D424D] select-none pointer-events-none leading-none z-10">
            +
          </span>
          <span className="absolute bottom-1 left-1.5 text-[8px] font-mono text-[#3D424D] select-none pointer-events-none leading-none z-10">
            +
          </span>
          <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-[#3D424D] select-none pointer-events-none leading-none z-10">
            +
          </span>
        </>
      )}

      {/* Header Ledger */}
      {(displayTitle || subheader || badge || action) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2D33] bg-[#101216] relative z-0">
          <div className="flex items-center gap-2">
            {badge}
            <div>
              {subheader && (
                <span className="block text-[9px] font-mono tracking-wider text-[#6B7280] uppercase leading-tight">
                  {subheader}
                </span>
              )}
              {displayTitle && (
                <h3 className="text-xs font-mono font-medium tracking-wide text-[#F5F3EE] uppercase leading-tight">
                  {displayTitle}
                </h3>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Main Panel Content */}
      <div className={noPadding ? '' : 'p-4 sm:p-5 relative z-0'}>
        {children}
      </div>
    </div>
  );
}
