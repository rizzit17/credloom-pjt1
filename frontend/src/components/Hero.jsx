"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ArrowUpRight, Cpu, Lock, CheckCircle2 } from "lucide-react";
import TerminalButton from "@/components/ui/TerminalButton";
import StatusBadge from "@/components/ui/StatusBadge";
import TerminalPanel from "@/components/ui/TerminalPanel";
import GradientWaves from "@/components/ui/GradientWaves";

export default function HeroComponent() {
  const [simulatedScore, setSimulatedScore] = useState(760);

  // Dynamic APR calculation matching backend engine logic:
  // >= 750: 5% - 8%
  // 650 - 749: 8% - 12%
  // 550 - 649: 12% - 18%
  // < 550: 18% - 25%
  const calculateAPR = (score) => {
    if (score >= 750) {
      return (5.0 + ((850 - score) / 100) * 3.0).toFixed(2);
    } else if (score >= 650) {
      return (8.0 + ((750 - score) / 100) * 4.0).toFixed(2);
    } else if (score >= 550) {
      return (12.0 + ((650 - score) / 100) * 6.0).toFixed(2);
    } else {
      return Math.min(25.0, 18.0 + ((550 - score) / 100) * 7.0).toFixed(2);
    }
  };

  const currentAPR = calculateAPR(simulatedScore);
  const maxBorrow = simulatedScore >= 750 ? "5.00 ETH" : simulatedScore >= 650 ? "2.50 ETH" : "1.00 ETH";

  const getTierMetadata = (score) => {
    if (score >= 750) {
      return { label: "TIER 3: PASSPORT VERIFIED", variant: "signal" };
    }
    if (score >= 650) {
      return { label: "TIER 2: ENS VERIFIED", variant: "brass" };
    }
    if (score >= 550) {
      return { label: "TIER 1: BASIC IDENTIFIER", variant: "neutral" };
    }
    return { label: "RESTRICTED COLLATERAL", variant: "brick" };
  };

  const tierMeta = getTierMetadata(simulatedScore);
  const sliderPercentage = ((simulatedScore - 400) / (850 - 400)) * 100;

  // Calibrated graduation tick landmarks with clear typography
  const ticks = [
    { score: 400, label: "400", tier: "RESTRICTED", left: 0 },
    { score: 550, label: "550", tier: "BASIC", left: ((550 - 400) / 450) * 100 },
    { score: 650, label: "650", tier: "TIER 2", left: ((650 - 400) / 450) * 100 },
    { score: 750, label: "750", tier: "TIER 3", left: ((750 - 400) / 450) * 100 },
    { score: 850, label: "850", tier: "PRIME+", left: 100 },
  ];

  return (
    <section className="relative pt-8 pb-16 lg:py-24 bg-[#0E1013] border-b border-[#2A2D33] overflow-hidden">
      {/* Background GradientWaves from React Bits */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="w-full h-full relative opacity-65">
          <GradientWaves
            horizonColor="#5227FF"
            waveColor="#FF9FFC"
            crestColor="#FFFFFF"
            speed={0.4}
            amplitude={2.5}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1.0}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1.0}
            opacity={1.0}
            mouseInteraction={true}
            parallaxStrength={0.5}
            grain={true}
            grainIntensity={0.05}
          />
        </div>
        {/* Soft terminal gradient mask to keep data and live rate calculator razor sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1013]/60 via-transparent to-[#0E1013] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column - Financial Headline & Thesis (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge variant="signal" label="ZERO-COLLATERAL PROTOCOL" />
              <span className="text-xs font-mono text-[#9CA3AF]">
                GBR RISK MODEL V2
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F5F3EE] leading-[1.1]">
              Under-collateralized micro-credit for Web3.
            </h1>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed max-w-xl font-normal">
              Traditional DeFi mandates 150% to 200% over-collateralization. Credloom converts wallet identity and behavioral track records into priced credit, secured by autonomous escrow and tripartite insurance.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
                <div className="text-[11px] text-[#9CA3AF] font-mono">RISK RANGE</div>
                <div className="text-lg font-mono font-semibold text-[#F5F3EE] tabular-nums mt-0.5">
                  0 — 1000
                </div>
              </div>
              <div className="p-3 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
                <div className="text-[11px] text-[#9CA3AF] font-mono">DYNAMIC APR</div>
                <div className="text-lg font-mono font-semibold text-[#C9A24B] tabular-nums mt-0.5">
                  5.0% — 25.0%
                </div>
              </div>
              <div className="p-3 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
                <div className="text-[11px] text-[#9CA3AF] font-mono">SETTLEMENT</div>
                <div className="text-lg font-mono font-semibold text-[#1B7A5A] tabular-nums mt-0.5">
                  0-ESCROW
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/borrower">
                <TerminalButton variant="brass" size="lg">
                  Access Borrower Terminal
                </TerminalButton>
              </Link>
              <Link href="/lender">
                <TerminalButton variant="outline" size="lg">
                  Deploy Liquidity
                </TerminalButton>
              </Link>
            </div>
          </div>

          {/* Right Column - Large High-Legibility Rate Calibrator (6 Cols) */}
          <div className="lg:col-span-6">
            <TerminalPanel
              title="LIVE RATE CALIBRATOR"
              subheader="GBR PROBABILITY PRICING"
              badge={<StatusBadge variant={tierMeta.variant} label={tierMeta.label} className="text-xs px-2.5 py-1" />}
              className="p-6 sm:p-8"
            >
              {/* Score Control Slider with High Legibility & Prominent Numbers */}
              <div className="space-y-4 pb-6 border-b border-[#2A2D33]">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#9CA3AF]">
                    CALIBRATED CREDIT SCORE
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-[#F5F3EE] tabular-nums">
                      {simulatedScore}
                    </span>
                    <span className="text-xs sm:text-sm text-[#6B7280] font-mono">
                      / 850 MAX
                    </span>
                  </div>
                </div>
                
                {/* Custom Engineered Range Track */}
                <div className="relative pt-3 pb-8">
                  {/* Visual Background Track (Thicker 8px track with border) */}
                  <div className="relative w-full h-2.5 bg-[#0A0C0E] border border-[#2A2D33] rounded-[2px] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#B23B3B] via-[#C9A24B] to-[#1B7A5A] transition-all"
                      style={{ width: `${sliderPercentage}%` }}
                    />
                  </div>

                  {/* Native Range Input (Transparent, Aligned Over Track) */}
                  <input
                    type="range"
                    min="400"
                    max="850"
                    step="10"
                    value={simulatedScore}
                    onChange={(e) => setSimulatedScore(Number(e.target.value))}
                    className="absolute top-1.5 left-0 w-full h-5 opacity-0 cursor-pointer z-20"
                  />

                  {/* Custom Thumb Indicator (Larger 20px Disc) */}
                  <div 
                    className="absolute top-1 w-5 h-5 bg-[#F5F3EE] border-2 border-[#C9A24B] rounded-full shadow-md pointer-events-none -translate-x-1/2 z-10 transition-transform hover:scale-110"
                    style={{ left: `${sliderPercentage}%` }}
                  />

                  {/* Calibrated Graduation Ticks (Bigger & High Contrast) */}
                  <div className="relative w-full mt-3">
                    {ticks.map((tick) => {
                      const isActive = simulatedScore >= tick.score;
                      return (
                        <div
                          key={tick.score}
                          className="absolute -translate-x-1/2 flex flex-col items-center"
                          style={{ left: `${tick.left}%` }}
                        >
                          {/* Tick Line */}
                          <div className={`w-[1.5px] h-2.5 ${isActive ? 'bg-[#C9A24B]' : 'bg-[#3A3E47]'}`} />
                          
                          {/* Graduation Numeric Label (Larger 11px) */}
                          <span className={`text-[11px] font-mono mt-1 ${isActive ? 'text-[#F5F3EE] font-bold' : 'text-[#8A909D]'}`}>
                            {tick.label}
                          </span>
                          
                          {/* Tier Sub-Label (Larger 9px) */}
                          <span className={`text-[9px] font-mono tracking-tight font-medium mt-0.5 ${isActive ? 'text-[#C9A24B]' : 'text-[#6B7280]'}`}>
                            {tick.tier}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* High-Legibility Dynamic Rate Ledger */}
              <div className="py-2 divide-y divide-[#2A2D33]">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base font-normal text-[#D1D5DB]">
                    Derived Dynamic APR
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#C9A24B] tabular-nums">
                    {currentAPR}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base font-normal text-[#D1D5DB]">
                    Max Borrow Cap
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#F5F3EE] tabular-nums">
                      {maxBorrow}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-[#1B7A5A]/15 border border-[#1B7A5A]/40 text-[#34D399] rounded-[2px]">
                      Zero-Collateral
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base font-normal text-[#D1D5DB]">
                    Protocol Insurance Fee
                  </span>
                  <span className="text-sm sm:text-base font-semibold font-mono text-[#F5F3EE] tabular-nums">
                    100 bps (1.00%)
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base font-normal text-[#D1D5DB]">
                    Default Enforcement
                  </span>
                  <span className="text-sm sm:text-base font-semibold font-mono text-[#F87171]">
                    On-Chain Slashing
                  </span>
                </div>
              </div>

              {/* Loan State Machine Preview */}
              <div className="mt-5 pt-4 border-t border-[#2A2D33] bg-[#0A0C0E] p-4 rounded-[4px] border border-[#1F2228]">
                <div className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider mb-2.5">
                  Smart Contract Lifecycle Pipeline
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="py-2 px-1 bg-[#14171C] border border-[#2A2D33] text-[#9CA3AF] rounded-[2px]">
                    1. PROPOSAL
                  </div>
                  <div className="py-2 px-1 bg-[#14171C] border border-[#2A2D33] text-[#9CA3AF] rounded-[2px]">
                    2. ESCROW
                  </div>
                  <div className="py-2 px-1 bg-[#1B7A5A]/20 border border-[#1B7A5A] text-[#34D399] font-bold rounded-[2px] shadow-sm">
                    3. DISBURSED
                  </div>
                  <div className="py-2 px-1 bg-[#14171C] border border-[#2A2D33] text-[#9CA3AF] rounded-[2px]">
                    4. SETTLED
                  </div>
                </div>
              </div>

            </TerminalPanel>
          </div>

        </div>
      </div>
    </section>
  );
}