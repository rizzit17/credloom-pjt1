'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Coins,
  ExternalLink,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { createLoanOffer, isValidEthAddress, formatTxHash } from '@/lib/api/blockchain';
import TerminalPanel from '@/components/ui/TerminalPanel';
import TerminalButton from '@/components/ui/TerminalButton';
import StatusBadge from '@/components/ui/StatusBadge';

export default function EscrowFunding() {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    creditScore: '',
    lenderAddress: ''
  });

  const [transactionStatus, setTransactionStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [offerId, setOfferId] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Please enter a valid duration in days';
    }

    if (!formData.creditScore || parseFloat(formData.creditScore) < 0 || parseFloat(formData.creditScore) > 850) {
      newErrors.creditScore = 'Credit score must be between 0 and 850';
    }

    if (!formData.lenderAddress) {
      newErrors.lenderAddress = 'Please enter a valid lender address';
    } else if (!isValidEthAddress(formData.lenderAddress)) {
      newErrors.lenderAddress = 'Invalid Ethereum address format (0x + 40 hex characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setTransactionStatus('pending');
    setErrorMessage(null);

    try {
      const result = await createLoanOffer({
        lenderAddress: formData.lenderAddress,
        amountEth: parseFloat(formData.amount),
        durationDays: parseInt(formData.duration),
        minCreditScore: parseInt(formData.creditScore)
      });

      setTxHash(result.txHash);
      setOfferId(result.offerId);
      setTransactionStatus('confirmed');
      
      setTimeout(() => {
        setTransactionStatus(null);
        setTxHash(null);
        setOfferId(null);
        setFormData({
          amount: '',
          duration: '',
          creditScore: '',
          lenderAddress: ''
        });
      }, 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create loan offer');
      setTransactionStatus('error');
      
      setTimeout(() => {
        setTransactionStatus(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  if (transactionStatus === 'pending' || transactionStatus === 'confirmed' || transactionStatus === 'error') {
    return (
      <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full">
          <TerminalPanel variant={transactionStatus === 'confirmed' ? 'signal' : transactionStatus === 'error' ? 'brick' : 'default'}>
            <div className="text-center py-6">
              {transactionStatus === 'pending' && (
                <>
                  <Loader2 className="w-8 h-8 text-[#C9A24B] animate-spin mx-auto mb-4" />
                  <h2 className="text-lg font-bold font-mono text-[#F5F3EE] mb-1">
                    TRANSACTION IN FLIGHT
                  </h2>
                  <p className="text-xs text-[#6B7280] font-mono">
                    Broadcasting escrow commitment to smart contract pool...
                  </p>
                </>
              )}

              {transactionStatus === 'confirmed' && (
                <>
                  <CheckCircle2 className="w-8 h-8 text-[#1B7A5A] mx-auto mb-4" />
                  <h2 className="text-lg font-bold font-mono text-[#1B7A5A] mb-1">
                    ESCROW DEPOSIT CONFIRMED
                  </h2>
                  <p className="text-xs text-[#6B7280] font-mono mb-4">
                    Loan offer registered on-chain with assigned identifier.
                  </p>
                  
                  {offerId && (
                    <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] mb-3 text-left">
                      <span className="text-[10px] font-mono text-[#6B7280] block">OFFER IDENTIFIER</span>
                      <span className="text-sm font-mono font-bold text-[#1B7A5A]">#{offerId}</span>
                    </div>
                  )}

                  {txHash && (
                    <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-left">
                      <span className="text-[10px] font-mono text-[#6B7280] block">TX HASH</span>
                      <div className="flex items-center justify-between mt-1">
                        <code className="text-xs font-mono text-[#F5F3EE]">{formatTxHash(txHash, 10)}</code>
                        <a
                          href={`https://etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C9A24B] hover:text-[#F5F3EE] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-[#6B7280] font-mono mt-4">Resetting session view in 5 seconds...</p>
                </>
              )}

              {transactionStatus === 'error' && (
                <>
                  <AlertCircle className="w-8 h-8 text-[#B23B3B] mx-auto mb-4" />
                  <h2 className="text-lg font-bold font-mono text-[#B23B3B] mb-1">
                    EXECUTION REVERTED
                  </h2>
                  <p className="text-xs text-[#6B7280] font-mono mb-3">
                    {errorMessage || 'Escrow initialization failed on network layer.'}
                  </p>
                  <p className="text-[10px] text-[#6B7280] font-mono">Retrying in 5 seconds...</p>
                </>
              )}
            </div>
          </TerminalPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation */}
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
              ESCROW CAPITAL VAULT // POOL CONTRACT
            </span>
            <StatusBadge variant="signal" label="READY" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EE]">
            Escrow Provisioning
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Lock capital in the smart contract escrow to automatically fund matching borrower loans.
          </p>
        </div>

        {/* Main Panel */}
        <TerminalPanel title="Escrow Allocation Spec" subheader="CAPITAL COMMITMENT CONFIG">
          <div className="space-y-4 mt-3">
            
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                AMOUNT (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-mono text-[#6B7280]">
                  ETH
                </span>
              </div>
              {errors.amount && (
                <p className="text-[11px] text-[#B23B3B] font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                {['1', '5', '10'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleInputChange('amount', preset)}
                    className="px-2.5 py-1 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] text-[10px] font-mono text-[#6B7280] hover:text-[#F5F3EE] transition-colors"
                  >
                    Ξ{preset} ETH
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                DURATION (DAYS)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
              />
              {errors.duration && (
                <p className="text-[11px] text-[#B23B3B] font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.duration}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                {[
                  { value: '30', label: '30 Days' },
                  { value: '60', label: '60 Days' },
                  { value: '90', label: '90 Days' }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleInputChange('duration', preset.value)}
                    className="px-2.5 py-1 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] text-[10px] font-mono text-[#6B7280] hover:text-[#F5F3EE] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                MINIMUM CREDIT SCORE
              </label>
              <input
                type="number"
                min="0"
                max="850"
                value={formData.creditScore}
                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                placeholder="750"
                className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
              />
              {errors.creditScore && (
                <p className="text-[11px] text-[#B23B3B] font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.creditScore}
                </p>
              )}
              <p className="text-[10px] text-[#6B7280] font-mono">
                Threshold bound to GBR risk model verification.
              </p>
            </div>

            {/* Lender Wallet Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#6B7280]">
                LENDER ETHEREUM ADDRESS
              </label>
              <input
                type="text"
                value={formData.lenderAddress}
                onChange={(e) => handleInputChange('lenderAddress', e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors"
              />
              {errors.lenderAddress && (
                <p className="text-[11px] text-[#B23B3B] font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lenderAddress}
                </p>
              )}
            </div>

            {/* Action */}
            <div className="pt-2">
              <TerminalButton
                type="button"
                variant="brass"
                size="lg"
                fullWidth
                onClick={handleSubmit}
                disabled={!formData.amount || !formData.duration || !formData.creditScore || !formData.lenderAddress}
              >
                <Coins className="w-4 h-4" />
                Commit Capital To Escrow Contract
              </TerminalButton>
            </div>

          </div>
        </TerminalPanel>

      </div>
    </div>
  );
}
