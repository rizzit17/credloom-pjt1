# API Integration Reference

This document maps the backend API test cases to the frontend implementation.

## API Endpoints

### 1. POST /auth/register

**Frontend Implementation:** `src/lib/api/auth.js` - `register(userData)`

**Usage in Frontend:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { register } = useAuth();
const result = await register({
  username: "user123",
  password: "StrongPass123!",
  wallet: "0x1111111111111111111111111111111111111111",
  tier: 1
});
```

**Test Cases Covered:**
- ✅ TC-REG-01: Register Tier 1 user
- ✅ TC-REG-02: Register Tier 2 user  
- ✅ TC-REG-03: Register Tier 3 user
- ✅ TC-REG-04: Invalid tier (handled by validation)
- ✅ TC-REG-05: Duplicate username (displays error message)

**Where Used:**
- Sign up forms: `/signup-borrower`, `/signup-lender`, `/signup-insurer`

---

### 2. POST /auth/login

**Frontend Implementation:** `src/lib/api/auth.js` - `login(username, password)`

**Usage in Frontend:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { login } = useAuth();
const result = await login("user123", "StrongPass123!");
```

**Test Cases Covered:**
- ✅ TC-LOGIN-01: Login success (redirects to dashboard)
- ✅ TC-LOGIN-02: Wrong password (displays error)
- ✅ TC-LOGIN-03: Unknown user (displays error)

**Where Used:**
- Sign in form: `/signin`

**Token Storage:**
- Access token stored in `localStorage` with key `access_token`
- Username stored with key `username`

---

### 3. GET /me/tier-status

**Frontend Implementation:** `src/lib/api/auth.js` - `getTierStatus()`

**Usage in Frontend:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { tierStatus, refreshTierStatus } = useAuth();

// tierStatus is automatically loaded on login
// Manual refresh:
await refreshTierStatus();
```

**Test Cases Covered:**
- ✅ TC-STATUS-01: Tier status (automatically fetched on login)
- ✅ TC-STATUS-02: No token (handled by API client, returns 401)

**Response Structure:**
```javascript
{
  username: "user123",
  wallet: "0x1111111111111111111111111111111111111111",
  tier: 1,
  tier2: {
    ens_verified: false,
    ens_name: null
  },
  tier3: {
    passport_verified: false,
    score: null,
    threshold: 15.0
  }
}
```

**Where Used:**
- Dashboard: `/dashboard`
- Auth context: Cached in state and localStorage
- Auto-refreshed after tier verifications

---

### 4. POST /{username}/tier2

**Frontend Implementation:** `src/lib/api/auth.js` - `verifyTier2(username, ensName)`

**Usage in Frontend:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { verifyTier2 } = useAuth();
const result = await verifyTier2("any-string-at-all");
```

**Test Cases Covered:**
- ✅ TC-T2-01: Tier 2 verify success with any string
- ✅ TC-T2-02: Tier 2 verify fails on empty string
- ✅ TC-T2-03: Username mismatch (handled by backend, shows 403 error)
- ✅ TC-T2-04: Missing token (handled by API client)
- ✅ TC-T2-05: Status reflects Tier 2 completion (auto-refreshes tier status)

**Where Used:**
- Component: `src/components/auth/Tier2Verification.jsx`
- Available on dashboard for Tier 2+ users

**Response Structure:**
```javascript
{
  verified: true,
  ens_name: "any-string-at-all",
  resolved_address: null
}
```

---

### 5. POST /{username}/tier3

**Frontend Implementation:** `src/lib/api/auth.js` - `verifyTier3(username, passportNumber)`

**Usage in Frontend:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { verifyTier3 } = useAuth();
const result = await verifyTier3("client-field");
```

**Test Cases Covered:**
- ✅ TC-T3-01: Tier 3 verification returns a decision
- ✅ TC-T3-02: Username mismatch (handled by backend, shows 403 error)
- ✅ TC-T3-03: Missing token (handled by API client)
- ✅ TC-T3-04: Server not configured (shows 500 error message)
- ✅ TC-T3-05: Status reflects Tier 3 decision (auto-refreshes tier status)

**Where Used:**
- Component: `src/components/auth/Tier3Verification.jsx`
- Available on dashboard for Tier 3 users

**Response Structure:**
```javascript
{
  verified: true,  // or false
  provider: "gitcoin",
  score: 18.5,      // or null
  threshold: 15.0
}
```

---

## Frontend Flow Diagrams

### Registration Flow

```
User fills form → SignUpForm validates → 
Calls register() → POST /auth/register → 
Success → Redirect to /signin → 
User can login
```

### Login Flow

```
User enters credentials → SignInForm validates → 
Calls login() → POST /auth/login → 
Token stored in localStorage → GET /me/tier-status → 
tierStatus cached → Redirect to /dashboard
```

### Tier 2 Verification Flow

```
User enters ENS name → Tier2Verification validates → 
Calls verifyTier2() → POST /{username}/tier2 → 
Auto-refresh tier status → GET /me/tier-status → 
UI updates with new status
```

### Tier 3 Verification Flow

```
User enters passport number → Tier3Verification validates → 
Calls verifyTier3() → POST /{username}/tier3 → 
Auto-refresh tier status → GET /me/tier-status → 
UI shows score and pass/fail status
```

---

## Error Handling

### API Client Error Handling
All API calls return a consistent structure:

```javascript
// Success
{
  success: true,
  data: { /* response data */ }
}

