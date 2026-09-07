'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Save,
  AlertCircle,
  CheckCircle2,
  Coins,
  Users,
  Sliders,
  Info,
  Loader2
} from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import TerminalButton from '@/components/ui/TerminalButton';
import StatusBadge from '@/components/ui/StatusBadge';
import DataRow from '@/components/ui/DataRow';

export default function InsuranceConfiguration() {
  const [config, setConfig] = useState({
    tiersCovered: {
      excellent: true,
      good: true,
      fair: false
    },
    minCreditScore: 600,
    maxCreditScore: 850,
    premiumRates: {
      excellent: '2.0',
      good: '3.5',
      fair: '5.0'
    },
    maxCoveragePerLoan: '10000',
    minCoveragePerLoan: '100',
    coveragePercentage: '100',
    totalPoolCapacity: '500000',
    reserveRatio: '20',
    maxExposurePerBorrower: '15000',
    maxSimultaneousClaims: '3',
    autoApprove: true,
    autoApproveLimit: '5000',
    gracePeriodDays: '7',
    claimProcessingTime: '3',
    requireBorrowerVerification: true
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validateConfig = () => {
    const newErrors = {};

    if (config.minCreditScore < 300 || config.minCreditScore > 850) {
      newErrors.minCreditScore = 'Credit score must be between 300 and 850';
    }
    if (config.maxCreditScore < config.minCreditScore) {
      newErrors.maxCreditScore = 'Max credit score must be greater than min';
    }

    if (parseFloat(config.premiumRates.excellent) < 0.1 || parseFloat(config.premiumRates.excellent) > 20) {
      newErrors.premiumExcellent = 'Premium rate must be between 0.1% and 20%';
    }
    if (parseFloat(config.premiumRates.good) < 0.1 || parseFloat(config.premiumRates.good) > 20) {
      newErrors.premiumGood = 'Premium rate must be between 0.1% and 20%';
    }
    if (parseFloat(config.premiumRates.fair) < 0.1 || parseFloat(config.premiumRates.fair) > 20) {
      newErrors.premiumFair = 'Premium rate must be between 0.1% and 20%';
    }

    if (parseFloat(config.maxCoveragePerLoan) < 100 || parseFloat(config.maxCoveragePerLoan) > 50000) {
      newErrors.maxCoverage = 'Max coverage must be between 100 and 50,000 ETH';
    }
    if (parseFloat(config.minCoveragePerLoan) < 50 || parseFloat(config.minCoveragePerLoan) > parseFloat(config.maxCoveragePerLoan)) {
      newErrors.minCoverage = 'Min coverage must be between 50 ETH and max coverage';
    }
    if (parseFloat(config.coveragePercentage) < 50 || parseFloat(config.coveragePercentage) > 100) {
      newErrors.coveragePercentage = 'Coverage percentage must be between 50% and 100%';
    }

    if (parseFloat(config.totalPoolCapacity) < 10000) {
      newErrors.poolCapacity = 'Pool capacity must be at least 10,000 ETH';
    }
    if (parseFloat(config.reserveRatio) < 10 || parseFloat(config.reserveRatio) > 50) {
      newErrors.reserveRatio = 'Reserve ratio must be between 10% and 50%';
    }

    if (parseFloat(config.maxExposurePerBorrower) < parseFloat(config.maxCoveragePerLoan)) {
      newErrors.maxExposure = 'Max exposure must be at least max coverage per loan';
    }
    if (parseInt(config.maxSimultaneousClaims) < 1 || parseInt(config.maxSimultaneousClaims) > 10) {
      newErrors.maxClaims = 'Max simultaneous claims must be between 1 and 10';
    }

    if (!config.tiersCovered.excellent && !config.tiersCovered.good && !config.tiersCovered.fair) {
      newErrors.tiers = 'At least one tier must be covered';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateConfig()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateRiskLevel = () => {
    let riskScore = 0;
    if (config.tiersCovered.fair) riskScore += 3;
    if (config.tiersCovered.good) riskScore += 2;
    if (config.tiersCovered.excellent) riskScore += 1;
    if (parseFloat(config.coveragePercentage) >= 90) riskScore += 2;
    else if (parseFloat(config.coveragePercentage) >= 75) riskScore += 1;
    if (parseFloat(config.reserveRatio) < 15) riskScore += 2;
    else if (parseFloat(config.reserveRatio) < 25) riskScore += 1;

    if (riskScore >= 6) return { level: 'High Risk', variant: 'brick' };
    if (riskScore >= 4) return { level: 'Moderate Risk', variant: 'brass' };
    return { level: 'Conservative Risk', variant: 'signal' };
  };

  const riskAssessment = calculateRiskLevel();

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link
          href="/insurer"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#F5F3EE] font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO CAPITAL DESK
        </Link>

        {/* Header */}
        <div className="border-b border-[#2A2D33] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                POLICY UNDERWRITING MATRIX // PROTOCOL ENGINE
              </span>
              <StatusBadge variant={riskAssessment.variant} label={riskAssessment.level.toUpperCase()} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EE]">
              Insurance Underwriting Parameters
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Govern risk exposure, premium schedules, and solvency reserve boundaries.
            </p>
          </div>

          <TerminalButton
            variant="brass"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Commit Parameters...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Commit Parameters
              </>
            )}
          </TerminalButton>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <TerminalPanel variant="signal">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1B7A5A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Underwriting matrix committed to insurance pool contract.
            </div>
          </TerminalPanel>
        )}

        <div className="space-y-6">
          
          {/* Section 1: Tier Coverage */}
          <TerminalPanel title="Underwritten Borrower Tiers" subheader="ELIGIBILITY MAPPING">
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                <div>
                  <span className="text-xs font-semibold text-[#1B7A5A] block">Prime Tier (750+)</span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Lowest default probability baseline</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.tiersCovered.excellent}
                  onChange={(e) => setConfig({
                    ...config,
                    tiersCovered: { ...config.tiersCovered, excellent: e.target.checked }
                  })}
                  className="accent-[#1B7A5A] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                <div>
                  <span className="text-xs font-semibold text-[#C9A24B] block">Near-Prime Tier (650 - 749)</span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Standard risk micro-lending band</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.tiersCovered.good}
                  onChange={(e) => setConfig({
                    ...config,
                    tiersCovered: { ...config.tiersCovered, good: e.target.checked }
                  })}
                  className="accent-[#C9A24B] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[4px]">
                <div>
                  <span className="text-xs font-semibold text-[#B23B3B] block">Sub-Prime Tier (500 - 649)</span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Elevated loss probability with higher yield</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.tiersCovered.fair}
                  onChange={(e) => setConfig({
                    ...config,
                    tiersCovered: { ...config.tiersCovered, fair: e.target.checked }
                  })}
                  className="accent-[#B23B3B] w-4 h-4 cursor-pointer"
                />
              </div>

              {errors.tiers && (
                <p className="text-[11px] text-[#B23B3B] font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.tiers}
                </p>
              )}
            </div>
          </TerminalPanel>

          {/* Section 2: Premium Rates */}
          <TerminalPanel title="Premium Schedule Rate Curves" subheader="PERCENTAGE OF PRINCIPAL">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  PRIME RATE (750+)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.excellent}
                    disabled={!config.tiersCovered.excellent}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, excellent: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] disabled:opacity-40 outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-[#6B7280]">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  NEAR-PRIME RATE (650-749)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.good}
                    disabled={!config.tiersCovered.good}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, good: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] disabled:opacity-40 outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-[#6B7280]">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  SUB-PRIME RATE (500-649)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.fair}
                    disabled={!config.tiersCovered.fair}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, fair: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] disabled:opacity-40 outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-[#6B7280]">%</span>
                </div>
              </div>
            </div>
          </TerminalPanel>

          {/* Section 3: Pool Capacity & Reserve Ratio */}
          <TerminalPanel title="Solvency & Capacity Boundaries" subheader="LIQUIDITY RATIOS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  TOTAL POOL CAPACITY (ETH)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={config.totalPoolCapacity}
                  onChange={(e) => setConfig({ ...config, totalPoolCapacity: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#6B7280]">
                  STATUTORY RESERVE RATIO (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={config.reserveRatio}
                    onChange={(e) => setConfig({ ...config, reserveRatio: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1013] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-[#6B7280]">%</span>
                </div>
                <p className="text-[10px] text-[#6B7280] font-mono">
                  Mandatory idle reserve: Ξ{(parseFloat(config.totalPoolCapacity) * parseFloat(config.reserveRatio) / 100).toFixed(0)} ETH
                </p>
              </div>
            </div>
          </TerminalPanel>

          {/* Configuration Ledger Summary */}
          <TerminalPanel title="Protocol Underwriting Ledger" subheader="SUMMARY OF ACTIVE PARAMETERS">
            <div className="mt-2 divide-y divide-[#2A2D33]">
              <DataRow 
                label="Covered Tiers" 
                value={[
                  config.tiersCovered.excellent && 'Prime (750+)',
                  config.tiersCovered.good && 'Near-Prime (650+)',
                  config.tiersCovered.fair && 'Sub-Prime (500+)'
                ].filter(Boolean).join(' • ') || 'None'}
                isMono={true}
              />
              <DataRow 
                label="Maximum Exposure Per Borrower" 
                value={`Ξ${config.maxExposurePerBorrower}`} 
                isMono={true} 
              />
              <DataRow 
                label="Auto-Approve Threshold" 
                value={config.autoApprove ? `Up to Ξ${config.autoApproveLimit}` : 'Manual Verification'} 
                isMono={true} 
                valueColor="signal" 
              />
              <DataRow 
                label="Default Grace Period" 
                value={`${config.gracePeriodDays} Days`} 
                isMono={true} 
              />
            </div>
          </TerminalPanel>

        </div>

      </div>
    </div>
  );
}
