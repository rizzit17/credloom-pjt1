# Credloom Authentication Integration

## Overview

The frontend has been successfully integrated with the Credloom authentication backend APIs. All Clerk dependencies have been removed and replaced with a custom JWT-based authentication system.

## ✅ Build Status

**Build successful!** All previous Clerk-related errors have been resolved.

## 🔧 What Was Implemented

### 1. API Service Layer
- **Location:** `src/lib/api/`
- **Files:**
  - `client.js` - Base API client with error handling, token management
  - `auth.js` - Authentication-specific API endpoints

**Features:**
- Automatic JWT token injection for authenticated requests
- Error handling with custom APIError class
- LocalStorage token persistence
- Support for all HTTP methods (GET, POST, PUT, DELETE)

### 2. Authentication Context
- **Location:** `src/contexts/AuthContext.jsx`
- **Features:**
  - Global auth state management
  - User session persistence
  - Tier status caching and refresh
  - Login, register, and logout functions
  - Tier 2 and Tier 3 verification functions

### 3. Protected Routes
- **Location:** `src/components/auth/ProtectedRoute.jsx`
- **Features:**
  - Automatic redirect to sign-in if not authenticated
  - Optional tier requirement validation
  - Loading states

### 4. Updated Auth Forms

#### Sign In Form
- **Location:** `src/components/auth/SignInForm.jsx`
- Changed from email to username-based authentication
- Integrated with `POST /auth/login` endpoint
- Shows API error messages
- Redirects to dashboard on success

#### Sign Up Form
- **Location:** `src/components/auth/SignUpForm.jsx`
- Fields: username, wallet address, password, confirm password
- Integrated with `POST /auth/register` endpoint
- Automatically assigns tier based on role selection
- Validates wallet address format (Ethereum)
- Redirects to sign-in on successful registration

### 5. Tier Verification Components

#### Tier 2 Verification
- **Location:** `src/components/auth/Tier2Verification.jsx`
- Allows ENS name verification
- Shows verification status
- Integrated with `POST /{username}/tier2` endpoint

#### Tier 3 Verification
- **Location:** `src/components/auth/Tier3Verification.jsx`
- Gitcoin Passport verification
- Shows score and threshold information
- Handles pass/fail states
- Integrated with `POST /{username}/tier3` endpoint

### 6. Dashboard Updates
- **Location:** `src/app/dashboard/page.js`
- Protected route (requires authentication)
- Displays tier status card
- Shows username and wallet address
- Tier 2 and Tier 3 status indicators
- Verification forms for eligible tiers
- Quick links to role-specific dashboards

## 📁 New File Structure

```
frontend/src/
├── lib/
│   └── api/
│       ├── client.js          # Base API client
│       └── auth.js            # Auth API endpoints
├── contexts/
│   └── AuthContext.jsx        # Global auth state
├── components/
│   └── auth/
│       ├── SignInForm.jsx     # Updated with API integration
│       ├── SignUpForm.jsx     # Updated with API integration
│       ├── ProtectedRoute.jsx # Route protection wrapper
│       ├── Tier2Verification.jsx
│       └── Tier3Verification.jsx
├── app/
│   ├── layout.js              # Updated with AuthProvider
│   └── dashboard/
│       └── page.js            # Updated with tier status display
├── .env.local                 # Environment variables
└── .env.example               # Environment template
```

## 🔌 API Endpoints Integrated

### Authentication
- ✅ `POST /auth/register` - User registration
- ✅ `POST /auth/login` - User login
- ✅ `GET /me/tier-status` - Get user tier status

### Tier Verification
- ✅ `POST /{username}/tier2` - Verify Tier 2 (ENS)
- ✅ `POST /{username}/tier3` - Verify Tier 3 (Passport)

## 🌐 Environment Variables

Update `.env.local` with your backend URL:

