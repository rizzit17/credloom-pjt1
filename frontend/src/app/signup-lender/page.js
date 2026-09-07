'use client';

import SignUpForm from '@/components/auth/SignUpForm';
import { Coins } from 'lucide-react';

export default function SignupLender() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#0E1013]">
      <SignUpForm 
        role="lender"
        icon={Coins}
        title="Lender Registration"
        description="Supply liquidity to autonomous pools with custom risk threshold policies."
      />
    </div>
  );
}
