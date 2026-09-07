'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Terminal } from 'lucide-react';
import TerminalButton from '@/components/ui/TerminalButton';

/**
 * StateBlueprintEmpty - Precision State-Machine Blueprint for Empty Ledgers
 * Visualizes the on-chain smart contract lifecycle instead of generic "empty" text.
 */
export default function StateBlueprintEmpty({
  title = "No Active Contracts Registered",
  description = "No on-chain state transitions found for current wallet context.",
  actionHref = "/borrower/marketplace",
  actionLabel = "Browse Marketplace Offers",
  stages = [
    { code: "01", name: "PROPOSAL", desc: "AI Risk Scored" },
    { code: "02", name: "ESCROW", desc: "Lender Funded" },
    { code: "03", name: "DISBURSAL", desc: "Collateral-Free" },
    { code: "04", name: "SETTLEMENT", desc: "Repaid / Insured" }
  ]
}) {
  return (
    <div className="p-6 md:p-8 bg-[#0A0C0E] border border-[#1F2228] rounded-[4px] font-sans">
      <div className="max-w-xl mx-auto text-center space-y-6">
        
        {/* Status Protocol Header */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#14171C] border border-[#2A2D33] rounded-[3px] text-[10px] font-mono text-[#6B7280]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
          <span>PROTOCOL STATE // IDLE_AWAITING_ORIGINATION</span>
        </div>

        {/* State Machine Pipeline Diagram */}
        <div className="relative py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            {stages.map((stage, idx) => (
              <div 
                key={stage.code} 
                className="p-2.5 bg-[#0E1013] border border-[#2A2D33] rounded-[3px] relative group"
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-[#6B7280] mb-1">
                  <span>STAGE {stage.code}</span>
                  {idx < stages.length - 1 && (
                    <span className="hidden sm:inline text-[#3F444E]">→</span>
                  )}
                </div>
                <div className="text-xs font-mono font-semibold text-[#F5F3EE]">
                  {stage.name}
                </div>
                <div className="text-[10px] font-mono text-[#6B7280] mt-0.5">
                  {stage.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informative Text */}
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-semibold text-[#F5F3EE]">
            {title}
          </h3>
          <p className="text-xs font-mono text-[#6B7280] max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Action Button */}
        {actionHref && actionLabel && (
          <div className="pt-2">
            <Link href={actionHref}>
              <TerminalButton variant="brass" size="sm">
                <Terminal className="w-3.5 h-3.5" />
                {actionLabel}
              </TerminalButton>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