```bash
# For local development
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production (update when deployed to Render)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## 🚀 How to Use

### 1. Start the Development Server

```bash
npm run dev
```

### 2. User Registration Flow

1. Navigate to `/signup-borrower`, `/signup-lender`, or `/signup-insurer`
2. Fill in:
   - Username (min 3 characters)
   - Wallet address (Ethereum format: 0x...)
   - Password (min 8 characters)
3. System automatically assigns tier based on role:
   - Borrower → Tier 1
   - Lender → Tier 2
   - Insurer → Tier 3

### 3. User Login Flow

1. Navigate to `/signin`
2. Enter username and password
3. On success, redirects to `/dashboard`

### 4. Dashboard

- View current tier status
- See tier verification status
- Verify Tier 2 with ENS (if Tier 2+)
- Verify Tier 3 with Gitcoin Passport (if Tier 3)

### 5. Protected Routes

Wrap any page that requires authentication:

```jsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute requireTier={2}>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

## 🔐 Token Management

- Access tokens are stored in `localStorage` under the key `access_token`
- Tokens are automatically included in authenticated API requests
- Tokens are cleared on logout
- Invalid tokens trigger automatic logout

## 🎨 UI Features

- Error message display for API errors
- Loading states during API calls
- Success/failure feedback with color-coded messages
- Responsive design (mobile-friendly)
- Dark theme throughout

## 📊 State Management

The `AuthContext` provides:

```javascript
const {
  user,              // { username: string }
  tierStatus,        // Full tier status object
  loading,           // Boolean
  isAuthenticated,   // Boolean
  login,             // (username, password) => Promise
  register,          // (userData) => Promise
  logout,            // () => void
  refreshTierStatus, // () => Promise
  verifyTier2,       // (ensName) => Promise
  verifyTier3,       // (passportNumber) => Promise
} = useAuth();
```

## ⚠️ Important Notes

### Role to Tier Mapping
- Borrower → Tier 1
- Lender → Tier 2
- Insurer → Tier 3

### Wallet Address Format
- Must be a valid Ethereum address (0x + 40 hex characters)
- Example: `0x1234567890123456789012345678901234567890`

### Password Requirements
- Minimum 8 characters
- No special requirements (adjust in forms if needed)

### Testing
- Username and password authentication (no email)
- ENS verification accepts any non-empty string (for testing)
- Gitcoin Passport verification checks against actual API (requires backend config)

## 🔄 Next Steps

1. **Backend Deployment:**
   - Deploy backend to Render
   - Update `NEXT_PUBLIC_API_URL` in `.env.local`

2. **Additional Features:**
   - Add "forgot password" functionality
   - Implement token refresh mechanism
   - Add profile editing
   - Add email verification (if needed)

3. **Enhanced Security:**
   - Implement CSRF protection
   - Add rate limiting on frontend
   - Implement secure token storage (HttpOnly cookies)

4. **Testing:**
   - Write unit tests for API client
   - Write integration tests for auth flows
   - Add E2E tests with Playwright/Cypress

## 🐛 Troubleshooting

### Build fails with module errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### API calls failing
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check browser console for detailed errors
- Verify CORS is configured on backend

### Authentication not persisting
- Check browser localStorage (DevTools > Application > Local Storage)
- Ensure tokens are being saved correctly
- Check for token expiration

### Tier status not updating
- Call `refreshTierStatus()` from `useAuth()`
- Check `/me/tier-status` endpoint response
- Verify JWT token is valid

## 📝 Changes Summary

### Removed
- ❌ Clerk packages (`@clerk/nextjs`, `@clerk/themes`)
- ❌ All Clerk-related code and imports
- ❌ Email-based authentication forms

### Added
- ✅ Custom JWT authentication system
- ✅ API service layer with error handling
- ✅ Auth context for global state
- ✅ Protected route component
- ✅ Tier verification components
- ✅ Username + wallet auth flow
- ✅ Environment variable configuration

### Modified
- 🔄 `layout.js` - Added AuthProvider
- 🔄 `SignInForm.jsx` - Username-based, API integrated
- 🔄 `SignUpForm.jsx` - Added wallet field, API integrated
- 🔄 `dashboard/page.js` - Full tier status display

## ✨ Testing the Integration

1. **Start Backend** (if testing locally):
   ```bash
   # In backend directory
   uvicorn main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Flow**:
   - Register a new user at `/signup-borrower`
   - Login at `/signin`
   - View dashboard at `/dashboard`
   - Verify Tier 2 (ENS) if applicable
   - Verify Tier 3 (Passport) if applicable

---

## 🎉 Status: COMPLETE

All authentication APIs have been successfully integrated. The build is passing without errors. The system is ready for testing and deployment.
