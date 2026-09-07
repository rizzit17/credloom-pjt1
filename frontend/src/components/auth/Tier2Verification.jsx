"use client";

import { useState } from "react";
import { Shield, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TerminalButton from "@/components/ui/TerminalButton";
import StatusBadge from "@/components/ui/StatusBadge";

export default function Tier2Verification() {
  const { verifyTier2, tierStatus } = useAuth();
  const [ensName, setEnsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isAlreadyVerified = tierStatus?.tier2?.ens_verified;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ensName.trim()) {
      setError("Please enter an ENS domain name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyTier2(ensName);
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

  if (isAlreadyVerified) {
    return (
      <div className="bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#1B7A5A]/15 border border-[#1B7A5A]/40 flex items-center justify-center">
              <Check className="w-4 h-4 text-[#2ecc71]" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#F5F3EE]">TIER 2 ENS PROOF VERIFIED</div>
              <div className="text-xs font-mono text-[#6B7280]">
                DOMAIN: {tierStatus.tier2.ens_name}
              </div>
            </div>
          </div>
          <StatusBadge variant="signal">TIER 2 ACTIVE</StatusBadge>
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
            Tier 2 ENS Resolution
          </span>
        </div>
        <StatusBadge variant="brass">UPGRADE READY</StatusBadge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="ensName" className="block text-xs font-mono text-[#6B7280] uppercase mb-1">
            Ethereum Name Service Domain (.eth)
          </label>
          <input
            type="text"
            id="ensName"
            value={ensName}
            onChange={(e) => {
              setEnsName(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 text-xs font-mono bg-[#0E1013] border border-[#2A2D33] rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]"
            placeholder="vitalik.eth"
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
            result.verified 
              ? "bg-[#1B7A5A]/10 border-[#1B7A5A]/40 text-[#2ecc71]" 
              : "bg-[#B23B3B]/10 border-[#B23B3B]/40 text-[#e74c3c]"
          }`}>
            <p className="text-xs font-mono">
              {result.verified 
                ? `SUCCESS: ENS domain "${result.ens_name}" verified.` 
                : "FAILED: ENS resolution check failed. Verify domain ownership."}
            </p>
          </div>
        )}

        <TerminalButton
          type="submit"
          disabled={isLoading || !ensName.trim()}
          variant="brass"
          size="sm"
          fullWidth
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Querying ENS Records...
            </span>
          ) : (
            "Verify ENS Domain"
          )}
        </TerminalButton>
      </form>
    </div>
  );
}
