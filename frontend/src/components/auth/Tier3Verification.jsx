"use client";

import { useState } from "react";
import { Shield, Check, X, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TerminalButton from "@/components/ui/TerminalButton";
import StatusBadge from "@/components/ui/StatusBadge";

export default function Tier3Verification() {
  const { verifyTier3, tierStatus } = useAuth();
  const [passportNumber, setPassportNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tier3Data = tierStatus?.tier3;
  const isAlreadyAttempted = tier3Data?.passport_verified !== null;
  const isVerified = tier3Data?.passport_verified === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passportNumber.trim()) {
      setError("Please enter Gitcoin Passport identifier");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyTier3(passportNumber);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#1B7A5A]/15 border border-[#1B7A5A]/40 flex items-center justify-center">
              <Check className="w-4 h-4 text-[#2ecc71]" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#F5F3EE]">TIER 3 PASSPORT VERIFIED</div>
              <div className="text-xs font-mono text-[#6B7280]">
                SCORE: {tier3Data.score} / THRESHOLD: {tier3Data.threshold}
              </div>
            </div>
          </div>
          <StatusBadge variant="signal">MAX LIMITS UNLOCKED</StatusBadge>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#C9A24B]" />
          <span className="text-xs font-mono text-[#F5F3EE] uppercase tracking-wider">
            Tier 3 Gitcoin Passport Verification
          </span>
        </div>
        <StatusBadge variant="brass">PRIME TIER</StatusBadge>
      </div>

      {isAlreadyAttempted && !isVerified && (
        <div className="p-3 bg-[#C9A24B]/10 border border-[#C9A24B]/40 rounded-[3px] text-xs font-mono text-[#C9A24B] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Score {tier3Data.score} below threshold {tier3Data.threshold}. Add more stamp proofs.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="passportNumber" className="block text-xs font-mono text-[#6B7280] uppercase mb-1">
            Gitcoin Passport Address / Score ID
          </label>
          <input
            type="text"
            id="passportNumber"
            value={passportNumber}
            onChange={(e) => {
              setPassportNumber(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 text-xs font-mono bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]"
            placeholder="0x... or passport ID"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-1 text-[11px] font-mono text-[#e74c3c] flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className={`p-3 rounded-[4px] border ${
            result.passport_verified 
              ? "bg-[#1B7A5A]/10 border-[#1B7A5A]/40 text-[#2ecc71]" 
              : "bg-[#B23B3B]/10 border-[#B23B3B]/40 text-[#e74c3c]"
          }`}>
            <p className="text-xs font-mono">
              {result.passport_verified 
                ? `SUCCESS: Gitcoin score ${result.score} verified. Tier 3 granted.` 
                : `FAILED: Gitcoin score ${result.score} is below the threshold of ${result.threshold}.`}
            </p>
          </div>
        )}

        <TerminalButton
          type="submit"
          disabled={isLoading || !passportNumber.trim()}
          variant="brass"
          size="sm"
          fullWidth
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Validating Passport Staking...
            </span>
          ) : (
            "Verify Gitcoin Passport"
          )}
        </TerminalButton>
      </form>
    </div>
  );
}
