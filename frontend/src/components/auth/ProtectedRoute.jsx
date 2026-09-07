"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Protected Route Component
 * Redirects to sign-in if user is not authenticated
 */
export default function ProtectedRoute({ children, requireTier = null }) {
  const { isAuthenticated, tierStatus, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/signin');
      } else if (requireTier && tierStatus && tierStatus.tier < requireTier) {
        // User doesn't meet tier requirement
        router.push('/'); // Or show upgrade message
      }
    }
  }, [isAuthenticated, tierStatus, loading, requireTier, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If tier requirement not met
  if (requireTier && tierStatus && tierStatus.tier < requireTier) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Tier {requireTier} Required</h2>
          <p className="text-gray-400 mb-6">
            You need to be Tier {requireTier} or higher to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
