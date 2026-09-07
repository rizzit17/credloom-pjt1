'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Coins,
  Clock,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import TerminalButton from '@/components/ui/TerminalButton';
import StatusBadge from '@/components/ui/StatusBadge';

export default function CreateLoanOffer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const initialWalletAddress = typeof window !== 'undefined' ? localStorage.getItem('wallet') || '' : '';
  
  const [formData, setFormData] = useState({
    lenderAddress: initialWalletAddress,
    amountEth: '',
    durationDays: '30',
    minCreditScore: '650'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      const walletAddress = formData.lenderAddress;
      setFormData({
        lenderAddress: walletAddress,
        amountEth: '',
        durationDays: '30',
        minCreditScore: '650'
      });

      setTimeout(() => {
        window.location.href = '/lender';
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <Link
          href="/lender"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#F5F3EE] font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO LENDER TERMINAL
        </Link>

        {/* Header */}
        <div className="border-b border-[#2A2D33] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
              SMART CONTRACT SPECIFICATION
            </span>
            <StatusBadge variant="brass" label="PARAMETER ENCODING" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EE]">
            Configure Liquidity Offer
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Define automated matching constraints for incoming borrower loan requests.
          </p>
        </div>

        {/* Success Feedback */}
        {success && (
          <TerminalPanel variant="signal">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#1B7A5A] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B7A5A]">
                  Offer Contract Parameters Encoded Successfully
                </h3>
                <p className="text-xs text-[#6B7280] font-mono mt-1">
                  Liquidity pool commitment committed to on-chain matching registry. Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            </div>
          </TerminalPanel>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Lender Address */}
          <TerminalPanel title="Underwriting Account" subheader="VERIFIED WALLET IDENTITY">
            <div className="mt-2 space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                WALLET ADDRESS (ETH)
              </label>
              <input
                type="text"
                value={formData.lenderAddress}
                readOnly
                placeholder="0x..."
                className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-xs font-mono text-[#6B7280] cursor-not-allowed outline-none"
                disabled
              />
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#1B7A5A] pt-1">
                <CheckCircle2 className="w-3 h-3" />
                Session wallet validated & bound to transaction context
              </div>
            </div>
          </TerminalPanel>

          {/* Allocation & Tenor */}
          <TerminalPanel title="Exposure Parameters" subheader="CAPITAL COMMITMENT & TENOR">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  LOAN AMOUNT (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amountEth}
                    onChange={(e) => setFormData({ ...formData, amountEth: e.target.value })}
                    placeholder="5.0"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-mono text-[#6B7280]">
                    ETH
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] font-mono">
                  Principal allocated from escrow vault
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  DURATION (DAYS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    placeholder="30"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-mono text-[#6B7280]">
                    DAYS
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] font-mono">
                  Standard repayment window
                </p>
              </div>
            </div>
          </TerminalPanel>

          {/* Risk Hurdle */}
          <TerminalPanel title="Underwriting Hurdle" subheader="AI RISK MODEL FILTER">
            <div className="mt-2 space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                MINIMUM CREDIT SCORE REQUIRED (300 - 850)
              </label>
              <input
                type="number"
                required
                min="300"
                max="850"
                value={formData.minCreditScore}
                onChange={(e) => setFormData({ ...formData, minCreditScore: e.target.value })}
                placeholder="650"
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
              />
              <p className="text-[10px] text-[#6B7280] font-mono">
                Borrowers below this score will be excluded by the autonomous escrow dispatcher.
              </p>
            </div>
          </TerminalPanel>

          {/* Submit CTA */}
          <TerminalButton
            type="submit"
            variant="brass"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Broadcasting Offer To Registry...
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                Deploy Loan Offer To Registry
              </>
            )}
          </TerminalButton>

        </form>

      </div>
    </div>
  );
}
