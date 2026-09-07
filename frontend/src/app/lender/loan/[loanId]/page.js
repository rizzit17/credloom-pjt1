'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Coins,
  Clock,
  Shield,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Activity,
  Percent,
  Award
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';

export default function LoanTracking({ params }) {
  const { loanId } = use(params);

  const [loanData, setLoanData] = useState({
    id: loanId,
    amount: '2000',
    interestRate: '10.0%',
    interestRateNumeric: 10,
    duration: '60 days',
    durationDays: 60,
    status: 'Active',
    startDate: '2026-01-15',
    deadline: '2026-03-16',
    disbursementDate: '2026-01-15',
    totalDue: '2200',
    amountRepaid: '800',
    remainingBalance: '1400',
    progress: 36,
    borrower: {
      creditScore: 750,
      scoreLabel: 'Prime Tier',
      tier: 'Silver',
      isAnonymous: true,
      repaymentHistory: '100% On-Time',
      previousLoans: 5,
      defaultRate: '0.0%'
    },
    insurance: {
      isInsured: true,
      provider: 'POOL-INS-001',
      coverage: '100%',
      premium: '50'
    },
    earnings: {
      totalInterest: '200',
      earnedSoFar: '72',
      projectedEarnings: '200',
      returnRate: '10.0%'
    },
    repaymentHistory: [
      {
        id: 'PAY-001',
        date: '2026-02-01',
        amount: '500',
        txHash: '0xabcd1234efgh5678',
        status: 'Confirmed'
      },
      {
        id: 'PAY-002',
        date: '2026-02-10',
        amount: '300',
        txHash: '0x9876fedc5432abcd',
        status: 'Confirmed'
      }
    ],
    timeline: [
      {
        date: '2026-01-15',
        event: 'Principal Disbursed',
        description: 'Ξ2000 transferred from escrow to borrower contract',
        completed: true
      },
      {
        date: '2026-02-01',
        event: 'Tranche Repayment #1',
        description: 'Ξ500 principal + interest settled on-chain',
        completed: true
      },
      {
        date: '2026-02-10',
        event: 'Tranche Repayment #2',
        description: 'Ξ300 principal + interest settled on-chain',
        completed: true
      },
      {
        date: '2026-03-16',
        event: 'Maturity Settlement',
        description: 'Ξ1400 balance due prior to default epoch',
        completed: false
      }
    ]
  });

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const deadline = new Date(loanData.deadline);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
        setIsOverdue(false);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [loanData.deadline]);

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
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb */}
        <Link
          href="/lender"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#F5F3EE] font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO PORTFOLIO OVERVIEW
        </Link>

        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2D33] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                LOAN NOTE MONITOR // CONTRACT {loanData.id}
              </span>
              <StatusBadge variant={getStatusVariant(loanData.status)} label={loanData.status.toUpperCase()} />
              {loanData.insurance.isInsured && (
                <StatusBadge variant="brass" label="POOL INSURED" />
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F3EE]">
              Note Specification & Yield Telemetry
            </h1>
          </div>

          {/* Countdown Clock */}
          {loanData.status === 'Active' && (
            <div className="p-3 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
              <span className="text-[10px] font-mono text-[#6B7280] block mb-0.5">
                MATURITY COUNTDOWN
              </span>
              <div className="text-sm md:text-base font-mono font-bold text-[#C9A24B]">
                {countdown.days}d : {String(countdown.hours).padStart(2, '0')}h : {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
              </div>
            </div>
          )}
        </div>

        {/* Default / Overdue Warning */}
        {(loanData.status === 'Overdue' || loanData.status === 'Defaulted') && (
          <TerminalPanel variant="brick">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#B23B3B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#B23B3B]">
                  Maturity Passed — Repayment Delinquent
                </h3>
                <p className="text-xs text-[#6B7280] font-mono mt-1">
                  {loanData.insurance.isInsured
                    ? `Protected by ${loanData.insurance.provider}. Insurance pool claim protocol eligible for autonomous payout trigger.`
                    : 'Uninsured note. Default penalties will escalate and borrower on-chain reputation score will be slashed.'}
                </p>
              </div>
            </div>
          </TerminalPanel>
        )}

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TerminalPanel subheader="PRINCIPAL COMMITTED">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
              Ξ{loanData.amount}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Originated: {loanData.startDate}
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="NOTE APR">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#C9A24B]">
              {loanData.interestRate}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Fixed rate schedule
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="EARNED YIELD">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#1B7A5A]">
              Ξ{loanData.earnings.earnedSoFar}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Of projected Ξ{loanData.earnings.projectedEarnings}
            </p>
          </TerminalPanel>

          <TerminalPanel subheader="REMAINING BALANCE">
            <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[#F5F3EE]">
              Ξ{loanData.remainingBalance}
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono mt-1">
              Maturity: {loanData.deadline}
            </p>
          </TerminalPanel>
        </div>

        {/* Amortization Progress */}
        <TerminalPanel title="Principal Amortization" subheader="ON-CHAIN RECOVERY PROGRESS">
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B7280]">Settled: Ξ{loanData.amountRepaid} ({loanData.progress}%)</span>
              <span className="text-[#C9A24B]">Remaining: Ξ{loanData.remainingBalance}</span>
            </div>
            <div className="h-2 bg-[#0E1013] border border-[#2A2D33] rounded-[2px] overflow-hidden">
              <div 
                className="h-full bg-[#1B7A5A] transition-all duration-500"
                style={{ width: `${loanData.progress}%` }}
              />
            </div>
          </div>
        </TerminalPanel>

        {/* Detailed Breakdown: Borrower Profile + Lifecycle Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Anonymized Borrower Assessment */}
          <TerminalPanel title="Underwriting Profile" subheader="PRIVACY-PRESERVED BORROWER TELEMETRY">
            <div className="space-y-3 mt-2">
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-[#6B7280]">AI Credit Score:</span>
                  <StatusBadge variant="signal" label={loanData.borrower.scoreLabel} />
                </div>
                <div className="text-2xl font-bold font-mono text-[#1B7A5A]">
                  {loanData.borrower.creditScore}
                </div>
              </div>

              <DataRow label="Verification Tier" value={loanData.borrower.tier} isMono={true} />
              <DataRow label="Historical Default Rate" value={loanData.borrower.defaultRate} isMono={true} valueColor="signal" />
              <DataRow label="Previous Completed Loans" value={loanData.borrower.previousLoans.toString()} isMono={true} />
              <DataRow label="Repayment Record" value={loanData.borrower.repaymentHistory} isMono={true} />
              <DataRow label="Identity Privacy" value="Zero-Knowledge Shielded" isMono={true} />
            </div>
          </TerminalPanel>

          {/* Lifecycle Stepper Timeline */}
          <TerminalPanel title="Contract Timeline" subheader="ON-CHAIN STATE TRANSITIONS">
            <div className="space-y-4 mt-3">
              {loanData.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx !== loanData.timeline.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-px bg-[#2A2D33]" />
                  )}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    step.completed 
                      ? 'bg-[#1B7A5A]/20 border-[#1B7A5A] text-[#1B7A5A]' 
                      : 'bg-[#0E1013] border-[#2A2D33] text-[#6B7280]'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className={`font-semibold ${step.completed ? 'text-[#F5F3EE]' : 'text-[#6B7280]'}`}>
                        {step.event}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">{step.date}</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>

        </div>

        {/* Repayment History Table */}
        <TerminalPanel title="Repayment Settlement Ledger" subheader="VERIFIED ON-CHAIN PAYMENTS">
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2D33] text-[11px] font-mono text-[#6B7280]">
                  <th className="py-2.5 px-3">TRANSACTION ID</th>
                  <th className="py-2.5 px-3">DATE</th>
                  <th className="py-2.5 px-3">AMOUNT</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">EXPLORER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D33] text-xs font-mono">
                {loanData.repaymentHistory.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-[#14171C]/80 transition-colors">
                    <td className="py-3 px-3 text-[#F5F3EE]">
                      {pmt.id}
                    </td>
                    <td className="py-3 px-3 text-[#6B7280]">
                      {pmt.date}
                    </td>
                    <td className="py-3 px-3 text-[#1B7A5A] font-semibold">
                      Ξ{pmt.amount}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge variant="signal" label={pmt.status} />
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={`https://etherscan.io/tx/${pmt.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C9A24B] hover:text-[#F5F3EE] inline-flex items-center gap-1"
                      >
                        {pmt.txHash.slice(0, 10)}... <ExternalLink className="w-3 h-3" />
                      </a>
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
