'use client';

import SignUpForm from '@/components/auth/SignUpForm';
import { ShieldCheck } from 'lucide-react';

export default function SignupInsurer() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#0E1013]">
      <SignUpForm 
        role="insurer"
        icon={ShieldCheck}
        title="Insurer Registration"
        description="Underwrite protocol loan default risks and capture 100 bps yield premiums."
      />
    </div>
  );
}
