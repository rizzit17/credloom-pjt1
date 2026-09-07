require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT secret - should be in .env file in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * Register a new user
 * 
 * @route POST /auth/register
 * @body {string} username - Unique username
 * @body {string} password - User password (will be hashed)
 * @body {string} wallet - Ethereum wallet address
 * @body {number} tier - User tier (default: 1)
 * @returns {Object} { user_id, username, wallet, tier }
 */
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password, wallet, tier = 1 } = req.body;
    
    // Validate required fields
    if (!username || !password || !wallet) {
      return res.status(400).json({ 
        detail: 'Username, password, and wallet address are required' 
      });
    }
    
    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return res.status(400).json({ 
        detail: 'Invalid Ethereum wallet address format' 
      });
    }
    
    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({ 
        detail: 'Username must be at least 3 characters' 
      });
    }
    
    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ 
        detail: 'Password must be at least 8 characters' 
      });
    }
    
    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ 
        detail: 'Username already exists' 
      });
    }
    
    // Check if wallet already exists
    const { data: existingWallet } = await supabase
      .from('users')
      .select('id')
      .eq('primary_wallet', wallet)
      .single();
    
    if (existingWallet) {
      return res.status(400).json({ 
        detail: 'Wallet address already registered' 
      });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Insert user into database
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        username,
        password_hash,
        primary_wallet: wallet,
        status: 'active'
      }])
      .select()
      .single();
    
    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({ 
        detail: `Failed to create user: ${userError.message}` 
      });
    }
    
    // Create profile for the user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        wallet,
        user_id: newUser.id,
        tier: tier
      }]);
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't fail the registration if profile creation fails
      // The user can still use the system
    }
    
    // Create credit profile for borrowers (can be used by all roles)
    const { error: creditError } = await supabase
      .from('credit_profiles')
      .insert([{
        wallet,
        tier: tier,
        credit_score: 650, // Default starting credit score
        risk_state: 'healthy',
        max_borrow_amount: tier === 1 ? 1000 : tier === 2 ? 5000 : 10000,
        max_loan_amount: tier === 1 ? 500 : tier === 2 ? 2500 : 5000,
        max_duration_days: 30,
        grace_days: 7,
        available_credit: tier === 1 ? 1000 : tier === 2 ? 5000 : 10000,
        utilization_rate: 0
      }]);
    
    if (creditError) {
      console.error('Error creating credit profile:', creditError);
      // Don't fail the registration
    }
    
    // Return success response
    return res.status(201).json({
      user_id: newUser.id,
      username: newUser.username,
      wallet: newUser.primary_wallet,
      tier: tier,
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      detail: `Registration failed: ${error.message}` 
    });
  }
});

/**
 * Login user
 * 
 * @route POST /auth/login
 * @body {string} username - Username
 * @body {string} password - User password
 * @returns {Object} { token, user_id, username, wallet }
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        detail: 'Username and password are required' 
      });
    }
    
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash, primary_wallet, status')
      .eq('username', username)
      .single();
    
    if (userError || !user) {
      return res.status(401).json({ 
        detail: 'Invalid username or password' 
      });
    }
    
    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(403).json({ 
        detail: 'Account is not active. Please contact support.' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        detail: 'Invalid username or password' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.id, 
        username: user.username,
        wallet: user.primary_wallet
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );
    
    // Return success response
    return res.status(200).json({
      token,
      access_token: token, // Alternative key for compatibility
      user_id: user.id,
      username: user.username,
      wallet: user.primary_wallet,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      detail: `Login failed: ${error.message}` 
    });
  }
});

// ============================================
// INTEREST RATE ENDPOINT
// ============================================

/**
 * Calculate interest rate based on credit score.
 * Adjust this logic based on your requirements.
 * 
 * Example logic:
 * - Credit score 750-850: 5-8% interest
 * - Credit score 650-749: 8-12% interest
 * - Credit score 550-649: 12-18% interest
 * - Credit score below 550: 18-25% interest
 * 
 * @param {number} creditScore - The user's credit score
 * @returns {number} The calculated interest rate
 */
function calculateInterestRate(creditScore) {
  let rate;
  
  if (creditScore >= 750) {
    // Lower credit score within range = higher rate
    rate = 5.0 + ((850 - creditScore) / 100) * 3.0;
  } else if (creditScore >= 650) {
    rate = 8.0 + ((750 - creditScore) / 100) * 4.0;
  } else if (creditScore >= 550) {
    rate = 12.0 + ((650 - creditScore) / 100) * 6.0;
  } else {
    rate = 18.0 + Math.max(0, (550 - creditScore) / 100) * 7.0;
  }
  
  // Cap the rate at a maximum (e.g., 25%)
  return Math.min(rate, 25.0);
}

/**
 * Get interest rate for a user based on their credit score.
 * 
 * @route POST /user/getrate/:wallet
 * @param {string} wallet - The user's wallet address (from path parameter)
 * @returns {Object} { interestRate: string, creditScore: number, tier: number, riskState: string }
 */
app.post('/user/getrate/:wallet', async (req, res) => {
  try {
    const walletAddress = req.params.wallet;
    
    // Validate wallet address format (basic check)
    if (!walletAddress || walletAddress.length < 10) {
      return res.status(400).json({ 
        detail: 'Invalid wallet address format' 
      });
    }
    
    // Query Supabase credit_profiles table for user's credit score
    const { data, error } = await supabase
      .from('credit_profiles')
      .select('credit_score, tier, risk_state, available_credit, max_loan_amount')
      .eq('wallet', walletAddress)
      .single();
    
    // Handle Supabase errors
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - wallet not found in credit_profiles
        return res.status(404).json({ 
          detail: `Credit profile not found for wallet ${walletAddress}` 
        });
      }
      throw error;
    }
    
    // Check if data exists
    if (!data) {
      return res.status(404).json({ 
        detail: `Credit profile not found for wallet ${walletAddress}` 
      });
    }
    
    // Extract credit score
    const creditScore = data.credit_score;
    
    if (creditScore === null || creditScore === undefined) {
      return res.status(400).json({ 
        detail: 'Credit score not available for this wallet' 
      });
    }
    
    // Check if user is in risky state
    if (data.risk_state === 'critical') {
      return res.status(403).json({ 
        detail: 'Account in critical risk state - lending restricted',
        riskState: data.risk_state
      });
    }
    
    // Calculate interest rate based on credit score
    const calculatedRate = calculateInterestRate(creditScore);
    
    // Return formatted response with additional context
    return res.status(200).json({
      interestRate: calculatedRate.toFixed(2),
      creditScore: creditScore,
      tier: data.tier,
      riskState: data.risk_state,
      availableCredit: data.available_credit,
      maxLoanAmount: data.max_loan_amount
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      detail: `Error processing request: ${error.message}` 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
