'use client';
import ContactForm from './ContactForm';
import { Mail, Phone, ShieldCheck, Clock, Activity } from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE] pt-24 pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#2A2D33] pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-wider text-[#9CA3AF] uppercase">
              CREDLOOM PROTOCOL // COMMUNICATIONS DESK
            </span>
            <StatusBadge variant="signal" label="DESK ONLINE" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#F5F3EE]">
            Protocol Inquiry & Support Desk
          </h1>
          <p className="text-xs text-[#9CA3AF] font-mono mt-1">
            Institutional integrations, security vulnerability disclosures, and dispute escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Channels & Protocol Specs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <TerminalPanel title="Direct Channels" subheader="ENCRYPTED COMMUNICATIONS">
              <div className="space-y-3 mt-3">
                <a
                  href="mailto:credloom@gmail.com"
                  className="p-3.5 bg-[#0A0C0E] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] flex items-center gap-3.5 transition-colors group block"
                >
                  <div className="w-9 h-9 rounded-[4px] bg-[#14171C] border border-[#2A2D33] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C9A24B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#9CA3AF] block">GENERAL & INSTITUTIONAL</span>
                    <span className="text-xs sm:text-sm font-mono font-medium text-[#F5F3EE] group-hover:text-[#C9A24B] transition-colors">
                      credloom@gmail.com
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+919882715895"
                  className="p-3.5 bg-[#0A0C0E] border border-[#2A2D33] hover:border-[#C9A24B] rounded-[4px] flex items-center gap-3.5 transition-colors group block"
                >
                  <div className="w-9 h-9 rounded-[4px] bg-[#14171C] border border-[#2A2D33] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#1B7A5A]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#9CA3AF] block">EMERGENCY ESCALATION HOTLINE</span>
                    <span className="text-xs sm:text-sm font-mono font-medium text-[#F5F3EE] group-hover:text-[#C9A24B] transition-colors">
                      +91 98827 15895
                    </span>
                  </div>
                </a>
              </div>
            </TerminalPanel>

            <TerminalPanel title="Verification & Security" subheader="SMART CONTRACT ESCALATION">
              <div className="space-y-3 mt-2 text-xs font-mono text-[#9CA3AF]">
                <div className="flex justify-between py-1.5 border-b border-[#2A2D33]">
                  <span>DISPUTE ORACLE:</span>
                  <span className="text-[#F5F3EE] font-medium">Autonomous Escrow V2</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2A2D33]">
                  <span>EXPECTED SLA:</span>
                  <span className="text-[#1B7A5A] font-semibold">≤ 24 Hours</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2A2D33]">
                  <span>PGP ENCRYPTION:</span>
                  <span className="text-[#C9A24B] font-medium">Available on Request</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>DISCLOSURE POLICY:</span>
                  <span className="text-[#F5F3EE]">Bug Bounty Eligible</span>
                </div>
              </div>
            </TerminalPanel>

            <TerminalPanel title="Desk Availability" subheader="OPERATING PROTOCOL">
              <div className="space-y-2 mt-2 text-xs font-mono text-[#9CA3AF]">
                <div className="flex items-center justify-between">
                  <span>OPERATIONAL HOURS:</span>
                  <span className="text-[#F5F3EE]">08:00 — 20:00 UTC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMART CONTRACTS:</span>
                  <span className="text-[#1B7A5A] font-semibold">24/7 Continuous Execution</span>
                </div>
              </div>
            </TerminalPanel>

          </div>

          {/* Right Column: Contact Transmission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}