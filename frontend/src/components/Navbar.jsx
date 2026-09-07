"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Shield, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/ui/StatusBadge";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { user, role, logout } = useAuth();
  const isSignedIn = !!user;
  const userType = role;

  const getDashboardLink = () => {
    if (!isSignedIn) return "/signin";
    switch (userType) {
      case "borrower":
        return "/borrower";
      case "lender":
        return "/lender";
      case "insurer":
        return "/insurer";
      default:
        return "/borrower";
    }
  };

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Terminal", href: getDashboardLink() },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0E1013]/95 backdrop-blur-none border-b border-[#2A2D33]">
      <nav className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">
        {/* Brand & Market Status */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#14171C] border border-[#2A2D33] rounded-[4px] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-[#C9A24B]" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[#F5F3EE]">
              CREDLOOM
            </span>
          </Link>

          {/* Institutional Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#2A2D33]">
            <span className="w-2 h-2 rounded-full bg-[#1B7A5A] animate-pulse" />
            <span className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider">
              PROTOCOL ONLINE · EVM HARDHAT
            </span>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors rounded-[3px] ${
                  isActive
                    ? "text-[#C9A24B] bg-[#1A1D23] border border-[#2A2D33]"
                    : "text-[#6B7280] hover:text-[#F5F3EE] hover:bg-[#14171C]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Terminal */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#14171C] border border-[#2A2D33] rounded-[4px]">
                <StatusBadge variant="signal">
                  {userType || "ACTIVE"}
                </StatusBadge>
                {user?.primary_wallet && (
                  <span className="text-xs font-mono text-[#F5F3EE]">
                    {user.primary_wallet.slice(0, 6)}...{user.primary_wallet.slice(-4)}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="px-3 py-1 text-xs font-mono uppercase text-[#6B7280] hover:text-[#B23B3B] transition-colors border border-transparent hover:border-[#B23B3B]/40 rounded-[3px]"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/signin"
                className="px-3.5 py-1.5 text-xs font-medium text-[#F5F3EE] border border-[#2A2D33] rounded-[4px] hover:border-[#6B7280] hover:bg-[#14171C] transition-colors"
              >
                Sign In
              </Link>

              {/* Role-based Sign Up Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsSignUpOpen(true)}
                onMouseLeave={() => setIsSignUpOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#C9A24B] text-[#0E1013] rounded-[4px] hover:bg-[#D4B263] transition-colors">
                  <span>Register</span>
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      isSignUpOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isSignUpOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-56 bg-[#14171C] border border-[#2A2D33] rounded-[4px] p-1.5 z-50"
                    >
                      <Link
                        href="/signup-borrower"
                        className="block px-3 py-2 text-xs text-[#F5F3EE] hover:bg-[#1A1D23] rounded-[3px] transition-colors"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>Borrower Account</span>
                          <span className="text-[10px] font-mono text-[#1B7A5A]">TIER 1-3</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          Under-collateralized loans
                        </div>
                      </Link>
                      <div className="h-px bg-[#2A2D33] my-1" />
                      <Link
                        href="/signup-lender"
                        className="block px-3 py-2 text-xs text-[#F5F3EE] hover:bg-[#1A1D23] rounded-[3px] transition-colors"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>Lender Account</span>
                          <span className="text-[10px] font-mono text-[#C9A24B]">YIELD</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          Supply liquidity with policy caps
                        </div>
                      </Link>
                      <div className="h-px bg-[#2A2D33] my-1" />
                      <Link
                        href="/signup-insurer"
                        className="block px-3 py-2 text-xs text-[#F5F3EE] hover:bg-[#1A1D23] rounded-[3px] transition-colors"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>Insurer Account</span>
                          <span className="text-[10px] font-mono text-[#6B7280]">100 BPS</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          Stake risk pool & earn fees
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#6B7280] hover:text-[#F5F3EE] p-1.5 rounded-[4px] border border-[#2A2D33]"
        >
          {isMenuOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0E1013] border-b border-[#2A2D33] px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-[#F5F3EE] py-2 border-b border-[#2A2D33]/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {isSignedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-mono uppercase text-[#B23B3B] border border-[#B23B3B]/40 rounded-[4px]"
                >
                  Disconnect ({userType})
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-mono border border-[#2A2D33] rounded-[4px]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup-borrower"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-mono font-semibold bg-[#C9A24B] text-[#0E1013] rounded-[4px]"
                  >
                    Register as Borrower
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
