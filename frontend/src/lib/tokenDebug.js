/**
 * Token Debugging Utility
 * 
 * Use this in the browser console to debug token issues:
 * 
 * 1. Open browser console (F12)
 * 2. After logging in, run: checkToken()
 * 3. This will show you the token details and test it
 */

// Add this to window for easy access in console
if (typeof window !== 'undefined') {
  window.checkToken = function() {
    console.group('🔍 Token Debug Info');
    
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');
    const wallet = localStorage.getItem('wallet');
    
    console.log('Username:', username);
    console.log('User ID:', userId);
    console.log('Wallet:', wallet);
    console.log('Token present:', !!token);
    
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
      console.log('Token (last 30 chars):', '...' + token.substring(token.length - 30));
      console.log('Has whitespace:', token !== token.trim());
      console.log('Full token:', token);
      
      // Try to decode if it's a JWT
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          console.log('✅ Token appears to be JWT format (3 parts)');
          const payload = JSON.parse(atob(parts[1]));
          console.log('JWT Payload:', payload);
          
          if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            console.log('Token expires:', expDate);
            console.log('Time until expiry:', Math.floor((expDate - now) / 1000 / 60), 'minutes');
            console.log('Token expired:', now > expDate);
          }
        } else {
          console.log('⚠️ Token is NOT JWT format (not 3 parts)');
        }
      } catch (e) {
        console.log('⚠️ Could not decode token as JWT:', e.message);
      }
    } else {
      console.log('❌ No token found in localStorage');
    }
    
    console.groupEnd();
  };
  
  window.testTierStatus = async function() {
    console.group('🧪 Testing /me/tier-status');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ No token found');
      console.groupEnd();
      return;
    }
    
    const cleanToken = token.trim();
    console.log('Making request with token...');
    
    try {
      const response = await fetch('/api/proxy/me/tier-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✅ Request successful!');
      } else {
        console.error('❌ Request failed:', data.detail || data.message);
      }
    } catch (error) {
      console.error('❌ Request error:', error);
    }
    
    console.groupEnd();
  };
  
  window.clearAuth = function() {
    console.log('🗑️ Clearing all auth data from localStorage');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('wallet');
    localStorage.removeItem('user_tier_status');
    console.log('✅ Auth data cleared. You may need to refresh the page.');
  };
  
  console.log('🔧 Token debug utilities loaded!');
  console.log('Available commands:');
  console.log('  checkToken() - Check current token details');
  console.log('  testTierStatus() - Test the /me/tier-status endpoint');
  console.log('  clearAuth() - Clear all auth data');
}

export {};
