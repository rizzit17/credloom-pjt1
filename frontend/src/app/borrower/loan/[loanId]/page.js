'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getBorrowerLoanDetail } from '@/lib/api/borrower';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';
import TerminalButton from '@/components/ui/TerminalButton';
import DataRow from '@/components/ui/DataRow';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Wallet, 
  Shield, 
  AlertCircle
} from 'lucide-react';

export default function LoanDetail({ params }) {
  const { loanId } = use(params);
  
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorStatus(null);
        
        const data = await getBorrowerLoanDetail(loanId);
        setLoanData(data);
      } catch (err) {
        console.error('[LoanDetail] Error fetching loan:', err);
        setError(err.message || 'Failed to fetch loan details');
        
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setErrorStatus(401);
        } else if (err.message?.includes('404') || err.message?.includes('Not Found')) {
          setErrorStatus(404);
        } else if (err.message?.includes('403') || err.message?.includes('Forbidden')) {
          setErrorStatus(403);
        } else {
          setErrorStatus(500);
        }
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoanData();
    }
  }, [loanId]);

  const handlePayLoan = async () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  const getBadgeVariant = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'repaid') return 'signal';
    if (s === 'defaulted') return 'brick';
    return 'brass';
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2D33]">
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#6B7280] hover:text-[#F5F3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO BORROWER CONSOLE
          </Link>
          <span className="text-xs font-mono text-[#6B7280]">
            ESCROW: LOANESCROW.SOL
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
            <div className="w-8 h-8 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-[#6B7280]">QUERYING ESCROW SMART CONTRACT...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 bg-[#14171C] border border-[#2A2D33] rounded-[4px] text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-[#e74c3c] mx-auto" />
            <h3 className="text-lg font-semibold text-[#e74c3c]">Escrow Query Error</h3>
            <p className="text-xs font-mono text-[#6B7280] max-w-md mx-auto">{error}</p>
            <div className="flex gap-3 justify-center pt-2">
              <TerminalButton onClick={() => window.location.reload()} variant="brass" size="sm">
                Retry Query
              </TerminalButton>
              <Link href="/borrower">
                <TerminalButton variant="outline" size="sm">
                  Back to Dashboard
                </TerminalButton>
              </Link>
            </div>
          </div>
        )}

        {/* Loan Details */}
        {!loading && !error && loanData && (
          <>
            {/* Smart Contract State Machine Stepper */}
            <div className="p-4 bg-[#14171C] border border-[#2A2D33] rounded-[4px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B7280]">ON-CHAIN LIFECYCLE</span>
                <StatusBadge variant={getBadgeVariant(loanData.status)}>
                  {loanData.status}
                </StatusBadge>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-[#0E1013] border border-[#2A2D33] text-[#6B7280]">
                  1. PROPOSED
                </div>
                <div className="p-2 bg-[#0E1013] border border-[#2A2D33] text-[#6B7280]">
                  2. PRE-FUNDED
                </div>
                <div className={`p-2 border ${
                  loanData.status?.toLowerCase() === 'active' 
                    ? 'bg-[#1B7A5A]/15 border-[#1B7A5A]/40 text-[#2ecc71]' 
                    : 'bg-[#0E1013] border-[#2A2D33] text-[#6B7280]'
                }`}>
                  3. DISBURSED
                </div>
                <div className={`p-2 border ${
                  paymentSuccess || loanData.status?.toLowerCase() === 'repaid'
                    ? 'bg-[#1B7A5A]/15 border-[#1B7A5A]/40 text-[#2ecc71]'
                    : loanData.status?.toLowerCase() === 'defaulted'
                    ? 'bg-[#B23B3B]/15 border-[#B23B3B]/40 text-[#e74c3c]'
                    : 'bg-[#0E1013] border-[#2A2D33] text-[#6B7280]'
                }`}>
                  4. SETTLED
                </div>
              </div>
            </div>

            {/* Core Ledger Data */}
            <TerminalPanel
              header="CONTRACT SPECIFICATION"
              badge={<StatusBadge variant="neutral">ID: {loanData.loan_id}</StatusBadge>}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-[#2A2D33]">
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                  <span className="text-[10px] text-[#6B7280] font-mono block">PRINCIPAL</span>
                  <span className="text-xl font-mono font-bold text-[#F5F3EE] tabular-nums">${loanData.principal}</span>
                </div>
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                  <span className="text-[10px] text-[#6B7280] font-mono block">DURATION</span>
                  <span className="text-xl font-mono font-bold text-[#F5F3EE] tabular-nums">{loanData.duration_days}d</span>
                </div>
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                  <span className="text-[10px] text-[#6B7280] font-mono block">BORROWER</span>
                  <span className="text-sm font-mono text-[#6B7280] truncate block mt-1">#{loanData.borrower_id}</span>
                </div>
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                  <span className="text-[10px] text-[#6B7280] font-mono block">LENDER</span>
                  <span className="text-sm font-mono text-[#6B7280] truncate block mt-1">#{loanData.lender_id}</span>
                </div>
              </div>

              <div className="pt-2">
                <DataRow label="Contract Escrow ID" value={loanData.loan_id} />
                <DataRow label="Enforcement Registry" value="ReputationRegistry.sol" />
                <DataRow label="Grace Period Window" value="7 Calendar Days" />
                <DataRow label="Repayment Status" value={paymentSuccess ? "SETTLED IN FULL" : loanData.status.toUpperCase()} highlight={paymentSuccess ? "signal" : "brass"} border={false} />
              </div>
            </TerminalPanel>

            {/* Repayment Action Interface */}
            <TerminalPanel
              header="REPAYMENT SETTLEMENT DISPATCH"
              badge={<StatusBadge variant={paymentSuccess ? 'signal' : 'brass'}>{paymentSuccess ? 'SETTLED' : 'DUE'}</StatusBadge>}
            >
              {!paymentSuccess ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Executing repayment transfers principal and accrued interest back to the lender escrow, increments your on-chain credit score, and releases loan obligations.
                  </p>
                  
                  <div className="flex items-center justify-between p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-xs font-mono">
                    <span className="text-[#6B7280]">ESTIMATED TOTAL DUE:</span>
                    <span className="text-base font-bold text-[#C9A24B] tabular-nums">${loanData.principal} USD</span>
                  </div>

                  <TerminalButton
                    onClick={handlePayLoan}
                    disabled={isPaying}
                    variant="brass"
                    size="md"
                    fullWidth
                  >
                    {isPaying ? "Broadcasting Settlement Proof..." : "Execute Loan Repayment"}
                  </TerminalButton>
                </div>
              ) : (
                <div className="p-4 bg-[#1B7A5A]/10 border border-[#1B7A5A]/40 rounded-[4px] text-center space-y-2">
                  <div className="text-sm font-mono font-bold text-[#2ecc71]">
                    REPAYMENT SETTLED ON-CHAIN
                  </div>
                  <p className="text-xs font-mono text-[#6B7280]">
                    Smart contract escrow released. Borrower credit rating positively compounded.
                  </p>
                  <div className="pt-2">
                    <Link href="/borrower">
                      <TerminalButton variant="outline" size="sm">
                        Return to Console
                      </TerminalButton>
                    </Link>
                  </div>
                </div>
              )}
            </TerminalPanel>
          </>
        )}
      </div>
    </div>
  );
}
