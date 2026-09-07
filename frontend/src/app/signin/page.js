'use client';

import SignInForm from '@/components/auth/SignInForm';

export default function SignIn() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#0E1013]">
      <SignInForm />
    </div>
  );
}
