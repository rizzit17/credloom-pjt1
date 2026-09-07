import React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Database, ArrowRight } from "lucide-react";
import TerminalPanel from "@/components/ui/TerminalPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import TerminalButton from "@/components/ui/TerminalButton";

export default function Feature() {
  const pillars = [
    {
      code: "ENG-01",
      title: "Gradient Boosting Risk Model",
      subtitle: "Deterministic 0-1000 Credit Scoring",
      description:
        "The machine learning risk engine evaluates on-chain transaction frequency, wallet holding duration, past borrowing volume, and identity verification tiers to derive default probability in real time.",
      specs: [
        { label: "Target Metric", value: "Default Probability (0.0 — 1.0)" },
        { label: "Model Architecture", value: "GradientBoostingRegressor" },
        { label: "Execution Latency", value: "< 45ms per query" },
      ],
    },
    {
      code: "ECO-02",
      title: "Tripartite Risk Distribution",
      subtitle: "Capital Segmentation without Over-Collateral",
      description:
        "Borrowers access liquidity without locking 150% in dead capital. Lenders deploy into pre-funded pools with automated policy constraints. Insurers stake dedicated reserves to absorb default risk in exchange for 100 bps yield premiums.",
      specs: [
        { label: "Underwriter Yield", value: "100 bps per active loan" },
        { label: "Lender Protection", value: "Full principal reimbursement" },
        { label: "Collateral Ratio", value: "0% required for Tier 3" },
      ],
    },
    {
      code: "SEC-03",
      title: "Autonomous Escrow & Reputation",
      subtitle: "Permanent Smart Contract Settlement",
      description:
        "All funds are custodied in autonomous smart contract escrows with strict deadline enforcement. Defaulted wallets are permanently recorded on ReputationRegistry.sol, converting Web3 identity into an immutable credit history.",
      specs: [
        { label: "Escrow Logic", value: "LoanEscrow.sol (Hardhat/EVM)" },
        { label: "Blacklist Mutability", value: "Permanent / Irreversible" },
        { label: "Grace Window", value: "7 Calendar Days" },
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-transparent border-b border-[#2A2D33] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#2A2D33] mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#6B7280]">PROTOCOL ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#F5F3EE]">
              Engineered for precision credit pricing.
            </h2>
          </div>
          <div className="text-xs font-mono text-[#6B7280]">
            SPEC: VERIFIED SOLIDITY & SCIKIT-LEARN V2
          </div>
        </div>

        {/* 3-Pillar Ledger Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <TerminalPanel
              key={pillar.code}
              header={pillar.code}
              badge={<StatusBadge variant="neutral">{pillar.title.split(" ")[0]}</StatusBadge>}
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#F5F3EE]">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-[#C9A24B] mt-0.5">
                    {pillar.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  {pillar.description}
                </p>

                {/* Technical Specifications */}
                <div className="pt-4 border-t border-[#2A2D33] space-y-2">
                  {pillar.specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7280]">{s.label}</span>
                      <span className="font-mono text-[#F5F3EE] tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TerminalPanel>
          ))}
        </div>

        {/* Protocol Directives Strip */}
        <div className="mt-12 p-5 bg-[#14171C] border border-[#2A2D33] rounded-[4px] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C9A24B]" />
            <span className="text-xs sm:text-sm text-[#F5F3EE]">
              Ready to explore open liquidity offers or test your wallet borrowing capacity?
            </span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href="/borrower/marketplace" className="w-full md:w-auto">
              <TerminalButton variant="brass" size="sm" fullWidth>
                Browse Marketplace
              </TerminalButton>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
