'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield,
  Coins,
  TrendingUp,
  AlertCircle,
  Activity,
  Users,
  BarChart3,
  Sliders,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Wallet,
  ChevronRight
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';

export default function InsurerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    wallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      balance: '125000',
      network: 'Ethereum Mainnet'
    },
    poolStats: {
      totalCapital: '500000',
      deployedCapital: '280000',
      availableCapital: '220000',
      utilizationRate: '56.0%'
    },
    overview: {
      activePolicies: 45,
      totalPremiumIncome: '18500',
      claimsProcessed: 8,
      claimsPaid: '12000',
      averagePremium: '411',
      riskScore: 'Low Risk'
    },
    performance: {
      thisMonth: {
        premiums: '5200',
        claims: '2400',
        netIncome: '2800',
        newPolicies: 12
      },
      lastMonth: {
        premiums: '4800',
        claims: '1800',
        netIncome: '3000',
        newPolicies: 10
      }
    },
    activePolicies: [
      {
        policyId: 'POL-001',
        loanId: 'LOAN-001',
        borrowerTier: 'Gold',
        creditScore: 780,
        loanAmount: '5000',
        coverage: '100%',
        premium: '150',
        status: 'Active',
        startDate: '2026-01-15',
        expiryDate: '2026-04-15',
        riskLevel: 'Low'
      },
      {
        policyId: 'POL-002',
        loanId: 'LOAN-002',
        borrowerTier: 'Silver',
        creditScore: 650,
        loanAmount: '3000',
        coverage: '100%',
        premium: '120',
        status: 'Active',
        startDate: '2026-01-20',
        expiryDate: '2026-03-21',
        riskLevel: 'Medium'
      },
      {
        policyId: 'POL-003',
        loanId: 'LOAN-003',
        borrowerTier: 'Bronze',
        creditScore: 580,
        loanAmount: '2000',
        coverage: '80%',
        premium: '100',
        status: 'Active',
        startDate: '2026-02-01',
        expiryDate: '2026-04-02',
        riskLevel: 'High'
      },
      {
        policyId: 'POL-004',
        loanId: 'LOAN-004',
        borrowerTier: 'Gold',
        creditScore: 820,
        loanAmount: '4500',
        coverage: '100%',
        premium: '135',
        status: 'Active',
        startDate: '2026-02-05',
        expiryDate: '2026-05-05',
        riskLevel: 'Low'
      },
      {
        policyId: 'POL-005',
        loanId: 'LOAN-005',
        borrowerTier: 'Silver',
        creditScore: 690,
        loanAmount: '3500',
        coverage: '100%',
        premium: '140',
        status: 'Active',
        startDate: '2026-02-10',
        expiryDate: '2026-04-11',
        riskLevel: 'Medium'
      }
    ],
    recentClaims: [
      {
        claimId: 'CLM-001',
        policyId: 'POL-023',
        loanAmount: '2500',
        claimAmount: '2500',
        status: 'Approved',
        submittedDate: '2026-02-10',
        processedDate: '2026-02-12',
        reason: 'Default Escalation'
      },
      {
        claimId: 'CLM-002',
        policyId: 'POL-018',
        loanAmount: '1800',
        claimAmount: '1800',
        status: 'Pending',
        submittedDate: '2026-02-13',
        processedDate: null,
        reason: 'Delinquency Review'
      },
      {
        claimId: 'CLM-003',
        policyId: 'POL-025',
        loanAmount: '3200',
        claimAmount: '3200',
        status: 'Approved',
        submittedDate: '2026-02-08',
        processedDate: '2026-02-09',
        reason: 'Escrow Liquidation'
      }
    ]
  });

  const getRiskVariant = (risk) => {
    switch (risk) {
      case 'Low': return 'signal';
      case 'Medium': return 'brass';
      case 'High': return 'brick';
      default: return 'neutral';
    }
  };

  const getClaimStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'signal';
      case 'Pending': return 'brass';
      case 'Denied': return 'brick';
      default: return 'neutral';
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2D33] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-wider text-[#6B7280] uppercase">
                INSURANCE UNDERWRITING POOL // CONTRACT INS-MAIN
              </span>
              <StatusBadge variant="signal" label="SOLVENCY VERIFIED" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              Underwriting Capital Desk
            </h1>
            <p className="text-xs text-[#6B7280] font-mono mt-1">
              OPERATOR WALLET: {dashboardData.wallet.address}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/insurer/premiums">
              <TerminalButton variant="outline" size="sm">
                <Coins className="w-3.5 h-3.5" />
                Premium Ledger
              </TerminalButton>
            </Link>
            <Link href="/insurer/configure">
              <TerminalButton variant="brass" size="sm">
                <Sliders className="w-3.5 h-3.5" />
                Underwriting Parameters
              </TerminalButton>
            </Link>
          </div>
        </div>

        {/* Primary Capital Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <TerminalPanel subheader="TOTAL CAPITAL POOL">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
                Ξ{dashboardData.poolStats.totalCapital}
              </div>
              <div className="mt-2 pt-2 border-t border-[#2A2D33] space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Available:</span>
                  <span className="text-[#1B7A5A]">Ξ{dashboardData.poolStats.availableCapital}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Deployed:</span>
                  <span className="text-[#C9A24B]">Ξ{dashboardData.poolStats.deployedCapital}</span>
                </div>
              </div>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="UTILIZATION RATIO">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#C9A24B]">
                {dashboardData.poolStats.utilizationRate}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                Within target safe band (≤70%)
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="ACTIVE POLICIES">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
                {dashboardData.overview.activePolicies}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                Micro-lending notes covered
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="PREMIUM REVENUE">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#1B7A5A]">
                Ξ{dashboardData.overview.totalPremiumIncome}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                +Ξ5,200 this period
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="NET CLAIMS PAID">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#B23B3B]">
                Ξ{dashboardData.overview.claimsPaid}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                8 claims settled fully
              </p>
            </div>
          </TerminalPanel>
        </div>

        {/* Underwriting Policies Ledger & Claims Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Policies Table (2 Cols) */}
          <div className="lg:col-span-2">
            <TerminalPanel title="Underwritten Policy Inventory" subheader="LIVE COVERAGE CONTRACTS">
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2A2D33] text-[11px] font-mono text-[#6B7280]">
                      <th className="py-2.5 px-3">POLICY ID</th>
                      <th className="py-2.5 px-3">LOAN ID</th>
                      <th className="py-2.5 px-3">COVERAGE</th>
                      <th className="py-2.5 px-3">PREMIUM</th>
                      <th className="py-2.5 px-3">SCORE</th>
                      <th className="py-2.5 px-3">RISK</th>
                      <th className="py-2.5 px-3">EXPIRY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2D33] text-xs font-mono">
                    {dashboardData.activePolicies.map((pol) => (
                      <tr key={pol.policyId} className="hover:bg-[#14171C]/80 transition-colors">
                        <td className="py-3 px-3 text-[#F5F3EE] font-medium">
                          {pol.policyId}
                        </td>
                        <td className="py-3 px-3 text-[#6B7280]">
                          {pol.loanId}
                        </td>
                        <td className="py-3 px-3 text-[#F5F3EE]">
                          Ξ{pol.loanAmount} ({pol.coverage})
                        </td>
                        <td className="py-3 px-3 text-[#1B7A5A] font-semibold">
                          Ξ{pol.premium}
                        </td>
                        <td className="py-3 px-3">
                          <span className={pol.creditScore >= 700 ? 'text-[#1B7A5A]' : 'text-[#C9A24B]'}>
                            {pol.creditScore}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge variant={getRiskVariant(pol.riskLevel)} label={pol.riskLevel} />
                        </td>
                        <td className="py-3 px-3 text-[#6B7280]">
                          {pol.expiryDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TerminalPanel>
          </div>

          {/* Claims Queue (1 Col) */}
          <div className="space-y-4">
            <TerminalPanel title="Claims Settlement Queue" subheader="ON-CHAIN RECOVERY ORACLES">
              <div className="space-y-3 mt-2">
                {dashboardData.recentClaims.map((claim) => (
                  <div key={claim.claimId} className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-[#F5F3EE] font-semibold">{claim.claimId}</span>
                      <StatusBadge variant={getClaimStatusVariant(claim.status)} label={claim.status} />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-[#6B7280] mt-1">
                      <span>Reason: {claim.reason}</span>
                      <span className="text-[#B23B3B] font-semibold">Ξ{claim.claimAmount}</span>
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-mono mt-1 pt-1 border-t border-[#2A2D33]">
                      Submitted: {claim.submittedDate} {claim.processedDate ? `• Settled: ${claim.processedDate}` : '• In Verification'}
                    </div>
                  </div>
                ))}
              </div>
            </TerminalPanel>

            <TerminalPanel title="Reserve Telemetry" subheader="SOLVENCY MODEL">
              <div className="space-y-2 mt-2">
                <DataRow label="Minimum Reserve Ratio" value="20.0%" isMono={true} />
                <DataRow label="Current Reserve Ratio" value="44.0%" isMono={true} valueColor="signal" />
                <DataRow label="Max Exposure / Borrower" value="Ξ15,000" isMono={true} />
                <DataRow label="Simultaneous Claims Cap" value="3 Incidents" isMono={true} />
              </div>
            </TerminalPanel>
          </div>

        </div>

      </div>
    </div>
  );
}
