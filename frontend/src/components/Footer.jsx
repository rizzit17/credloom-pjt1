import React from "react";
import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";
import { BsLinkedin, BsTelegram, BsTwitter } from "react-icons/bs";

export default function Footer() {
  const contracts = [
    { name: "ReputationRegistry.sol", address: "0x5FbDB...aa3", desc: "Irreversible Blacklist" },
    { name: "LoanEscrow.sol", address: "0x9fE46...6e0", desc: "Autonomous Custody" },
    { name: "InsurancePool.sol", address: "0xe7f17...512", desc: "100 bps Underwriting" },
    { name: "LenderLiquidityPool.sol", address: "0xCf7Ed...Fc9", desc: "Pre-funded Escrow" },
  ];

  return (
    <footer className="bg-[#0E1013] border-t border-[#2A2D33] text-[#F5F3EE] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#2A2D33]">
          {/* Column 1: Protocol Overview */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#14171C] border border-[#2A2D33] rounded-[4px] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#C9A24B]" />
              </div>
              <span className="text-sm font-semibold tracking-wider text-[#F5F3EE] uppercase">
                CREDLOOM PROTOCOL
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm">
              Autonomous under-collateralized micro-lending infrastructure. Transforms wallet history into verifiable borrowing power via Gradient Boosting Regressor AI risk scoring and on-chain reputation enforcement.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280]">
              <span>NET: HARDHAT 31337</span>
              <span>·</span>
              <span className="text-[#1B7A5A]">SYS STATUS: NOMINAL</span>
            </div>
          </div>

          {/* Column 2: On-Chain Settlement Registry */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
              Settlement Infrastructure
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {contracts.map((c) => (
                <div
                  key={c.name}
                  className="p-2.5 bg-[#14171C] border border-[#2A2D33] rounded-[4px]"
                >
                  <div className="text-[11px] font-mono text-[#F5F3EE] truncate">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">
                    {c.desc}
                  </div>
                  <div className="text-[10px] font-mono text-[#C9A24B] mt-1">
                    {c.address}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Navigation & Contact */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
              Marketplace Directives
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-[#6B7280] hover:text-[#F5F3EE] transition-colors">
                  Protocol Overview
                </Link>
              </li>
              <li>
                <Link href="/borrower" className="text-[#6B7280] hover:text-[#F5F3EE] transition-colors">
                  Borrower Terminal (AI Scored)
                </Link>
              </li>
              <li>
                <Link href="/lender" className="text-[#6B7280] hover:text-[#F5F3EE] transition-colors">
                  Lender Capital Deployer
                </Link>
              </li>
              <li>
                <Link href="/insurer" className="text-[#6B7280] hover:text-[#F5F3EE] transition-colors">
                  Underwriting & Insurance Pool
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#6B7280] hover:text-[#F5F3EE] transition-colors">
                  Institutional Inquiries
                </Link>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://twitter.com/credloom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#2A2D33] bg-[#14171C] text-[#6B7280] hover:text-[#F5F3EE] hover:border-[#6B7280] transition-colors"
              >
                <BsTwitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://t.me/credloom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#2A2D33] bg-[#14171C] text-[#6B7280] hover:text-[#F5F3EE] hover:border-[#6B7280] transition-colors"
              >
                <BsTelegram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/company/credloom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#2A2D33] bg-[#14171C] text-[#6B7280] hover:text-[#F5F3EE] hover:border-[#6B7280] transition-colors"
              >
                <BsLinkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280] font-mono">
          <div>
            © {new Date().getFullYear()} CREDLOOM INC. ZERO-COLLATERAL MICRO-CREDIT INFRASTRUCTURE.
          </div>
          <div className="flex items-center gap-4">
            <span>TERMS OF SERVICE</span>
            <span>·</span>
            <span>PRIVACY PROOFS</span>
            <span>·</span>
            <span>SECURITY AUDIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
