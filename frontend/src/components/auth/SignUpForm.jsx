"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, AlertCircle, Wallet, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TerminalPanel from "@/components/ui/TerminalPanel";
import TerminalButton from "@/components/ui/TerminalButton";
import StatusBadge from "@/components/ui/StatusBadge";

export default function SignUpForm({ role, icon: Icon, title, description }) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    wallet: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const getRoleInfo = () => {
    const roleInfo = {
      borrower: {
        roleName: "Borrower",
        hasTiers: true,
        badgeVariant: "signal",
        badgeText: "UNSECURED CREDIT",
        nextSteps:
          "Upon registration, wallet activates at Tier 1 (Entry cap: $500). Verify ENS for Tier 2 ($2,500 cap), and Gitcoin Passport for Tier 3 ($5,000 max, 5.0% APR).",
      },
      lender: {
        roleName: "Lender",
        hasTiers: false,
        badgeVariant: "brass",
        badgeText: "CAPITAL DEPLOYER",
        nextSteps:
          "Configure risk thresholds (min credit score, maximum duration, auto-lending limits) and pre-fund liquidity into autonomous smart contract escrows.",
      },
      insurer: {
        roleName: "Insurer",
        hasTiers: false,
        badgeVariant: "neutral",
        badgeText: "UNDERWRITING POOL",
        nextSteps:
          "Stake loss-absorption capital in InsurancePool.sol to underwrite protocol loans and earn continuous 100 bps yield premiums on all insured disbursals.",
      },
    };
    return roleInfo[role] || roleInfo["borrower"];
  };

  const roleInfo = getRoleInfo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.wallet.trim()) {
      newErrors.wallet = "Wallet address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.wallet)) {
      newErrors.wallet = "Invalid Ethereum wallet address (0x...)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const result = await register({
        username: formData.username,
        password: formData.password,
        wallet: formData.wallet,
        role: role,
      });

      if (result.success) {
        router.push("/signin?registered=true");
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLinks = () => {
    const roles = [
      { name: "Borrower", path: "/signup-borrower" },
      { name: "Lender", path: "/signup-lender" },
      { name: "Insurer", path: "/signup-insurer" },
    ];
    return roles.filter((r) => r.name.toLowerCase() !== role);
  };

  return (
    <div className="w-full max-w-md">
      {/* Top Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
          {Icon ? <Icon className="w-3.5 h-3.5 text-[#C9A24B]" /> : <Shield className="w-3.5 h-3.5 text-[#C9A24B]" />}
          <span className="text-xs font-mono text-[#F5F3EE] tracking-wider uppercase">
            {roleInfo.roleName} Onboarding
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#F5F3EE]">
          {title}
        </h1>
        <p className="text-xs text-[#6B7280]">
          {description}
        </p>
      </div>

      <TerminalPanel
        header={`REGISTER ${roleInfo.roleName.toUpperCase()}`}
        badge={<StatusBadge variant={roleInfo.badgeVariant}>{roleInfo.badgeText}</StatusBadge>}
      >
        {apiError && (
          <div className="mb-4 p-3 bg-[#B23B3B]/10 border border-[#B23B3B]/40 rounded-[3px]">
            <p className="text-xs text-[#e74c3c] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-mono text-[#6B7280] uppercase">
              Operator Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-[#6B7280]" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#0E1013] border ${
                  errors.username ? "border-[#B23B3B]" : "border-[#2A2D33]"
                } rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]`}
                placeholder="operator_alias"
              />
            </div>
            {errors.username && (
              <p className="text-[11px] font-mono text-[#e74c3c]">{errors.username}</p>
            )}
          </div>

          {/* Wallet Address */}
          <div className="space-y-1.5">
            <label htmlFor="wallet" className="block text-xs font-mono text-[#6B7280] uppercase">
              Primary Settlement Wallet (EVM)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wallet className="h-4 w-4 text-[#6B7280]" />
              </div>
              <input
                type="text"
                id="wallet"
                name="wallet"
                value={formData.wallet}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#0E1013] border ${
                  errors.wallet ? "border-[#B23B3B]" : "border-[#2A2D33]"
                } rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]`}
                placeholder="0x..."
              />
            </div>
            {errors.wallet && (
              <p className="text-[11px] font-mono text-[#e74c3c]">{errors.wallet}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-mono text-[#6B7280] uppercase">
              Access Key (Password, min 8 chars)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#6B7280]" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#0E1013] border ${
                  errors.password ? "border-[#B23B3B]" : "border-[#2A2D33]"
                } rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-[#e74c3c]">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-mono text-[#6B7280] uppercase">
              Confirm Access Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#6B7280]" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#0E1013] border ${
                  errors.confirmPassword ? "border-[#B23B3B]" : "border-[#2A2D33]"
                } rounded-[4px] text-[#F5F3EE] placeholder-[#4B5262] focus:outline-none focus:border-[#C9A24B]`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] font-mono text-[#e74c3c]">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-2">
            <TerminalButton
              type="submit"
              disabled={isLoading}
              variant="brass"
              size="md"
              fullWidth
            >
              {isLoading ? "Creating Identity Record..." : `Register as ${roleInfo.roleName}`}
            </TerminalButton>
          </div>
        </form>

        {/* Operational Context */}
        <div className="mt-5 p-3 bg-[#0E1013] border border-[#2A2D33] rounded-[3px] space-y-2">
          <div className="text-[11px] font-mono text-[#C9A24B] uppercase tracking-wider">
            Operational Lifecycle
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {roleInfo.nextSteps}
          </p>
        </div>

        {/* Switch Role / Sign In */}
        <div className="mt-5 pt-4 border-t border-[#2A2D33] flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">Already registered?</span>
          <Link href="/signin" className="text-[#C9A24B] hover:underline font-mono">
            Authenticate Session
          </Link>
        </div>
      </TerminalPanel>
    </div>
  );
}
