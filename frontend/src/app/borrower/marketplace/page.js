'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { requestLoan, selectLoan, getInterestRate } from '@/lib/api/borrower';
import { getUserId, getWallet } from '@/lib/api/auth';
import { getActiveOffers, acceptLoanOffer, checkBorrowerFlagged, formatTxHash } from '@/lib/api/blockchain';
import { 
  Search, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Filter,
  ArrowLeft,
  Coins,
  Percent,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function LoanMarketplace() {
  const { user, tierStatus } = useAuth();
  
  // Borrower data from API
  const [borrowerData, setBorrowerData] = useState(null);
  const [interestRateData, setInterestRateData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Blockchain offers
  const [blockchainOffers, setBlockchainOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [borrowerWallet, setBorrowerWallet] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [loanId, setLoanId] = useState(null);

  // Form state
  const [loanAmount, setLoanAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState(null); // Store full option object
  const [selectedLender, setSelectedLender] = useState(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'confirmed', 'error'

  // Mock lender data - will be populated by API
  const [lenders, setLenders] = useState([]);

  // Filter state
  const [filterInsuredOnly, setFilterInsuredOnly] = useState(false);
  const [filterMaxDuration, setFilterMaxDuration] = useState(null);

  // Load blockchain offers on component mount
  useEffect(() => {
    fetchBlockchainOffers();
    
    // Get borrower wallet if user is logged in
    if (user) {
      loadBorrowerWallet();
    }
  }, [user]);

  const loadBorrowerWallet = async () => {
    try {
      const wallet = await getWallet();
      setBorrowerWallet(wallet);
      
      // Skip flagged check for now - requires checksummed addresses
      // TODO: Implement proper address checksumming or update backend to handle it
      console.log('[Marketplace] Borrower wallet loaded:', wallet);
      setIsFlagged(false); // Assume not flagged
      
      // Fetch interest rate for the borrower when wallet is loaded
      if (wallet) {
        try {
          console.log('[Marketplace] Fetching interest rate for wallet:', wallet);
          const rateData = await getInterestRate(wallet);
          setInterestRateData({
            interestRate: parseFloat(rateData.interestRate),
            creditScore: rateData.creditScore,
            tier: rateData.tier,
            riskState: rateData.riskState,
            availableCredit: rateData.availableCredit,
            maxLoanAmount: rateData.maxLoanAmount
          });
          console.log('[Marketplace] Interest rate loaded:', rateData);
        } catch (rateError) {
          console.error('[Marketplace] Failed to fetch interest rate:', rateError);
          // Set a default interest rate if fetching fails
          setInterestRateData({
            interestRate: 12.0,
            creditScore: 0,
            tier: 1,
            riskState: 'unknown',
            availableCredit: 0,
            maxLoanAmount: 0
          });
        }
      }
    } catch (error) {
      console.error('[Marketplace] Error loading borrower wallet:', error);
    }
  };

  const fetchBlockchainOffers = async () => {
    try {
      console.log('[Marketplace] Fetching blockchain offers...');
      const result = await getActiveOffers();
      console.log('[Marketplace] Blockchain offers:', result);
      setBlockchainOffers(result.offers || []);
    } catch (error) {
      console.error('[Marketplace] Error fetching blockchain offers:', error);
      setApiError('Failed to load blockchain offers: ' + error.message);
    }
  };

  const handleSearch = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    setIsLoading(true);
    setSearchSubmitted(true);
    setApiError(null);

    try {
      // Call backend API to get matching lenders
      const response = await requestLoan(parseFloat(loanAmount));
      console.log('[Marketplace] Loan request response:', response);
      
      // Check if borrower is flagged for defaults
      if (response.isFlagged === true || response.is_flagged === true) {
        console.warn('[Marketplace] Borrower is flagged - cannot borrow');
        setIsFlagged(true);
        setApiError('⚠️ Your account has been flagged due to previous loan defaults. You are currently unable to borrow loans. Please contact support.');
        setLenders([]);
        setIsLoading(false);
        return; // Stop processing
      }
      
      // Store borrower data from response
      const borrowerWallet = response.borrower_wallet;
      setBorrowerData({
        borrower_id: response.borrower_id,
        creditScore: response.credit_score,
        wallet: borrowerWallet,
        requestedAmount: response.requested_amount
      });
      
      // Call interest rate backend to get personalized rate
      try {
        console.log('[Marketplace] Fetching interest rate for wallet:', borrowerWallet);
        const rateData = await getInterestRate(borrowerWallet);
        setInterestRateData({
          interestRate: parseFloat(rateData.interestRate),
          creditScore: rateData.creditScore,
          tier: rateData.tier,
          riskState: rateData.riskState,
          availableCredit: rateData.availableCredit,
          maxLoanAmount: rateData.maxLoanAmount
        });
        console.log('[Marketplace] Interest rate data:', rateData);
      } catch (rateError) {
        console.error('[Marketplace] Failed to fetch interest rate:', rateError);
        // Don't fail the entire request if rate calculation fails
        setInterestRateData(null);
      }
      
      // Transform lenders data to match UI format
      const transformedLenders = response.lenders.map(lender => ({
        id: lender.lender_id,
        wallet: lender.lender_wallet,
        minScore: lender.min_score,
        options: lender.options.map(opt => ({
          option_id: opt.option_id,
          duration: opt.duration_days,
          minAmount: opt.min_amount,
          availableAmount: opt.amount_available
        }))
      }));
      
      setLenders(transformedLenders);
      console.log('[Marketplace] Transformed lenders:', transformedLenders);
      
    } catch (error) {
      console.error('[Marketplace] Error fetching lenders:', error);
      setApiError(error.message || 'Failed to fetch lenders');
      setLenders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLender = (lender, option) => {
    setSelectedLender(lender);
    setSelectedOption(option);
    setShowConfirmation(true);
  };

  const handleSelectBlockchainOffer = (offer) => {
    setSelectedOffer(offer);
    setShowConfirmation(true);
  };

  const handleAcceptLoan = async () => {
    if (!borrowerData || !selectedLender || !selectedOption) {
      setApiError('Missing required data for loan selection');
      return;
    }

    setTransactionStatus('pending');
    setApiError(null);
    
    try {
      const loanData = {
        loan_amt: parseFloat(loanAmount),
        duration: selectedOption.duration,
        lender_id: selectedLender.id,
        borrower_id: borrowerData.borrower_id,
        option_id: selectedOption.option_id
      };
      
      console.log('[Marketplace] Selecting loan with data:', loanData);
      const response = await selectLoan(loanData);
      console.log('[Marketplace] Loan selected:', response);
      
      setTransactionStatus('confirmed');
      
      // Redirect to borrower dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/borrower';
      }, 2000);
      
    } catch (error) {
      console.error('[Marketplace] Error selecting loan:', error);
      setTransactionStatus('error');
      setApiError(error.message || 'Failed to select loan');
    }
  };

  const handleAcceptBlockchainOffer = async () => {
    if (!selectedOffer || !borrowerWallet) {
      setApiError('Missing required data. Please ensure you have a wallet connected.');
      return;
    }

    // Validate offerId
    if (!selectedOffer.offerId) {
      setApiError('Invalid offer: This offer does not have a blockchain ID and cannot be accepted.');
      return;
    }

    if (isFlagged) {
      setApiError('Your account is flagged. You cannot accept loans at this time.');
      return;
    }

    setTransactionStatus('pending');
    setApiError(null);
    setTxHash(null);
    setLoanId(null);
    
    try {
      // Get interest rate - must be available
      let interestRate = 12.0; // default fallback
      if (interestRateData && interestRateData.interestRate) {
        interestRate = parseFloat(interestRateData.interestRate);
        console.log('[Marketplace] Using personalized interest rate:', interestRate);
      } else {
        console.warn('[Marketplace] No personalized rate available, using default:', interestRate);
      }

      // Prepare accept data matching exact API specification
      const acceptData = {
        offerId: parseInt(selectedOffer.offerId),
        borrower: borrowerWallet,
        interestRate: parseFloat(interestRate),
        isInsured: false,
        insurer: '0x0000000000000000000000000000000000000000' // zero address for no insurance
      };

      console.log('[Marketplace] Accepting blockchain offer with data:', acceptData);
      console.log('[Marketplace] Data types:', {
        offerId: typeof acceptData.offerId,
        borrower: typeof acceptData.borrower,
        interestRate: typeof acceptData.interestRate,
        isInsured: typeof acceptData.isInsured,
        insurer: typeof acceptData.insurer
      });
      
      const result = await acceptLoanOffer(acceptData);
      console.log('[Marketplace] Offer accepted successfully:', result);
      
      setTxHash(result.txHash);
      setLoanId(result.loanId);
      setTransactionStatus('confirmed');
      
      // Refresh offers to remove accepted one
      await fetchBlockchainOffers();
      
      // Redirect to borrower dashboard after 5 seconds
      setTimeout(() => {
        window.location.href = '/borrower';
      }, 5000);
      
    } catch (error) {
      console.error('[Marketplace] Error accepting blockchain offer:', error);
      setTransactionStatus('error');
      setApiError(error.message || 'Failed to accept loan offer');
    }
  };

  const calculateTotalRepayment = (amount, rate) => {
    const principal = parseFloat(amount);
    const rateDecimal = rate / 100;
    const total = principal * (1 + rateDecimal);
    return total.toFixed(2);
  };

  const filteredLenders = lenders.filter(lender => {
    if (filterMaxDuration) {
      // Check if any option has the filtered duration
      const hasMatchingDuration = lender.options.some(
        opt => opt.duration === filterMaxDuration
      );
      if (!hasMatchingDuration) return false;
    }
    return true;
  });

  // Transaction Status Modal
  if (transactionStatus) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          {transactionStatus === 'pending' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Processing Transaction</h2>
              <p className="text-gray-400">Creating loan on the blockchain...</p>
              <div className="w-12 h-12 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-[#F5F3EE]">Broadcasting Transaction...</h2>
              <p className="text-xs text-[#6B7280] mb-4">Confirming on-chain escrow disbursal.</p>
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-xs font-mono text-[#6B7280]">
                EVM RPC SUBMITTED
              </div>
            </>
          )}
          
          {transactionStatus === 'confirmed' && (
            <>
              <div className="w-12 h-12 rounded-[4px] bg-[#1B7A5A]/15 border border-[#1B7A5A]/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-[#2ecc71]" />
              </div>
              <h2 className="text-xl font-semibold mb-1 text-[#2ecc71]">Loan Disbursed</h2>
              <p className="text-xs text-[#6B7280] mb-6">Autonomous escrow contract activated.</p>
              
              {loanId && (
                <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3 mb-3 text-left">
                  <span className="text-[10px] text-[#6B7280] font-mono block">LOAN ID</span>
                  <span className="text-base font-mono font-bold text-[#F5F3EE]">#{loanId}</span>
                </div>
              )}
              
              {txHash && (
                <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3 mb-4 text-left">
                  <span className="text-[10px] text-[#6B7280] font-mono block mb-1">TRANSACTION HASH</span>
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-[#C9A24B]">{formatTxHash(txHash, 8)}</code>
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                      className="text-[#6B7280] hover:text-[#F5F3EE]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-xs font-mono text-[#6B7280]">Redirecting to console...</p>
            </>
          )}
          
          {transactionStatus === 'error' && (
            <>
              <div className="w-12 h-12 rounded-[4px] bg-[#B23B3B]/15 border border-[#B23B3B]/40 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-[#e74c3c]" />
              </div>
              <h2 className="text-xl font-semibold mb-1 text-[#e74c3c]">Execution Reverted</h2>
              <p className="text-xs text-[#6B7280] mb-4">The smart contract rejected the disbursal call.</p>
              {apiError && (
                <div className="bg-[#B23B3B]/10 border border-[#B23B3B]/40 rounded-[4px] p-3 mb-4 text-left">
                  <p className="text-xs font-mono text-[#e74c3c]">{apiError}</p>
                </div>
              )}
              <button
                onClick={() => setTransactionStatus(null)}
                className="w-full py-2 bg-[#C9A24B] text-[#0E1013] text-xs font-semibold rounded-[4px]"
              >
                Dismiss & Retry
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Confirmation Modal for Blockchain Offers
  if (showConfirmation && selectedOffer) {
    return (
      <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/borrower/marketplace"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirmation(false);
              setSelectedOffer(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#6B7280] hover:text-[#F5F3EE] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO MARKETPLACE
          </Link>

          <div className="bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-6 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#6B7280]">ESCROW DEPLOYMENT CONFIRMATION</span>
              <h1 className="text-2xl font-semibold text-[#F5F3EE]">Accept Liquidity Offer</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">PRINCIPAL</span>
                <span className="text-lg font-mono font-bold text-[#F5F3EE] tabular-nums">Ξ{selectedOffer.amountEth}</span>
              </div>
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">DURATION</span>
                <span className="text-lg font-mono font-bold text-[#F5F3EE] tabular-nums">{selectedOffer.durationDays}d</span>
              </div>
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">MIN SCORE</span>
                <span className="text-lg font-mono font-bold text-[#C9A24B] tabular-nums">{selectedOffer.minCreditScore}</span>
              </div>
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">LENDER</span>
                <span className="text-xs font-mono text-[#F5F3EE] truncate block">{selectedOffer.lender.slice(0, 6)}...{selectedOffer.lender.slice(-4)}</span>
              </div>
            </div>

            {borrowerWallet && (
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] flex items-center justify-between text-xs font-mono">
                <span className="text-[#6B7280]">SETTLEMENT DESTINATION:</span>
                <span className="text-[#F5F3EE]">{borrowerWallet}</span>
              </div>
            )}

            <div className="p-3 bg-[#0E1013] border border-[#B23B3B]/40 rounded-[4px] text-xs font-mono text-[#e74c3c]">
              WARNING: Failure to repay principal within agreed duration + 7 day grace window triggers irreversible blacklisting on ReputationRegistry.sol.
            </div>

            <button
              onClick={handleAcceptBlockchainOffer}
              disabled={isFlagged || !borrowerWallet}
              className="w-full py-3 bg-[#C9A24B] text-[#0E1013] rounded-[4px] text-xs font-semibold font-mono uppercase hover:bg-[#D4B263] transition-colors disabled:opacity-40"
            >
              {!borrowerWallet ? 'Wallet Not Bound' : isFlagged ? 'Wallet Blacklisted' : 'Execute Escrow Disbursal'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Modal (for old backend API lenders)
  if (showConfirmation && selectedLender && selectedOption) {
    return (
      <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/borrower/marketplace"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirmation(false);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#6B7280] hover:text-[#F5F3EE] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO MARKETPLACE
          </Link>

          <div className="bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-[#F5F3EE]">Confirm Loan Parameters</h1>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">PRINCIPAL</span>
                <span className="text-xl font-mono font-bold text-[#F5F3EE] tabular-nums">${loanAmount}</span>
              </div>
              <div className="bg-[#0E1013] border border-[#2A2D33] rounded-[4px] p-3">
                <span className="text-[10px] text-[#6B7280] font-mono block">DURATION</span>
                <span className="text-xl font-mono font-bold text-[#F5F3EE] tabular-nums">{selectedOption.duration} days</span>
              </div>
            </div>

            {interestRateData && (
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">DYNAMIC APR:</span>
                  <span className="text-[#2ecc71]">{interestRateData.interestRate}%</span>
                </div>
                <div className="flex justify-between border-t border-[#2A2D33] pt-2">
                  <span className="text-[#6B7280]">TOTAL DUE AT MATURITY:</span>
                  <span className="text-sm font-bold text-[#C9A24B]">
                    ${(() => {
                      const principal = parseFloat(loanAmount);
                      const rateDecimal = interestRateData.interestRate / 100;
                      const durationYears = selectedOption.duration / 365;
                      const interest = principal * rateDecimal * durationYears;
                      return (principal + interest).toFixed(2);
                    })()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleAcceptLoan}
              className="w-full py-3 bg-[#C9A24B] text-[#0E1013] rounded-[4px] text-xs font-semibold font-mono uppercase hover:bg-[#D4B263] transition-colors"
            >
              Confirm Loan Contract
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2D33]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/borrower" className="text-xs font-mono text-[#6B7280] hover:text-[#F5F3EE]">
                ← BORROWER TERMINAL
              </Link>
              <span className="text-xs font-mono text-[#6B7280]">·</span>
              <span className="text-xs font-mono text-[#C9A24B]">MARKETPLACE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F3EE]">
              Liquidity Pool Discovery
            </h1>
          </div>
        </div>

        {/* Credit Score & Interest Rate Info Banner */}
        {borrowerData && (
          <div className="p-4 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                <span className="text-[10px] text-[#6B7280] font-mono block">CREDIT SCORE (GBR)</span>
                <span className="text-xl font-mono font-bold text-[#F5F3EE] tabular-nums">{borrowerData.creditScore} / 1000</span>
              </div>
              
              {interestRateData && (
                <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                  <span className="text-[10px] text-[#6B7280] font-mono block">DYNAMIC APR BRACKET</span>
                  <span className="text-xl font-mono font-bold text-[#2ecc71] tabular-nums">{interestRateData.interestRate}% APR</span>
                </div>
              )}
              
              <div className="p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px]">
                <span className="text-[10px] text-[#6B7280] font-mono block">SETTLEMENT WALLET</span>
                <span className="text-xs font-mono text-[#C9A24B] truncate block mt-1">
                  {borrowerData.wallet ? `${borrowerData.wallet.slice(0, 8)}...${borrowerData.wallet.slice(-6)}` : 'DISCONNECTED'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* API Error Display */}
        {apiError && (
          <div className="p-3 bg-[#B23B3B]/10 border border-[#B23B3B]/40 rounded-[4px] text-xs font-mono text-[#e74c3c] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Search & Request Form */}
        <div className="p-5 bg-[#14171C] border border-[#2A2D33] rounded-[4px] space-y-4">
          <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
            Simulate Loan Request
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono text-[#6B7280] uppercase">
                Requested Loan Principal (USD Equivalent)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-2 bg-[#C9A24B] text-[#0E1013] rounded-[4px] text-xs font-semibold font-mono uppercase hover:bg-[#D4B263] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isLoading ? "Querying Order Books..." : "Scan Liquidity Pools"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searchSubmitted && !isLoading && (
          <div className="space-y-4">
            {filteredLenders.length > 0 ? (
              <>
                {/* Filters */}
                <div className="flex items-center gap-4 text-xs font-mono p-3 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
                  <span className="text-[#6B7280]">FILTER:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterInsuredOnly}
                      onChange={(e) => setFilterInsuredOnly(e.target.checked)}
                      className="accent-[#C9A24B]"
                    />
                    <span>INSURED COVERAGE ONLY</span>
                  </label>
                  <select
                    value={filterMaxDuration || ''}
                    onChange={(e) => setFilterMaxDuration(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-2 py-1 bg-[#0E1013] border border-[#2A2D33] rounded-[3px] text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#C9A24B]"
                  >
                    <option value="">ALL DURATIONS</option>
                    <option value="30">30 DAYS MAX</option>
                    <option value="60">60 DAYS MAX</option>
                    <option value="90">90 DAYS MAX</option>
                  </select>
                </div>

                {/* Lender Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLenders.map((lender) => (
                    <div key={lender.id} className="p-4 bg-[#14171C] border border-[#2A2D33] rounded-[4px] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#2A2D33] pb-2">
                        <span className="text-xs font-mono font-semibold text-[#F5F3EE]">LENDER #{lender.id}</span>
                        <span className="text-[10px] font-mono text-[#6B7280]">
                          {lender.wallet && `${lender.wallet.slice(0, 6)}...${lender.wallet.slice(-4)}`}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-[#6B7280]">SELECT TRANCHE:</span>
                        {lender.options
                          .filter(opt => !filterMaxDuration || opt.duration === filterMaxDuration)
                          .map((option) => (
                          <button
                            key={option.option_id}
                            onClick={() => handleSelectLender(lender, option)}
                            disabled={parseFloat(loanAmount) < option.minAmount || parseFloat(loanAmount) > option.availableAmount}
                            className="w-full p-2.5 bg-[#0E1013] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[3px] transition-colors text-left disabled:opacity-40"
                          >
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-[#F5F3EE]">{option.duration} Days</span>
                              <span className="text-[#C9A24B]">${option.minAmount} — ${option.availableAmount}</span>
                            </div>
                            {parseFloat(loanAmount) < option.minAmount && (
                              <div className="text-[10px] font-mono text-[#e74c3c] mt-1">BELOW MINIMUM</div>
                            )}
                            {parseFloat(loanAmount) > option.availableAmount && (
                              <div className="text-[10px] font-mono text-[#e74c3c] mt-1">EXCEEDS POOL LIQUIDITY</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-10 text-center bg-[#14171C] border border-[#2A2D33] rounded-[4px] text-xs font-mono text-[#6B7280]">
                NO ACTIVE LENDERS MATCH REQUEST CRITERIA. ADJUST PRINCIPAL OR CHECK AGAIN LATER.
              </div>
            )}
          </div>
        )}

        {!searchSubmitted && (
          <div className="p-10 text-center bg-[#14171C] border border-[#2A2D33] rounded-[4px] text-xs font-mono text-[#6B7280]">
            ENTER A LOAN PRINCIPAL TO SCAN AVAILABLE PRE-FUNDED SMART CONTRACT POOLS.
          </div>
        )}

      </div>
    </div>
  );
}

