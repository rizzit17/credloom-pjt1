'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, ChevronRight, Loader2 } from 'lucide-react';
import Tier2Verification from '@/components/auth/Tier2Verification';
import Tier3Verification from '@/components/auth/Tier3Verification';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';

function DashboardContent() {
  const { user, tierStatus, role, loading, refreshTierStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      refreshTierStatus();
    }
  }, [user, loading, refreshTierStatus]);

  if (loading || !tierStatus) {
    return (
      <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C9A24B] animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#6B7280]">ESTABLISHING PROTOCOL SESSION...</p>
        </div>
      </div>
    );
  }

  const getTierVariant = (tier) => {
    switch (tier) {
      case 3: return 'signal';
      case 2: return 'brass';
      default: return 'neutral';
    }
  };

  const getTierName = (tier) => {
    const names = { 1: 'Basic (Unverified)', 2: 'ENS Validated', 3: 'Gitcoin Passport Verified' };
    return names[tier] || 'Basic';
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2D33] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                CREDENTIAL PROTOCOL // ACCOUNT TELEMETRY
              </span>
              <StatusBadge variant="signal" label="NODE LINKED" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              Identity & Protocol Status: {user.username}
            </h1>
            <p className="text-xs text-[#6B7280] font-mono mt-1">
              ROLE ASSIGNMENT: {role ? role.toUpperCase() : 'STANDARD'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/${role || 'borrower'}`}>
              <TerminalButton variant="brass" size="sm">
                Open {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Role'} Terminal
                <ChevronRight className="w-3.5 h-3.5" />
              </TerminalButton>
            </Link>
          </div>
        </div>

        {/* Account Identity Spec */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TerminalPanel subheader="ACCOUNT HANDLE">
            <div className="text-lg font-mono font-bold text-[#F5F3EE] mt-1">
              {tierStatus.username}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Authenticated Credloom Identity
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="ETH WALLET IDENTIFIER">
            <div className="text-sm font-mono font-semibold text-[#C9A24B] mt-1 break-all">
              {tierStatus.wallet}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              On-chain settlement address
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="VERIFICATION LEVEL">
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge variant={getTierVariant(tierStatus.tier)} label={`TIER ${tierStatus.tier || 1}`} />
              <span className="text-xs font-mono text-[#F5F3EE]">
                {getTierName(tierStatus.tier)}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-2">
              Unlocks collateral-free borrowing discounts
            </p>
          </TerminalPanel>
        </div>

        {/* Verification Checkpoints (For Borrowers) */}
        {role === 'borrower' && tierStatus.tier && (
          <TerminalPanel title="Protocol Verification Stepper" subheader="PROOF REQUIREMENTS">
            <div className="divide-y divide-[#2A2D33] mt-2 text-xs font-mono">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#F5F3EE] block">
                    Tier 2: ENS Domain Resolution
                  </span>
                  <span className="text-[#6B7280] text-[11px]">
                    {tierStatus.tier2?.ens_verified 
                      ? `Verified ENS Name: ${tierStatus.tier2.ens_name}`
                      : 'Resolves web3 domain identity to reduce fraud weight.'}
                  </span>
                </div>
                {tierStatus.tier2?.ens_verified ? (
                  <StatusBadge variant="signal" label="CONFIRMED" />
                ) : (
                  <StatusBadge variant="brick" label="NOT ATTEMPTED" />
                )}
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#F5F3EE] block">
                    Tier 3: Gitcoin Passport Sybil Defense
                  </span>
                  <span className="text-[#6B7280] text-[11px]">
                    {tierStatus.tier3?.passport_verified === true 
                      ? `Passport Verified (Score: ${tierStatus.tier3.score})`
                      : tierStatus.tier3?.passport_verified === false
                      ? `Score: ${tierStatus.tier3.score} / Threshold: ${tierStatus.tier3.threshold}`
                      : 'Requires Tier 2 ENS domain proof prior to verification.'}
                  </span>
                </div>
                {tierStatus.tier3?.passport_verified === true ? (
                  <StatusBadge variant="signal" label="VERIFIED" />
                ) : tierStatus.tier3?.passport_verified === false ? (
                  <StatusBadge variant="brass" label="BELOW THRESHOLD" />
                ) : (
                  <StatusBadge variant="neutral" label="LOCKED" />
                )}
              </div>
            </div>
          </TerminalPanel>
        )}

        {/* Verification Submission Modules */}
        {role === 'borrower' && tierStatus.tier && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {!tierStatus.tier2?.ens_verified && (
              <Tier2Verification />
            )}
            {tierStatus.tier2?.ens_verified && (
              <Tier3Verification />
            )}
          </div>
        )}

        {/* Role Portal Dispatch Links */}
        <TerminalPanel title="Protocol Operations" subheader="SELECT ROLE CONSOLE">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Link
              href="/borrower"
              className="p-4 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] transition-colors group block"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#6B7280] mb-1">
                <span>ROLE // 01</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#C9A24B] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-[#F5F3EE] group-hover:text-[#C9A24B] transition-colors">
                Borrower Terminal
              </h3>
              <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                Credit evaluation, borrowing, repayment & capacity.
              </p>
            </Link>

            <Link
              href="/lender"
              className="p-4 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] transition-colors group block"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#6B7280] mb-1">
                <span>ROLE // 02</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#C9A24B] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-[#F5F3EE] group-hover:text-[#C9A24B] transition-colors">
                Lender Terminal
              </h3>
              <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                Escrow management, risk parameters & yield telemetry.
              </p>
            </Link>

            <Link
              href="/insurer"
              className="p-4 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] transition-colors group block"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#6B7280] mb-1">
                <span>ROLE // 03</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#C9A24B] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-[#F5F3EE] group-hover:text-[#C9A24B] transition-colors">
                Insurer Terminal
              </h3>
              <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                Underwriting capital, claims queue & 100 bps fee ingestion.
              </p>
            </Link>
          </div>
        </TerminalPanel>

      </div>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
