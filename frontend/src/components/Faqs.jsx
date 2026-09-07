'use client';

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faqs() {
  const faqs = [
    {
      id: "FAQ-01",
      question: "How does Credloom issue loans without 150% crypto collateral?",
      answer:
        "Credloom replaces volatile asset over-collateralization with an algorithmic risk assessment framework. The platform evaluates the borrower's wallet identity, past loan repayment records, holding days, and verification tiers (ENS & Gitcoin Passport). Defaulting permanently flags the borrower's wallet in ReputationRegistry.sol, making defaulting economically destructive to Web3 identity.",
    },
    {
      id: "FAQ-02",
      question: "How is the dynamic APR calculated for each loan?",
      answer:
        "Interest rates are calculated dynamically using the output of a trained Gradient Boosting Regressor risk model. Borrowers with prime credit scores (750+) qualify for 5.0% to 8.0% APR. Mid-tier borrowers (650–749) receive 8.0% to 12.0%, while higher-risk scores scale up to 25.0%. Rates are locked in the smart contract escrow prior to borrower acceptance.",
    },
    {
      id: "FAQ-03",
      question: "What happens if a borrower defaults on an active loan?",
      answer:
        "If a loan is not repaid by the deadline plus the 7-day protocol grace period, the lender or contract trigger initiates a default. The borrower's wallet is permanently blacklisted in ReputationRegistry.sol. If the lender selected insurance backing, InsurancePool.sol automatically liquidates staked capital to reimburse the lender's principal.",
    },
    {
      id: "FAQ-04",
      question: "What is the role of Insurers in the protocol?",
      answer:
        "Insurers provide risk-underwriting liquidity by depositing into InsurancePool.sol. In exchange for absorbing unrecoverable defaults, insurers earn a 100 basis point (1%) premium fee on every insured loan disbursed across the protocol, creating a continuous yield stream.",
    },
    {
      id: "FAQ-05",
      question: "How do Verification Tiers (ENS / Gitcoin Passport) affect borrowing power?",
      answer:
        "Tier 1 (Basic Registration) provides initial entry limits ($500 max). Verifying an ENS domain (Tier 2) confirms established on-chain presence, lowering APR brackets and raising limits. Verifying Gitcoin Passport (Tier 3) proves unique human identity without revealing off-chain KYC, unlocking maximum loan caps and lowest tier interest rates.",
    },
  ];

  const [openId, setOpenId] = useState("FAQ-01");

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 lg:py-24 bg-transparent border-b border-[#2A2D33] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#2A2D33] mb-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#6B7280]">PROTOCOL SPECIFICATIONS</span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#F5F3EE]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="text-xs font-mono text-[#6B7280]">
            TOTAL ENTRIES: {faqs.length}
          </div>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[#2A2D33] border-y border-[#2A2D33]">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#6B7280]">
                      {faq.id}
                    </span>
                    <span className={`text-sm sm:text-base font-medium transition-colors ${
                      isOpen ? "text-[#C9A24B]" : "text-[#F5F3EE] group-hover:text-[#C9A24B]"
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className="w-6 h-6 border border-[#2A2D33] bg-[#14171C] rounded-[3px] flex items-center justify-center text-[#6B7280] group-hover:text-[#F5F3EE] shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 pl-12 text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-3xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}