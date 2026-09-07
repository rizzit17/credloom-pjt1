'use client';

import SignUpForm from '@/components/auth/SignUpForm';
import { Shield } from 'lucide-react';

export default function SignupBorrower() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#0E1013]">
      <SignUpForm 
        role="borrower"
        icon={Shield}
        title="Borrower Registration"
        description="Establish on-chain credit history and access unsecured micro-loans."
      />
    </div>
  );
}
