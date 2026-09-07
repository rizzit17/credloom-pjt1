'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Sliders,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Activity,
  ArrowUpRight,
  PieChart,
  Layers
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';
import StateBlueprintEmpty from '@/components/ui/StateBlueprintEmpty';

export default function LenderDashboard() {
  const [dashboardData, setDashboardData] = useState({
    wallet: {
      address: '0x89a7F2b1c3D4e5f6A7B8C9d0E1f2',
      escrowBalance: '15000',
      availableBalance: '8000',
      lockedBalance: '7000',
      nativeBalance: '5.2'
    },
    stats: {
      totalLent: '45000',
      activeLoans: 12,
      totalEarnings: '4250',
      averageReturn: '9.4',
      portfolioValue: '52250'
    },
    riskConfig: {
      isConfigured: true,
      minCreditScore: 650,
      maxCreditScore: 900,
      minLoanAmount: 500,
      maxLoanAmount: 5000,
      preferredDurations: [30, 60, 90],
      interestRates: {
        excellent: 8,
        good: 10,
        fair: 12
      },
      autoLending: true
    },
    recentLoans: [
      {
        id: 'LOAN-L001',
        amount: '2000',
        interestRate: '10.0%',
        duration: '60d',
        status: 'Active',
        startDate: '2026-01-15',
        deadline: '2026-03-16',
        amountRepaid: '800',
        totalDue: '2200',
        progress: 36,
        borrowerScore: 750,
        isInsured: true
      },
      {
        id: 'LOAN-L002',
        amount: '1500',
        interestRate: '8.0%',
        duration: '30d',
        status: 'Active',
        startDate: '2026-02-01',
        deadline: '2026-03-03',
        amountRepaid: '500',
        totalDue: '1620',
        progress: 31,
        borrowerScore: 820,
        isInsured: false
      },
      {
        id: 'LOAN-L003',
        amount: '3000',
        interestRate: '12.0%',
        duration: '90d',
        status: 'Active',
        startDate: '2026-01-01',
        deadline: '2026-04-01',
        amountRepaid: '1200',
        totalDue: '3360',
        progress: 36,
        borrowerScore: 680,
        isInsured: true
      }
    ],
    performanceHistory: {
      thisMonth: {
        loansIssued: 5,
        earnings: '450',
        change: '+12%'
      },
      lastMonth: {
        loansIssued: 4,
        earnings: '380',
        change: '+8%'
      }
    }
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'signal';
      case 'Repaid': return 'signal';
      case 'Overdue': return 'brick';
      case 'Defaulted': return 'brick';
      default: return 'neutral';
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Ledger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2D33] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-wider text-[#6B7280] uppercase">
                CAPITAL POOL PROTOCOL // DESK L-01
              </span>
              <StatusBadge variant="signal" label="NODE ACTIVE" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              Liquidity Provision Terminal
            </h1>
            <p className="text-xs text-[#6B7280] font-mono mt-1">
              WALLET: {dashboardData.wallet.address}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/lender/escrow">
              <TerminalButton variant="outline" size="sm">
                <Wallet className="w-3.5 h-3.5" />
                Manage Escrow Vault
              </TerminalButton>
            </Link>
            <Link href="/lender/configure">
              <TerminalButton variant="brass" size="sm">
                <Sliders className="w-3.5 h-3.5" />
                Configure Risk Engine
              </TerminalButton>
            </Link>
          </div>
        </div>

        {/* Primary Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <TerminalPanel subheader="ESCROW BALANCE">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
                Ξ{dashboardData.wallet.escrowBalance}
              </div>
              <div className="mt-2 pt-2 border-t border-[#2A2D33] space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Available:</span>
                  <span className="text-[#1B7A5A]">Ξ{dashboardData.wallet.availableBalance}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Locked:</span>
                  <span className="text-[#C9A24B]">Ξ{dashboardData.wallet.lockedBalance}</span>
                </div>
              </div>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="LIFETIME LENT">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
                Ξ{dashboardData.stats.totalLent}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                Settled across 18 notes
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="ACTIVE NOTES">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#C9A24B]">
                {dashboardData.stats.activeLoans}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                100% On-Chain Escrowed
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="CUMULATIVE YIELD">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#1B7A5A]">
                Ξ{dashboardData.stats.totalEarnings}
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                +Ξ450 this billing cycle
              </p>
            </div>
          </TerminalPanel>

          <TerminalPanel subheader="WEIGHTED APR">
            <div className="mt-1">
              <div className="text-xl md:text-2xl font-bold font-mono text-[#C9A24B]">
                {dashboardData.stats.averageReturn}%
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-2 pt-2 border-t border-[#2A2D33]">
                Risk-adjusted net margin
              </p>
            </div>
          </TerminalPanel>
        </div>

        {/* Risk Configuration State Indicator */}
        <TerminalPanel>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#1B7A5A]/10 border border-[#1B7A5A]/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#1B7A5A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#F5F3EE]">
                    Autonomous Matching Engine: Active
                  </h3>
                  <StatusBadge variant="signal" label="MONITORING" />
                </div>
                <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                  Score Filter: [{dashboardData.riskConfig.minCreditScore} - {dashboardData.riskConfig.maxCreditScore}] • Exposure: [Ξ{dashboardData.riskConfig.minLoanAmount} - Ξ{dashboardData.riskConfig.maxLoanAmount}] • Auto-Deploy: {dashboardData.riskConfig.autoLending ? 'ON' : 'OFF'}
                </p>
              </div>
            </div>
            <Link href="/lender/configure">
              <TerminalButton variant="outline" size="sm">
                Adjust Criteria
              </TerminalButton>
            </Link>
          </div>
        </TerminalPanel>

        {/* Dual Column: Performance & Active Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Loans Table Ledger (2 Cols) */}
          <div className="lg:col-span-2">
            <TerminalPanel title="Active Underwritten Notes" subheader="ON-CHAIN LOAN CONTRACTS">
              {dashboardData.recentLoans.length > 0 ? (
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#2A2D33] text-[11px] font-mono text-[#6B7280]">
                        <th className="py-2.5 px-3">NOTE ID</th>
                        <th className="py-2.5 px-3">PRINCIPAL</th>
                        <th className="py-2.5 px-3">RATE</th>
                        <th className="py-2.5 px-3">TENOR</th>
                        <th className="py-2.5 px-3">SCORE</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">AMORTIZATION</th>
                        <th className="py-2.5 px-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2D33] text-xs font-mono">
                      {dashboardData.recentLoans.map((loan) => (
                        <tr 
                          key={loan.id} 
                          className="hover:bg-[#14171C]/80 transition-colors group cursor-pointer"
                          onClick={() => window.location.href = `/lender/loan/${loan.id}`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-medium text-[#F5F3EE]">
                              {loan.id}
                              {loan.isInsured && (
                                <Shield className="w-3 h-3 text-[#1B7A5A]" title="Insured Note" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#F5F3EE] font-semibold">
                            Ξ{loan.amount}
                          </td>
                          <td className="py-3 px-3 text-[#C9A24B]">
                            {loan.interestRate}
                          </td>
                          <td className="py-3 px-3 text-[#6B7280]">
                            {loan.duration}
                          </td>
                          <td className="py-3 px-3">
                            <span className={loan.borrowerScore >= 750 ? 'text-[#1B7A5A]' : 'text-[#C9A24B]'}>
                              {loan.borrowerScore}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge 
                              variant={getStatusVariant(loan.status)} 
                              label={loan.status} 
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="w-24">
                              <div className="flex justify-between text-[10px] text-[#6B7280] mb-1">
                                <span>{loan.progress}%</span>
                                <span>Ξ{loan.amountRepaid}</span>
                              </div>
                              <div className="h-1 bg-[#2A2D33] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#1B7A5A]" 
                                  style={{ width: `${loan.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#F5F3EE] transition-colors inline-block" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <StateBlueprintEmpty
                  title="No Active Underwritten Notes"
                  description="Your escrow balance is idle. Allocate capital or configure auto-matching rules to begin funding prime borrowers."
                  actionHref="/lender/configure"
                  actionLabel="Configure Matching Parameters"
                />
              )}
            </TerminalPanel>
          </div>

          {/* Performance Telemetry (1 Col) */}
          <div className="space-y-4">
            <TerminalPanel title="Yield Ledger" subheader="MONTHLY CYCLE REVENUE">
              <div className="space-y-3 mt-2">
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-[#6B7280]">Current Period:</span>
                    <span className="text-[#1B7A5A] flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> {dashboardData.performanceHistory.thisMonth.change}
                    </span>
                  </div>
                  <div className="text-xl font-bold font-mono text-[#F5F3EE]">
                    Ξ{dashboardData.performanceHistory.thisMonth.earnings}
                  </div>
                  <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                    {dashboardData.performanceHistory.thisMonth.loansIssued} notes funded this month
                  </div>
                </div>

                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-[#6B7280]">Previous Period:</span>
                    <span className="text-[#6B7280]">Settled</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-[#6B7280]">
                    Ξ{dashboardData.performanceHistory.lastMonth.earnings}
                  </div>
                  <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                    {dashboardData.performanceHistory.lastMonth.loansIssued} notes completed
                  </div>
                </div>

                <div className="pt-2">
                  <DataRow 
                    label="Insurance Coverage Rate" 
                    value="66.7%" 
                    isMono={true} 
                  />
                  <DataRow 
                    label="Historical Default Rate" 
                    value="0.0%" 
                    isMono={true} 
                    valueColor="signal" 
                  />
                  <DataRow 
                    label="Average Tenor" 
                    value="60.0 Days" 
                    isMono={true} 
                  />
                </div>
              </div>
            </TerminalPanel>
          </div>

        </div>

      </div>
    </div>
  );
}
