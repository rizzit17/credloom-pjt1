import React from 'react';

/**
 * DataRow - Left-aligned financial ledger row
 * Displays label on left and mono-spaced tabular value on right with hairline divider.
 */
export default function DataRow({
  label,
  value,
  secondary = null,
  highlight = null, // 'signal' | 'brick' | 'brass'
  border = true,
  className = ''
}) {
  const highlightStyles = {
    signal: 'text-[#2ecc71]',
    brick: 'text-[#e74c3c]',
    brass: 'text-[#C9A24B]',
  };

  return (
    <div className={`flex items-center justify-between py-2.5 ${border ? 'border-b border-[#2A2D33] last:border-b-0' : ''} ${className}`}>
      <span className="text-xs sm:text-sm text-[#6B7280]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-xs sm:text-sm font-mono tabular-nums ${highlight ? highlightStyles[highlight] : 'text-[#F5F3EE]'}`}>
          {value}
        </span>
        {secondary && (
          <span className="text-xs text-[#6B7280] font-mono">
            {secondary}
          </span>
        )}
      </div>
    </div>
  );
}
