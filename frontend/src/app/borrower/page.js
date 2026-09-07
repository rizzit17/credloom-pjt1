'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getBorrowerLoans } from '@/lib/api/borrower';
import Tier2Verification from '@/components/auth/Tier2Verification';
import Tier3Verification from '@/components/auth/Tier3Verification';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';
import StateBlueprintEmpty from '@/components/ui/StateBlueprintEmpty';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  AlertCircle, 
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function BorrowerDashboard() {
  const { user, tierStatus, loading, refreshTierStatus } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      refreshTierStatus();
    }
  }, [user, loading]);

  const [loansData, setLoansData] = useState({ loans: [], total: 0 });
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;
      try {
        setLoansLoading(true);
        const response = await getBorrowerLoans();
        setLoansData(response);
      } catch (error) {
        console.error('[Dashboard] Error fetching loans:', error);
        setLoansError(error.message || 'Failed to fetch loans');
      } finally {
        setLoansLoading(false);
      }
    };
    fetchLoans();
  }, [user]);

  const [dashboardData] = useState({
    wallet: {
      address: user?.primary_wallet || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      nativeBalance: '2.500',
      stakedAmount: '0.00',
      availableBalance: '2.500'
    },
    creditScore: {
      score: 750,
      label: 'Prime Credit',
      trend: 'up',
      lastUpdated: '2026-03-01'
    },
    tier: {
      current: tierStatus?.tier === 3 ? 'Tier 3 (Passport)' : tierStatus?.tier === 2 ? 'Tier 2 (ENS)' : 'Tier 1 (Basic)',
      maxLoan: tierStatus?.tier === 3 ? '50,000' : tierStatus?.tier === 2 ? '10,000' : '5,000',
      maxDuration: '90 days',
      rateRange: tierStatus?.tier === 3 ? '5.0% - 8.0%' : tierStatus?.tier === 2 ? '8.0% - 12.0%' : '12.0% - 18.0%',
      progress: tierStatus?.tier === 3 ? 100 : tierStatus?.tier === 2 ? 65 : 30,
    },
    loans: {
      nearestDeadline: '2026-03-20T12:00:00Z',
    },
    eligibility: {
      status: 'eligible',
      maxBorrowable: tierStatus?.tier === 3 ? '10.00' : tierStatus?.tier === 2 ? '5.00' : '1.50',
    }
  });

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const calculateCountdown = () => {
      if (dashboardData.loans.nearestDeadline) {
        const deadline = new Date(dashboardData.loans.nearestDeadline);
        const now = new Date();
        const diff = deadline - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setCountdown(`${days}d ${hours}h ${minutes}m`);
        } else {
          setCountdown('OVERDUE');
        }
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [dashboardData.loans.nearestDeadline]);

  const activeTier = tierStatus?.tier || 1;

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2D33]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#6B7280]">OPERATOR CONSOLE</span>
              <span className="text-xs font-mono text-[#6B7280]">·</span>
              <StatusBadge variant="signal">ACTIVE SESSION</StatusBadge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F3EE]">
              Borrower Credit Terminal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/borrower/marketplace">
              <TerminalButton variant="brass" size="md">
                Browse Liquidity Pools
              </TerminalButton>
            </Link>
          </div>
        </div>

        {/* Top Financial Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Credit Score Radial / Meter */}
          <TerminalPanel header="AI RISK ASSESSMENT" badge={<StatusBadge variant="brass">GBR V2</StatusBadge>}>
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-3xl font-mono font-bold text-[#F5F3EE] tabular-nums">
                  {dashboardData.creditScore.score}
                  <span className="text-xs font-normal text-[#6B7280] ml-1">/ 1000</span>
                </div>
                <div className="text-xs font-mono text-[#1B7A5A] mt-1 flex items-center gap-1">
                  <span>▲ +24 pts</span>
                  <span className="text-[#6B7280]">({dashboardData.creditScore.label})</span>
                </div>
              </div>

              {/* Minimal SVG Gauge */}
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1A1D23]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#C9A24B] transition-all duration-1000"
                    strokeDasharray={`${(dashboardData.creditScore.score / 1000) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="square"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#6B7280]">
                  75%
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2A2D33] text-[11px] font-mono text-[#6B7280]">
              EVALUATED: {dashboardData.creditScore.lastUpdated}
            </div>
          </TerminalPanel>

          {/* Card 2: Borrowing Power */}
          <TerminalPanel header="BORROWING CAPACITY" badge={<StatusBadge variant="signal">UNSECURED</StatusBadge>}>
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-mono font-bold text-[#F5F3EE] tabular-nums">
                {dashboardData.eligibility.maxBorrowable} <span className="text-xs font-normal text-[#6B7280]">ETH</span>
              </div>
              <div className="text-xs font-mono text-[#6B7280]">
                TIER LIMIT: ${dashboardData.tier.maxLoan} USD
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2A2D33] flex justify-between text-xs font-mono">
              <span className="text-[#6B7280]">RATE BRACKET:</span>
              <span className="text-[#C9A24B]">{dashboardData.tier.rateRange}</span>
            </div>
          </TerminalPanel>

          {/* Card 3: Active Debt & Deadline Clock */}
          <TerminalPanel header="SETTLEMENT DEADLINE" badge={<StatusBadge variant={countdown === 'OVERDUE' ? 'brick' : 'brass'}>TIME LOCK</StatusBadge>}>
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-mono font-bold text-[#F5F3EE] tabular-nums">
                {countdown || "00d 00h 00m"}
              </div>
              <div className="text-xs font-mono text-[#6B7280]">
                NEAREST TRANCHE MATURITY
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2A2D33] flex justify-between text-xs font-mono">
              <span className="text-[#6B7280]">GRACE PERIOD:</span>
              <span className="text-[#F5F3EE]">7 CALENDAR DAYS</span>
            </div>
          </TerminalPanel>

          {/* Card 4: Settlement Wallet */}
          <TerminalPanel header="SETTLEMENT ACCOUNT" badge={<StatusBadge variant="neutral">HARDHAT</StatusBadge>}>
            <div className="space-y-1 pt-1">
              <div className="text-base font-mono text-[#F5F3EE] truncate">
                {user?.primary_wallet || dashboardData.wallet.address}
              </div>
              <div className="text-xs font-mono text-[#6B7280]">
                BALANCE: {dashboardData.wallet.nativeBalance} ETH
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2A2D33] flex justify-between text-xs font-mono">
              <span className="text-[#6B7280]">BLACKLIST STATE:</span>
              <span className="text-[#1B7A5A]">CLEAR · UNFLAGGED</span>
            </div>
          </TerminalPanel>
        </div>

        {/* Verification Tier Management */}
        <TerminalPanel
          header="VERIFICATION SPECIFICATION MATRIX"
          badge={<StatusBadge variant="signal">ACTIVE: TIER {activeTier}</StatusBadge>}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Tier 1 */}
            <div className={`p-3.5 border rounded-[4px] ${activeTier === 1 ? 'border-[#C9A24B] bg-[#1A1D23]' : 'border-[#2A2D33] bg-[#0E1013]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#F5F3EE]">TIER 1: BASIC</span>
                {activeTier >= 1 && <StatusBadge variant="signal">ACTIVE</StatusBadge>}
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Default registration limit.</p>
              <div className="space-y-1 text-xs font-mono border-t border-[#2A2D33] pt-2">
                <div className="flex justify-between"><span>Max Cap:</span><span className="text-[#F5F3EE]">$5,000</span></div>
                <div className="flex justify-between"><span>APR:</span><span className="text-[#F5F3EE]">12.0% - 18.0%</span></div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className={`p-3.5 border rounded-[4px] ${activeTier === 2 ? 'border-[#C9A24B] bg-[#1A1D23]' : 'border-[#2A2D33] bg-[#0E1013]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#F5F3EE]">TIER 2: ENS RESOLVED</span>
                {activeTier >= 2 ? <StatusBadge variant="signal">VERIFIED</StatusBadge> : <StatusBadge variant="neutral">PENDING</StatusBadge>}
              </div>
              <p className="text-xs text-[#6B7280] mb-3">On-chain Ethereum Name Service verification.</p>
              <div className="space-y-1 text-xs font-mono border-t border-[#2A2D33] pt-2">
                <div className="flex justify-between"><span>Max Cap:</span><span className="text-[#F5F3EE]">$10,000</span></div>
                <div className="flex justify-between"><span>APR:</span><span className="text-[#F5F3EE]">8.0% - 12.0%</span></div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className={`p-3.5 border rounded-[4px] ${activeTier === 3 ? 'border-[#C9A24B] bg-[#1A1D23]' : 'border-[#2A2D33] bg-[#0E1013]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#F5F3EE]">TIER 3: GITCOIN PASSPORT</span>
                {activeTier === 3 ? <StatusBadge variant="signal">PRIME</StatusBadge> : <StatusBadge variant="neutral">LOCKED</StatusBadge>}
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Sybil-resistant cryptographic proof of humanity.</p>
              <div className="space-y-1 text-xs font-mono border-t border-[#2A2D33] pt-2">
                <div className="flex justify-between"><span>Max Cap:</span><span className="text-[#F5F3EE]">$50,000</span></div>
                <div className="flex justify-between"><span>APR:</span><span className="text-[#F5F3EE]">5.0% - 8.0%</span></div>
              </div>
            </div>
          </div>

          {/* Inline Upgrade Drawers */}
          <div className="space-y-4 pt-2">
            {activeTier < 2 && <Tier2Verification />}
            {activeTier === 2 && <Tier3Verification />}
          </div>
        </TerminalPanel>

        {/* Active Loans Table */}
        <TerminalPanel
          header="ACTIVE LOANS LEDGER"
          badge={<StatusBadge variant="neutral">{loansData.total} TOTAL CONTRACTS</StatusBadge>}
          action={
            <Link href="/borrower/marketplace">
              <span className="text-xs font-mono text-[#C9A24B] hover:underline">
                Browse Marketplace →
              </span>
            </Link>
          }
        >
          {loansLoading ? (
            <div className="text-center py-10 text-xs font-mono text-[#6B7280]">
              QUERYING ON-CHAIN ESCROW DATA...
            </div>
          ) : loansError ? (
            <div className="p-4 bg-[#B23B3B]/10 border border-[#B23B3B]/40 rounded-[3px] text-xs font-mono text-[#e74c3c]">
              {loansError}
            </div>
          ) : loansData.loans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2A2D33] text-[#6B7280] font-mono">
                    <th className="py-2.5 px-3">LOAN IDENTIFIER</th>
                    <th className="py-2.5 px-3">PRINCIPAL</th>
                    <th className="py-2.5 px-3">DURATION</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">LENDER RECORD</th>
                    <th className="py-2.5 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2D33]">
                  {loansData.loans.map((loan) => (
                    <tr key={loan.loan_id} className="hover:bg-[#1A1D23] transition-colors">
                      <td className="py-3 px-3 font-mono text-[#F5F3EE]">
                        {loan.loan_id}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-[#F5F3EE] tabular-nums">
                        ${loan.principal}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6B7280]">
                        {loan.duration_days} days
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge variant={loan.status === 'Active' ? 'signal' : loan.status === 'Defaulted' ? 'brick' : 'brass'}>
                          {loan.status}
                        </StatusBadge>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6B7280]">
                        #{loan.lender_id}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href={`/borrower/loan/${loan.loan_id}`}>
                          <TerminalButton variant="outline" size="sm">
                            Inspect Escrow
                          </TerminalButton>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <StateBlueprintEmpty 
              title="No Active Micro-Loan Contracts"
              description="Your wallet identity has no active loans. Submit an under-collateralized loan proposal to tap into protocol liquidity."
              actionHref="/borrower/marketplace"
              actionLabel="Initiate Loan Request in Marketplace"
            />
          )}
        </TerminalPanel>

      </div>
    </div>
  );
}
