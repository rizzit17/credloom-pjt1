/**
 * Borrower API endpoints
 */

import { post, get } from './client';

// Interest rate calculation backend URL
const INTEREST_RATE_BACKEND_URL = process.env.NEXT_PUBLIC_INTEREST_RATE_API || 'http://localhost:5000';

/**
 * Request a loan and get matching lenders
 * @param {number} amount - Requested loan amount
 * @returns {Promise<object>} Borrower info and matching lenders
 */
export async function requestLoan(amount) {
  return post('/borrower/requestloan', { amount }, true);
}

/**
 * Select a loan option from a lender
 * @param {object} loanData - Loan selection data
 * @param {number} loanData.loan_amt - Loan amount
 * @param {number} loanData.duration - Duration in days
 * @param {number} loanData.lender_id - Lender ID
 * @param {number} loanData.borrower_id - Borrower ID
 * @param {number} loanData.option_id - Option ID
 * @returns {Promise<object>} Loan ID and status
 */
export async function selectLoan(loanData) {
  return post('/borrower/selectloan', loanData, true);
}

/**
 * Get all loans for the authenticated borrower
 * @returns {Promise<object>} List of loans
 */
export async function getBorrowerLoans() {
  return get('/borrower/loans', true);
}

/**
 * Get details for a specific loan
 * @param {string} loanId - Loan ID
 * @returns {Promise<object>} Loan details
 */
export async function getBorrowerLoanDetail(loanId) {
  return get(`/borrower/${loanId}`, true);
}

/**
 * Get interest rate for borrower from interest rate calculation backend
 * @param {string} walletAddress - Borrower's wallet address
 * @returns {Promise<object>} Interest rate data including rate, credit score, tier, risk state
 */
export async function getInterestRate(walletAddress) {
  try {
    const url = `${INTEREST_RATE_BACKEND_URL}/user/getrate/${walletAddress}`;
    console.log('[InterestRate] Fetching rate from:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch interest rate: ${response.status}`);
    }

    const data = await response.json();
    console.log('[InterestRate] Rate data received:', data);
    return data;
  } catch (error) {
    console.error('[InterestRate] Error fetching interest rate:', error);
    throw error;
  }
}
