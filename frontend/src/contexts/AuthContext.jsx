"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authAPI from '@/lib/api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tierStatus, setTierStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // Frontend-only role tracking
  const router = useRouter();

  // Logout function defined before useEffect to avoid reference issues
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setTierStatus(null);
    setRole(null);
    router.push('/');
  }, [router]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const isAuth = authAPI.isAuthenticated();
      const username = authAPI.getUsername();
      const userRole = authAPI.getUserRole();
      const cached = authAPI.getCachedTierStatus();

      if (isAuth && username) {
        setUser({ username });
        setRole(userRole);
        
        if (cached) {
          setTierStatus(cached);
        }

        // Fetch fresh tier status in background
        try {
          const freshStatus = await authAPI.getTierStatus();
          setTierStatus(freshStatus);
        } catch (error) {
          console.error('Failed to fetch tier status:', error);
          // If token is invalid (401), logout
          if (error.status === 401) {
            logout();
          } else {
            // For other errors, use cached or default tier status
            if (!cached) {
              setTierStatus({ 
                tier: 1, 
                tier2_verified: false, 
                tier3_verified: false,
                error: 'Failed to fetch tier status' 
              });
            }
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = useCallback(async (username, password) => {
    try {
      console.log('[AuthContext] Starting login for:', username);
      const response = await authAPI.login(username, password);
      console.log('[AuthContext] Login successful');
      setUser({ username });
      
      // Get role from localStorage
      const userRole = authAPI.getUserRole();
      setRole(userRole);
      console.log('[AuthContext] User role:', userRole);
      
      // Wait a bit to ensure token is fully stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to fetch tier status after login, but don't fail if it errors
      try {
        console.log('[AuthContext] Fetching tier status...');
        const status = await authAPI.getTierStatus();
        console.log('[AuthContext] Tier status received:', status);
        setTierStatus(status);
      } catch (tierError) {
        console.error('[AuthContext] Failed to fetch tier status:', tierError);
        console.error('[AuthContext] Error details:', {
          message: tierError.message,
          status: tierError.status,
          data: tierError.data
        });
        // Don't fail login if tier status fails - user can still use the app
        // Set a default tier status
        setTierStatus({ 
          tier: 1, 
          tier2_verified: false, 
          tier3_verified: false,
          error: 'Failed to fetch tier status' 
        });
      }
      
      return { success: true, data: response, role: userRole };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const refreshTierStatus = useCallback(async () => {
    try {
      const status = await authAPI.getTierStatus();
      setTierStatus(status);
      return { success: true, data: status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const verifyTier2 = useCallback(async (ensName) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await authAPI.verifyTier2(user.username, ensName);
      // Refresh tier status after verification
      const status = await authAPI.getTierStatus();
      setTierStatus(status);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const verifyTier3 = useCallback(async (passportNumber) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await authAPI.verifyTier3(user.username, passportNumber);
      // Refresh tier status after verification
      const status = await authAPI.getTierStatus();
      setTierStatus(status);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const value = {
    user,
    tierStatus,
    role,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshTierStatus,
    verifyTier2,
    verifyTier3,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
