/**
 * Base API Client for Credloom Backend
 * Handles all HTTP requests with error handling and token management
 */

// Base URL - uses Next.js API proxy to avoid CORS issues
const getBaseURL = () => {
  // In production or when using proxy, call Next.js API routes
  // Next.js will proxy to the actual backend server-side (no CORS)
  if (typeof window !== 'undefined') {
    // Client-side: always use Next.js proxy
    return '/api/proxy';
  }
  // Server-side: use direct backend URL if needed
  return process.env.BACKEND_API_URL || '/api/proxy';
};

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {object} options - Fetch options
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}, requiresAuth = false) {
  const url = `${getBaseURL()}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Trim token to remove any whitespace
      const cleanToken = token.trim();
      headers['Authorization'] = `Bearer ${cleanToken}`;
      console.log('[API] Request with auth to:', endpoint);
      console.log('[API] Auth header set, token length:', cleanToken.length);
    } else {
      console.warn('[API] Auth required but no token found for:', endpoint);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Check if request was successful
    if (!response.ok) {
      // Log detailed error info for debugging
      console.error('[API] Request failed:', {
        endpoint,
        status: response.status,
        error: data?.detail || data?.message,
        fullData: data
      });
      throw new APIError(
        data?.detail || data?.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

/**
 * GET request
 */
export async function get(endpoint, requiresAuth = false) {
  return apiRequest(endpoint, { method: 'GET' }, requiresAuth);
}

/**
 * POST request
 */
export async function post(endpoint, data, requiresAuth = false) {
  return apiRequest(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    requiresAuth
  );
}

/**
 * PUT request
 */
export async function put(endpoint, data, requiresAuth = false) {
  return apiRequest(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    requiresAuth
  );
}

/**
 * DELETE request
 */
export async function del(endpoint, requiresAuth = false) {
  return apiRequest(endpoint, { method: 'DELETE' }, requiresAuth);
}
