# Quick Auth Test Guide

## 🔍 Steps to Debug "Invalid or expired token" Error

### 1. Clear Everything and Start Fresh

Open browser console (F12) and run:
```javascript
localStorage.clear();
// Refresh the page
```

### 2. Login and Watch Console

Login with your credentials and look for these logs:

**Expected logs:**
```
[Auth] Logging in user: YOUR_USERNAME
[Auth] Login response keys: ['token', 'user_id', 'wallet']  ← Check this!
[Auth] Token stored in localStorage (length: 180)  ← Check length
[Auth] Token starts with: eyJhbGciOiJIUzI1Ni...  ← Check format
```

**⚠️ If you see:**
- `token: 'missing'` → Backend not returning token!
- `No token in login response!` → Check backend API
- Different keys → Backend uses different field name

### 3. Check Token Format

In browser console, run:
```javascript
const token = localStorage.getItem('access_token');
console.log('Full token:', token);
console.log('Token length:', token.length);
console.log('Is JWT?', token.split('.').length === 3);

// If JWT, decode it:
if (token.split('.').length === 3) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT Payload:', payload);
  console.log('Expires:', new Date(payload.exp * 1000));
  console.log('Is expired?', Date.now() > payload.exp * 1000);
}
```

### 4. Test Tier Status Endpoint

In browser console:
```javascript
// Test with current token
const token = localStorage.getItem('access_token');

fetch('/api/proxy/me/tier-status', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log).catch(console.error);
```

Watch for the response - it will show the exact error.

### 5. Common Fixes

#### Fix #1: Backend expects "Token" not "Bearer"

Edit `/src/lib/api/client.js` line 51:
```javascript
// Change from:
headers['Authorization'] = `Bearer ${cleanToken}`;

// To:
headers['Authorization'] = `Token ${cleanToken}`;
```

#### Fix #2: Wrong endpoint path

Edit `/src/lib/api/auth.js` line 148:
```javascript
// Try these variations:
const response = await get('/users/me/tier-status', true);
// or
const response = await get('/api/me/tier-status', true);
// or
const userId = getUserId();
const response = await get(`/users/${userId}/tier-status`, true);
```

#### Fix #3: Token field name mismatch

Already fixed! The code now checks for:
- `response.token`
- `response.access_token`
- `response.accessToken`

### 6. Test Backend Directly

Use this curl command to test the backend:

```bash
# Login
TOKEN=$(curl -s -X POST https://4048-128-185-112-57.ngrok-free.app/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"YOUR_USER","password":"YOUR_PASS"}' | jq -r '.token')

echo "Token: $TOKEN"

# Test tier-status
curl -X GET https://4048-128-185-112-57.ngrok-free.app/me/tier-status \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "ngrok-skip-browser-warning: true" \\
  -v
```

This will show you:
- If the token is being accepted
- What the backend returns
- Any error messages

### 7. Check Developer Tools Network Tab

1. Open DevTools → Network tab
2. Login again
3. Find the `/me/tier-status` request
4. Click on it and check:
   - **Request Headers** → Is `Authorization: Bearer ...` present?
   - **Response** → What error does backend return?
   - **Status Code** → 401? 403? 500?

## 📊 What to Share

If still stuck, share these from the console:

1. **Login response keys:**
   ```
   [Auth] Login response keys: [...]
   ```

2. **Token info:**
   ```
   Token length: XXX
   Token starts with: ...
   Is JWT?: true/false
   ```

3. **Tier status error:**
   ```
   Response: { detail: "..." }
   ```

4. **Network tab screenshot** of the failing request

## 🎯 Most Likely Issues (in order)

1. ✅ **Token format wrong** → Backend expects "Token" not "Bearer"
2. ✅ **Wrong endpoint** → Try `/users/me/tier-status`
3. ✅ **Token expired** → Check JWT expiration
4. ✅ **Wrong token field** → Already fixed (checks all variants)
5. ✅ **Backend issue** → Token validation failing on backend side

---

**After each change, restart the Next.js dev server:**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

Then clear localStorage and login fresh!
