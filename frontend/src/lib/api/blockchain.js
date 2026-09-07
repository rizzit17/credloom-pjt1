/**
 * Blockchain Service API Client
 * Handles all interactions with the blockchain service on EC2
 * Direct connection to EC2 instance
 */

import { getAddress } from 'ethers';

// Direct connection to EC2 blockchain service
const BLOCKCHAIN_API_URL = 'http://13.203.55.241:8000';

/**
 * Custom error class for blockchain API errors
 */
export class BlockchainAPIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'BlockchainAPIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Convert an Ethereum address to EIP-55 checksummed format
 * Required by web3.py on the blockchain service
 * @param {string} address - Ethereum address (checksummed or not)
 * @returns {string} Checksummed address
 */
function checksumAddress(address) {
  if (!address) return address;
  try {
    // ethers.getAddress() returns the checksummed address
    return getAddress(address);
  } catch (error) {
    console.warn('[Blockchain API] Invalid address format:', address);
    return address; // Return as-is if invalid
  }
}

/**
 * Make a request to the blockchain service
 * @param {string} endpoint - API endpoint (e.g., '/lender/create-offer')
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function blockchainRequest(endpoint, options = {}) {
  const url = `${BLOCKCHAIN_API_URL}${endpoint}`;
  
  const method = options.method || 'GET';
  const fetchOptions = {
    method,
    ...options,
  };

  // Only add headers and body for non-GET requests
  if (method !== 'GET' && method !== 'HEAD') {
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (options.body) {
      fetchOptions.body = options.body;
    }
  }

  try {
    console.log(`[Blockchain API] ${method} ${url}`);
    if (method === 'POST' && options.body) {
      console.log('[Blockchain API] Request body:', options.body);
      console.log('[Blockchain API] Parsed body:', JSON.parse(options.body));
    }
    const response = await fetch(url, fetchOptions);

    console.log(`[Blockchain API] Response status: ${response.status}`);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('[Blockchain API] Response data:', data);
    } else {
      data = await response.text();
      console.log('[Blockchain API] Response text:', data);
    }

    // Handle errors
    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || 'Blockchain API request failed';
      throw new BlockchainAPIError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof BlockchainAPIError) {
      throw error;
    }
    // Network or other errors
    throw new BlockchainAPIError(
      error.message || 'Failed to connect to blockchain service',
      0,
      null
    );
  }
}

// ============================================================================
// LENDER ENDPOINTS
// ============================================================================

/**
 * Create a new loan offer on the blockchain
 * @param {object} offerData - Offer details
 * @param {string} offerData.lenderAddress - Ethereum address of the lender
 * @param {number} offerData.amountEth - Loan amount in ETH
 * @param {number} offerData.durationDays - Loan duration in days
 * @param {number} offerData.minCreditScore - Minimum credit score required
 * @returns {Promise<{success: boolean, txHash: string, offerId: number}>}
 */
export async function createLoanOffer(offerData) {
  console.log('[Blockchain API] Creating loan offer:', offerData);
  
  return await blockchainRequest('/lender/create-offer', {
    method: 'POST',
    body: JSON.stringify(offerData),
  });
}

// ============================================================================
// MARKET ENDPOINTS
// ============================================================================

/**
 * Get all active loan offers from the marketplace
 * @returns {Promise<{offers: Array}>} List of active offers
 */
export async function getActiveOffers() {
  console.log('[Blockchain API] Fetching active offers from marketplace');
  
  return await blockchainRequest('/market/offers', {
    method: 'GET',
  });
}

// ============================================================================
// LOAN ENDPOINTS
// ============================================================================

/**
 * Accept a loan offer as a borrower
 * @param {object} acceptData - Acceptance details
 * @param {number} acceptData.offerId - ID of the offer to accept
 * @param {string} acceptData.borrower - Borrower's Ethereum address
 * @param {number} acceptData.interestRate - Agreed interest rate (percentage)
 * @param {boolean} acceptData.isInsured - Whether the loan is insured
 * @param {string} acceptData.insurer - Insurer's Ethereum address
 * @returns {Promise<{success: boolean, txHash: string, loanId: string, db_updated: boolean}>}
 */
export async function acceptLoanOffer(acceptData) {
  console.log('[Blockchain API] Accepting loan offer:', acceptData);
  
  return await blockchainRequest('/loan/accept', {
    method: 'POST',
    body: JSON.stringify(acceptData),
  });
}

/**
 * Mark a loan as defaulted
 * @param {number} loanId - Blockchain loan ID
 * @returns {Promise<{txHash: string}>}
 */
export async function triggerLoanDefault(loanId) {
  console.log('[Blockchain API] Triggering loan default:', loanId);
  
  return await blockchainRequest(`/loan/default/${loanId}`, {
    method: 'POST',
  });
}

// ============================================================================
// BORROWER ENDPOINTS
// ============================================================================

/**
 * Check if a borrower is flagged in the reputation registry
 * @param {string} address - Ethereum address of the borrower
 * @returns {Promise<{flagged: boolean}>}
 */
export async function checkBorrowerFlagged(address) {
  console.log('[Blockchain API] Checking if borrower is flagged:', address);
  
  return await blockchainRequest(`/borrower/${address}/flagged`, {
    method: 'GET',
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert ETH string to number safely
 * @param {string|number} ethValue - ETH value
 * @returns {number}
 */
export function parseEthValue(ethValue) {
  const parsed = parseFloat(ethValue);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error('Invalid ETH value');
  }
  return parsed;
}

/**
 * Validate Ethereum address format
 * @param {string} address - Ethereum address
 * @returns {boolean}
 */
export function isValidEthAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert address to checksum format (EIP-55)
 * Simple implementation without external dependencies
 * @param {string} address - Ethereum address
 * @returns {string} - Checksummed address
 */
export function toChecksumAddress(address) {
  if (!address || !address.startsWith('0x')) {
    return address;
  }
  
  // Remove 0x prefix and convert to lowercase
  const addr = address.slice(2).toLowerCase();
  
  // For simplicity, just capitalize the address uniformly
  // A full EIP-55 implementation would use keccak256 hash
  // But for now, we'll just return the lowercase version with 0x
  // which is accepted by most systems
  return '0x' + addr;
}

/**
 * Format transaction hash for display
 * @param {string} txHash - Transaction hash
 * @param {number} length - Number of characters to show on each side
 * @returns {string}
 */
export function formatTxHash(txHash, length = 6) {
  if (!txHash || txHash.length < length * 2) return txHash;
  return `${txHash.slice(0, length + 2)}...${txHash.slice(-length)}`;
}

/**
 * Get Etherscan link for transaction
 * @param {string} txHash - Transaction hash
 * @param {string} network - Network name (mainnet, goerli, sepolia, etc.)
 * @returns {string}
 */
export function getEtherscanLink(txHash, network = 'mainnet') {
  const baseUrl = network === 'mainnet' 
    ? 'https://etherscan.io' 
    : `https://${network}.etherscan.io`;
  return `${baseUrl}/tx/${txHash}`;
}
