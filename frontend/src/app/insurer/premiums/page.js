'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Coins,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Search,
  ExternalLink,
  Award,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import TerminalButton from '@/components/ui/TerminalButton';
import StatusBadge from '@/components/ui/StatusBadge';
import DataRow from '@/components/ui/DataRow';

export default function PremiumTracking() {
  const [premiumData, setPremiumData] = useState({
    summary: {
      totalCollected: '45000',
      totalPending: '3800',
      totalOverdue: '1200',
      currentMonth: '8500',
      lastMonth: '7200',
      percentChange: '+18.1%',
      activePolicies: 48,
      averagePremium: '156'
    },
    premiums: [
      {
        id: 'POL-001',
        policyId: 'POL-001',
        loanId: 'LOAN-1234',
        borrowerTier: 'Gold',
        creditScore: 780,
        loanAmount: '5000',
        premiumAmount: '150',
        premiumRate: '3.0%',
        status: 'Collected',
        collectionDate: '2026-02-10',
        dueDate: '2026-02-05',
        txHash: '0xabcd1234efgh5678',
        lenderAddress: '0x1234...5678',
        duration: '90d'
      },
      {
        id: 'POL-002',
        policyId: 'POL-002',
        loanId: 'LOAN-1235',
        borrowerTier: 'Silver',
        creditScore: 720,
        loanAmount: '3000',
        premiumAmount: '180',
        premiumRate: '6.0%',
        status: 'Collected',
        collectionDate: '2026-02-12',
        dueDate: '2026-02-08',
        txHash: '0x9876fedc5432abcd',
        lenderAddress: '0x9876...4321',
        duration: '60d'
      },
      {
        id: 'POL-003',
        policyId: 'POL-003',
        loanId: 'LOAN-1236',
        borrowerTier: 'Bronze',
        creditScore: 650,
        loanAmount: '2000',
        premiumAmount: '200',
        premiumRate: '10.0%',
        status: 'Pending',
        collectionDate: null,
        dueDate: '2026-02-16',
        txHash: null,
        lenderAddress: '0x5555...6666',
        duration: '30d'
      },
      {
        id: 'POL-004',
        policyId: 'POL-004',
        loanId: 'LOAN-1237',
        borrowerTier: 'Silver',
        creditScore: 700,
        loanAmount: '4500',
        premiumAmount: '270',
        premiumRate: '6.0%',
        status: 'Pending',
        collectionDate: null,
        dueDate: '2026-02-17',
        txHash: null,
        lenderAddress: '0x7777...8888',
        duration: '60d'
      },
      {
        id: 'POL-005',
        policyId: 'POL-005',
        loanId: 'LOAN-1238',
        borrowerTier: 'Bronze',
        creditScore: 620,
        loanAmount: '1500',
        premiumAmount: '150',
        premiumRate: '10.0%',
        status: 'Overdue',
        collectionDate: null,
        dueDate: '2026-02-10',
        txHash: null,
        lenderAddress: '0x2222...3333',
        duration: '30d'
      },
      {
        id: 'POL-006',
        policyId: 'POL-006',
        loanId: 'LOAN-1239',
        borrowerTier: 'Gold',
        creditScore: 810,
        loanAmount: '10000',
        premiumAmount: '300',
        premiumRate: '3.0%',
        status: 'Collected',
        collectionDate: '2026-02-08',
        dueDate: '2026-02-05',
        txHash: '0xdef4567890abcdef',
        lenderAddress: '0x4444...5555',
        duration: '90d'
      }
    ],
    analytics: {
      premiumsByMonth: [
        { month: 'Aug 2025', amount: 4200 },
        { month: 'Sep 2025', amount: 5100 },
        { month: 'Oct 2025', amount: 4800 },
        { month: 'Nov 2025', amount: 6200 },
        { month: 'Dec 2025', amount: 5900 },
        { month: 'Jan 2026', amount: 7200 },
        { month: 'Feb 2026', amount: 8500 }
      ],
      premiumsByTier: [
        { tier: 'Gold', count: 22, total: 15400, avgPremium: 140 },
        { tier: 'Silver', count: 18, total: 18900, avgPremium: 175 },
        { tier: 'Bronze', count: 8, total: 10700, avgPremium: 215 }
      ]
    }
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Collected': return 'signal';
      case 'Pending': return 'brass';
      case 'Overdue': return 'brick';
      default: return 'neutral';
    }
  };

  const filteredPremiums = premiumData.premiums
    .filter(premium => {
      if (filterStatus !== 'All' && premium.status !== filterStatus) return false;
      if (searchQuery && !premium.loanId.toLowerCase().includes(searchQuery.toLowerCase()) 
        && !premium.policyId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'amount') {
        return parseFloat(b.premiumAmount) - parseFloat(a.premiumAmount);
      }
      return 0;
    });

  const handleExportData = () => {
    console.log('Exporting premium data...');
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link
          href="/insurer"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#F5F3EE] font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO CAPITAL DESK
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2D33] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                PREMIUM REVENUE INGESTION // LEDGER V2
              </span>
              <StatusBadge variant="signal" label="SYNCED" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              Insurance Premium Ingestion Ledger
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Tracking real-time 100 bps protocol fee collections and underwriter premium distributions.
            </p>
          </div>

          <TerminalButton
            variant="outline"
            size="sm"
            onClick={handleExportData}
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger (CSV)
          </TerminalButton>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TerminalPanel subheader="TOTAL INGESTED">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#1B7A5A]">
              Ξ{premiumData.summary.totalCollected}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Cumulative lifetime
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="PENDING RECOVERY">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#C9A24B]">
              Ξ{premiumData.summary.totalPending}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Awaiting maturity epoch
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="OVERDUE PREMIUM">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#B23B3B]">
              Ξ{premiumData.summary.totalOverdue}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Escalation triggered
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="CURRENT RUN-RATE">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
              Ξ{premiumData.summary.currentMonth}
            </div>
            <p className="text-[10px] text-[#1B7A5A] font-mono mt-1">
              {premiumData.summary.percentChange} vs previous epoch
            </p>
          </TerminalPanel>
        </div>

        {/* Analytics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <TerminalPanel title="Collection Trend" subheader="HISTORICAL PREMIUM INGESTION">
            <div className="space-y-3 mt-3">
              {premiumData.analytics.premiumsByMonth.map((data, index) => {
                const maxAmount = Math.max(...premiumData.analytics.premiumsByMonth.map(d => d.amount));
                const percentage = (data.amount / maxAmount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#6B7280]">{data.month}</span>
                      <span className="font-semibold text-[#F5F3EE]">Ξ{data.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0E1013] border border-[#2A2D33] rounded-[2px] overflow-hidden">
                      <div 
                        className="h-full bg-[#1B7A5A] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TerminalPanel>

          <TerminalPanel title="Exposure by Risk Classification" subheader="TIER COMPOSITION">
            <div className="space-y-3 mt-3">
              {premiumData.analytics.premiumsByTier.map((tier, index) => (
                <div key={index} className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        variant={tier.tier === 'Gold' ? 'signal' : tier.tier === 'Silver' ? 'brass' : 'brick'} 
                        label={tier.tier.toUpperCase()} 
                      />
                      <span className="text-[#6B7280]">{tier.count} notes</span>
                    </div>
                    <span className="text-[#F5F3EE] font-bold">Ξ{tier.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#6B7280] pt-1 border-t border-[#2A2D33]">
                    <span>Avg Fee / Note:</span>
                    <span className="text-[#C9A24B]">Ξ{tier.avgPremium}</span>
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>

        </div>

        {/* Filter Toolbar & Table */}
        <TerminalPanel title="Policy Premium Distribution" subheader="INGESTION TRANSACTIONS">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-2 mb-4 pb-3 border-b border-[#2A2D33]">
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Policy or Note ID..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex border border-[#2A2D33] rounded-[4px] overflow-hidden">
                {['All', 'Collected', 'Pending', 'Overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-xs font-mono transition-colors ${
                      filterStatus === status 
                        ? 'bg-[#C9A24B] text-[#0E1013] font-semibold' 
                        : 'bg-[#0E1013] text-[#6B7280] hover:text-[#F5F3EE]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2D33] text-[11px] font-mono text-[#6B7280]">
                  <th className="py-2.5 px-3">POLICY ID</th>
                  <th className="py-2.5 px-3">NOTE ID</th>
                  <th className="py-2.5 px-3">TIER</th>
                  <th className="py-2.5 px-3">PREMIUM (ETH)</th>
                  <th className="py-2.5 px-3">RATE</th>
                  <th className="py-2.5 px-3">DUE DATE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">SETTLEMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D33] text-xs font-mono">
                {filteredPremiums.map((p) => (
                  <tr key={p.id} className="hover:bg-[#14171C]/80 transition-colors">
                    <td className="py-3 px-3 text-[#F5F3EE] font-medium">
                      {p.policyId}
                    </td>
                    <td className="py-3 px-3 text-[#6B7280]">
                      {p.loanId}
                    </td>
                    <td className="py-3 px-3">
                      <span className={p.borrowerTier === 'Gold' ? 'text-[#C9A24B]' : 'text-[#6B7280]'}>
                        {p.borrowerTier} ({p.creditScore})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#1B7A5A] font-semibold">
                      Ξ{p.premiumAmount}
                    </td>
                    <td className="py-3 px-3 text-[#6B7280]">
                      {p.premiumRate}
                    </td>
                    <td className="py-3 px-3 text-[#6B7280]">
                      {p.dueDate}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge variant={getStatusVariant(p.status)} label={p.status} />
                    </td>
                    <td className="py-3 px-3">
                      {p.txHash ? (
                        <a
                          href={`https://etherscan.io/tx/${p.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C9A24B] hover:text-[#F5F3EE] inline-flex items-center gap-1"
                        >
                          {p.txHash.slice(0, 10)}... <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[#6B7280]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalPanel>

      </div>
    </div>
  );
}