// Error
{
  success: false,
  error: "Error message string"
}
```

### Error Display
- Form validation errors shown inline below fields
- API errors shown in red alert banner at top of form
- Network errors caught and displayed to user

### HTTP Status Code Handling
- **401 Unauthorized:** Automatic logout, redirect to signin
- **403 Forbidden:** "Permission denied" error message
- **409 Conflict:** "Username already exists" (registration)
- **400 Bad Request:** Validation error message displayed
- **500 Internal Server Error:** "Server error" message

---

## Token Management

### Token Storage
```javascript
// Storage
localStorage.setItem('access_token', token);
localStorage.setItem('username', username);

// Retrieval
const token = localStorage.getItem('access_token');

// Cleanup (on logout)
localStorage.removeItem('access_token');
localStorage.removeItem('username');
```

### Token Usage
All authenticated requests automatically include:
```
Authorization: Bearer <token>
```

Handled automatically by `src/lib/api/client.js`

---

## State Management

### AuthContext State
```javascript
{
  user: {
    username: "user123"
  },
  tierStatus: {
    username: "user123",
    wallet: "0x...",
    tier: 1,
    tier2: { ens_verified: false, ens_name: null },
    tier3: { passport_verified: null, score: null, threshold: 15.0 }
  },
  loading: false,
  isAuthenticated: true
}
```

### Tier Status Caching
- Cached in `localStorage` with key `user_tier_status`
- Loaded on app initialization
- Refreshed after login
- Refreshed after tier verifications
- Cleared on logout

---

## Component Usage Examples

### Using Auth in a Component

```javascript
"use client"
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, tierStatus, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Your tier: {tierStatus.tier}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting a Page

```javascript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function SecretPage() {
  return (
    <ProtectedRoute requireTier={2}>
      <div>This page requires Tier 2+</div>
    </ProtectedRoute>
  );
}
```

---

## Environment Configuration

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production (when deployed)
```bash
NEXT_PUBLIC_API_URL=https://credloom-api.onrender.com
```

**Note:** Remember to update this when backend is deployed to Render!

---

## Testing Checklist

### Registration
- [ ] Register Tier 1 user (borrower signup)
- [ ] Register Tier 2 user (lender signup)
- [ ] Register Tier 3 user (insurer signup)
- [ ] Try duplicate username (should show error)
- [ ] Try invalid wallet address (should show error)
- [ ] Try weak password (should show error)

### Login
- [ ] Login with correct credentials
- [ ] Login with wrong password (should show error)
- [ ] Login with non-existent user (should show error)
- [ ] Check token is stored in localStorage
- [ ] Check redirect to /dashboard on success

### Dashboard
- [ ] View tier status after login
- [ ] Check username and wallet display
- [ ] Check tier badge shows correct tier
- [ ] Check tier 2 and tier 3 status indicators

### Tier 2 Verification
- [ ] Enter ENS name and verify (non-empty string)
- [ ] Try empty string (should fail)
- [ ] Check status updates after successful verification
- [ ] Check "already verified" state displays correctly

### Tier 3 Verification
- [ ] Enter passport number and verify
- [ ] Check score display (if returned)
- [ ] Check pass/fail status based on threshold
- [ ] Check status updates after verification
- [ ] Try re-verification

### Protected Routes
- [ ] Try accessing /dashboard without login (should redirect)
- [ ] Logout and check redirect to home
- [ ] Check token is cleared from localStorage on logout

---

## API Response Examples

### Successful Registration
```json
{
  "user_id": "abc123",
  "wallet": "0x1111111111111111111111111111111111111111",
  "username": "tc_t1_user_01",
  "tier": 1
}
```

### Successful Login
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Tier Status
```json
{
  "username": "tc_t1_user_01",
  "wallet": "0x1111111111111111111111111111111111111111",
  "tier": 1,
  "tier2": {
    "ens_verified": false,
    "ens_name": null
  },
  "tier3": {
    "passport_verified": false,
    "score": null,
    "threshold": 15.0
  }
}
```

### Tier 2 Verification Success
```json
{
  "verified": true,
  "ens_name": "vitalik.eth",
  "resolved_address": null
}
```

### Tier 3 Verification Result
```json
{
  "verified": true,
  "provider": "gitcoin",
  "score": 18.5,
  "threshold": 15.0
}
```

---

## Support

For questions or issues:
1. Check [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) for setup details
2. Review browser console for error messages
3. Check Network tab in DevTools for API responses
4. Verify environment variables are set correctly
5. Ensure backend is running and accessible
