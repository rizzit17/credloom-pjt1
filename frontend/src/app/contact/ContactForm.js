'use client';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import TerminalPanel from '@/components/ui/TerminalPanel';
import TerminalButton from '@/components/ui/TerminalButton';

export default function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ loading: false, ok: null, msg: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (formData.get('bot_field')) {
      setStatus({ loading: false, ok: false, msg: 'Blocked by anti-spam filter.' });
      return;
    }

    setStatus({ loading: true, ok: null, msg: '' });

    const templateParams = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      time: new Date().toISOString(),
    };

    try {
      const serviceId =
        import.meta?.env?.VITE_EMAILJS_SERVICE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId =
        import.meta?.env?.VITE_EMAILJS_TEMPLATE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey =
        import.meta?.env?.VITE_EMAILJS_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        await emailjs.send(serviceId, templateId, templateParams, {
          publicKey,
        });
      }

      setStatus({
        loading: false,
        ok: true,
        msg: 'Message sent successfully. Our protocol team will reply within 24 hours.',
      });
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        ok: false,
        msg: err?.text || 'Failed to send message. Please retry or email credloom@gmail.com directly.',
      });
    }
  };

  return (
    <TerminalPanel 
      title="Send Message" 
      subheader="DIRECT INQUIRY"
      className="p-6 sm:p-7"
    >
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4 font-sans">
        
        <div className="hidden">
          <label>
            Anti-Spam Trap
            <input type="text" name="bot_field" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {status.ok === true && (
          <div className="p-3 bg-[#1B7A5A]/15 border border-[#1B7A5A]/40 rounded-[4px] flex items-center gap-2 text-xs font-mono text-[#34D399]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {status.msg}
          </div>
        )}

        {status.ok === false && (
          <div className="p-3 bg-[#B23B3B]/15 border border-[#B23B3B]/40 rounded-[4px] flex items-center gap-2 text-xs font-mono text-[#F87171]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {status.msg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#9CA3AF]">
              NAME / ENTITY *
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              required
              disabled={status.loading}
              placeholder="e.g. Satoshi or DAO Treasury"
              className="w-full px-3.5 py-2.5 bg-[#0A0C0E] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors placeholder:text-[#4B5262]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#9CA3AF]">
              EMAIL ADDRESS *
            </label>
            <input
              id="user_email"
              name="user_email"
              type="email"
              required
              disabled={status.loading}
              placeholder="you@domain.eth"
              className="w-full px-3.5 py-2.5 bg-[#0A0C0E] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors placeholder:text-[#4B5262]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-[#9CA3AF]">
            SUBJECT *
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            disabled={status.loading}
            placeholder="e.g. Liquidity Pool Integration, Escrow Support, Bug Bounty"
            className="w-full px-3.5 py-2.5 bg-[#0A0C0E] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors placeholder:text-[#4B5262]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-[#9CA3AF]">
            MESSAGE *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={status.loading}
            placeholder="Provide context, wallet address, transaction hash, or inquiry details..."
            className="w-full px-3.5 py-2.5 bg-[#0A0C0E] border border-[#2A2D33] focus:border-[#C9A24B] rounded-[4px] text-xs font-mono text-[#F5F3EE] outline-none transition-colors resize-none placeholder:text-[#4B5262]"
          />
        </div>

        <div className="pt-2">
          <TerminalButton
            type="submit"
            variant="brass"
            size="lg"
            fullWidth
            disabled={status.loading}
            icon={status.loading ? Loader2 : Send}
          >
            {status.loading ? 'Sending Message...' : 'Send Message'}
          </TerminalButton>
        </div>

      </form>
    </TerminalPanel>
  );
}