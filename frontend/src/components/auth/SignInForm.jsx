"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, AlertCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TerminalPanel from "@/components/ui/TerminalPanel";
import TerminalButton from "@/components/ui/TerminalButton";
import StatusBadge from "@/components/ui/StatusBadge";

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

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
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const result = await login(formData.username, formData.password);
      if (result.success) {
        const role = result.role || "borrower";
        const roleRoutes = {
          borrower: "/borrower",
          lender: "/lender",
          insurer: "/insurer",
        };
        router.push(roleRoutes[role] || "/borrower");
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header Info */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
          <Shield className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span className="text-xs font-mono text-[#F5F3EE] tracking-wider uppercase">
            CREDLOOM PROTOCOL
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#F5F3EE]">
          Terminal Authentication
        </h1>
        <p className="text-xs text-[#6B7280]">
          Enter your protocol credentials to access your session.
        </p>
      </div>

      <TerminalPanel
        header="AUTHENTICATION"
        badge={<StatusBadge variant="neutral">SECURE</StatusBadge>}
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
                placeholder="username"
              />
            </div>
            {errors.username && (
              <p className="text-[11px] font-mono text-[#e74c3c]">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-mono text-[#6B7280] uppercase">
                Access Key (Password)
              </label>
              <Link href="/contact" className="text-[11px] text-[#6B7280] hover:text-[#F5F3EE]">
                Need assistance?
              </Link>
            </div>
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

          <div className="pt-2">
            <TerminalButton
              type="submit"
              disabled={isLoading}
              variant="brass"
              size="md"
              fullWidth
            >
              {isLoading ? "Validating Credentials..." : "Authenticate Session"}
            </TerminalButton>
          </div>
        </form>

        {/* Role Onboarding Navigation */}
        <div className="mt-6 pt-4 border-t border-[#2A2D33] space-y-2">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider text-center">
            New Protocol Participant?
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/signup-borrower"
              className="p-2 text-center text-[11px] font-mono border border-[#2A2D33] bg-[#111317] hover:border-[#6B7280] text-[#F5F3EE] rounded-[3px] transition-colors"
            >
              Borrower
            </Link>
            <Link
              href="/signup-lender"
              className="p-2 text-center text-[11px] font-mono border border-[#2A2D33] bg-[#111317] hover:border-[#6B7280] text-[#F5F3EE] rounded-[3px] transition-colors"
            >
              Lender
            </Link>
            <Link
              href="/signup-insurer"
              className="p-2 text-center text-[11px] font-mono border border-[#2A2D33] bg-[#111317] hover:border-[#6B7280] text-[#F5F3EE] rounded-[3px] transition-colors"
            >
              Insurer
            </Link>
          </div>
        </div>
      </TerminalPanel>
    </div>
  );
}
