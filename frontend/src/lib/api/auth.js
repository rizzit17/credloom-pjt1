/**
 * Authentication API endpoints
 */

import { post, get } from './client';

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {string} userData.wallet - Wallet address
 * @param {string} userData.role - Role (borrower, lender, insurer) - stored locally only
 * @returns {Promise<object>} User object with user_id, wallet, username, tier
 */
export async function register(userData) {
  // Backend only accepts username, password, wallet, tier
  // Role is frontend-only concept, stored locally
  const registrationData = {
    username: userData.username,
    password: userData.password,
    wallet: userData.wallet,
    tier: 1  // Everyone starts at Tier 1
  };
  
  const response = await post('/auth/register', registrationData);
  
  // Store role locally for frontend use (role is frontend-only concept)
  if (response.username || userData.username) {
    const username = response.username || userData.username;
    localStorage.setItem(`role_${username}`, userData.role);
  }
  
  // Store additional user data if returned
  if (response.user_id) {
    localStorage.setItem('user_id', response.user_id.toString());
  }
  if (response.wallet) {
    localStorage.setItem('wallet', response.wallet);
  }
  
  return response;
}

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Token object with token, wallet, and user_id
 */
export async function login(username, password) {
  console.log('[Auth] Logging in user:', username);
  const response = await post('/auth/login', { username, password });
  console.log('[Auth] Login response keys:', Object.keys(response));
  console.log('[Auth] Login response:', { 
    ...response, 
    token: response.token ? '***' : 'missing',
    access_token: response.access_token ? '***' : 'missing'
  });
  
  // Store token and user data in localStorage
  // Backend might return 'token', 'access_token', or 'accessToken'
  const token = response.token || response.access_token || response.accessToken;
  
  if (token) {
    // Trim token to remove any whitespace
    const cleanToken = token.trim();
    localStorage.setItem('access_token', cleanToken);
    localStorage.setItem('username', username);
    console.log('[Auth] Token stored in localStorage (length:', cleanToken.length, ')');
    console.log('[Auth] Token starts with:', cleanToken.substring(0, 20) + '...');
    
    // Store additional user data
    if (response.user_id) {
      localStorage.setItem('user_id', response.user_id.toString());
    }
    if (response.wallet) {
      localStorage.setItem('wallet', response.wallet);
    }
  } else {
    console.error('[Auth] No token in login response!');
    console.error('[Auth] Response structure:', response);
  }
  
  return response;
}

/**
 * Get user's role (stored locally)
 * @returns {string|null}
 */
export function getUserRole() {
  const username = getUsername();
  if (!username) return null;
  return localStorage.getItem(`role_${username}`);
}

/**
 * Get stored user ID
 * @returns {number|null}
 */
export function getUserId() {
  const userId = localStorage.getItem('user_id');
  return userId ? parseInt(userId, 10) : null;
}

/**
 * Get stored wallet address
 * @returns {string|null}
 */
export function getWallet() {
  return localStorage.getItem('wallet');
}

/**
 * Logout user (client-side)
 */
export function logout() {
  const username = getUsername();
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
  localStorage.removeItem('user_tier_status');
  localStorage.removeItem('user_id');
  localStorage.removeItem('wallet');
  if (username) {
    localStorage.removeItem(`role_${username}`);
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

/**
 * Get stored username
 * @returns {string|null}
 */
export function getUsername() {
  return localStorage.getItem('username');
}

/**
 * Get user's tier status
 * @returns {Promise<object>} Tier status object
 */
export async function getTierStatus() {
  const token = localStorage.getItem('access_token');
  console.log('[Auth] Getting tier status, token present:', !!token);
  
  if (!token) {
    console.error('[Auth] No access token found in localStorage!');
    throw new Error('No access token available');
  }
  
  // Trim token and log details
  const cleanToken = token.trim();
  console.log('[Auth] Token length:', cleanToken.length);
  console.log('[Auth] Token starts with:', cleanToken.substring(0, 20) + '...');
  console.log('[Auth] Making request to /me/tier-status with Bearer token');
  
  const response = await get('/me/tier-status', true);
  console.log('[Auth] Tier status response:', response);
  
  // Cache the tier status
  localStorage.setItem('user_tier_status', JSON.stringify(response));
  
  return response;
}

/**
 * Get cached tier status (without API call)
 * @returns {object|null}
 */
export function getCachedTierStatus() {
  const cached = localStorage.getItem('user_tier_status');
  return cached ? JSON.parse(cached) : null;
}

/**
 * Verify Tier 2 (ENS)
 * @param {string} username - Username
 * @param {string} ensName - ENS name
 * @returns {Promise<object>} Verification result
 */
export async function verifyTier2(username, ensName) {
  return post(`/${username}/tier2`, { ens_name: ensName }, true);
}

/**
 * Verify Tier 3 (Passport/Gitcoin)
 * @param {string} username - Username
 * @param {string} passportNumber - Passport number
 * @returns {Promise<object>} Verification result
 */
export async function verifyTier3(username, passportNumber) {
  return post(`/${username}/tier3`, { passport_number: passportNumber }, true);
}
