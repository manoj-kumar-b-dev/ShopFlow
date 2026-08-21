# Authentication & Authorization Testing Guide

## Quick Start Testing

### Before You Start
1. Ensure backend is running on `http://localhost:5000`
2. Ensure frontend is running on `http://localhost:5173` or `http://localhost:3000`
3. Have test accounts ready:
   - Regular User: `user@test.com` / `password123`
   - Admin User: `admin@test.com` / `password123`

---

## Test Scenarios

### Scenario 1: Regular User Login (Should Succeed) ✅

**Steps**:
1. Navigate to `http://localhost:5173/login`
2. Enter email: `user@test.com`
3. Enter password: `password123`
4. Click "Sign In"

**Expected Result**:
- ✅ Login succeeds
- ✅ Redirected to home page or dashboard
- ✅ User name displayed in navbar
- ✅ Admin link NOT visible in navbar
- ✅ Cart icon visible
- ✅ User data saved in localStorage with role: 'user'

**Verification**:
```javascript
// Check console (F12 → Application → LocalStorage)
localStorage.getItem('user') 
// Should show: {..., "role":"user", ...}
```

---

### Scenario 2: Admin Login Through User Page (Should Fail) ❌

**Steps**:
1. Navigate to `http://localhost:5173/login`
2. Enter email: `admin@test.com`
3. Enter password: `password123`
4. Click "Sign In"

**Expected Result**:
- ❌ Login FAILS
- ❌ Error message: "Admin accounts must login through the admin portal"
- ❌ Suggestion link to admin login shown
- ❌ NOT redirected to dashboard
- ❌ No token stored in localStorage
- ❌ Password field cleared

**Verification**:
```javascript
// Check console error
// Check Network tab: POST /api/auth/login → 403 Forbidden
```

---

### Scenario 3: Admin Login Through Admin Page (Should Succeed) ✅

**Steps**:
1. Navigate to `http://localhost:5173/admin/login`
2. Enter email: `admin@test.com`
3. Enter password: `password123`
4. Click "Enter Admin Console"

**Expected Result**:
- ✅ Admin login succeeds
- ✅ Redirected to `/admin` dashboard
- ✅ Admin dashboard visible
- ✅ Admin data saved in localStorage with role: 'admin'
- ✅ Admin menu items accessible

**Verification**:
```javascript
// Check console (F12 → Application → LocalStorage)
localStorage.getItem('user') 
// Should show: {..., "role":"admin", ...}
```

---

### Scenario 4: Regular User Login Through Admin Page (Should Fail) ❌

**Steps**:
1. Navigate to `http://localhost:5173/admin/login`
2. Enter email: `user@test.com`
3. Enter password: `password123`
4. Click "Enter Admin Console"

**Expected Result**:
- ❌ Login FAILS
- ❌ Error message: "This account does not have admin access"
- ❌ Suggestion link to customer login shown
- ❌ NOT redirected to admin dashboard
- ❌ No token stored
- ❌ Password field cleared

**Verification**:
```javascript
// Check Network tab: POST /api/auth/admin/login → 403 Forbidden
```

---

### Scenario 5: User Tries to Access Admin Dashboard Directly ❌

**Steps** (User logged in):
1. Login as regular user
2. Manually navigate to `http://localhost:5173/admin`

**Expected Result**:
- ❌ NOT redirected to admin dashboard
- ❌ Access Denied page shown
- ❌ Error message: "You do not have admin privileges"
- ❌ "Return to Home" button visible
- ❌ "Go Back" button available

---

### Scenario 6: Admin Tries to Access User Dashboard ❌

**Steps** (Admin logged in):
1. Login as admin
2. Manually navigate to `http://localhost:5173/dashboard`

**Expected Result**:
- ❌ Page NOT loaded normally
- ❌ Error/redirect shown
- ❌ Admin directed to admin dashboard
- ❌ Message explains admin accounts cannot access customer pages

---

### Scenario 7: Unauthenticated User Accesses Protected Route ❌

**Steps**:
1. Logout or use private browsing
2. Navigate to `http://localhost:5173/dashboard`

**Expected Result**:
- ❌ NOT shown dashboard
- ❌ Redirected to `/login` page
- ❌ Login page displayed

---

## API Endpoint Testing

### Test with Postman/cURL

#### Setup Token
```javascript
// 1. Login as user
POST http://localhost:5000/api/auth/login
Body: {
  "email": "user@test.com",
  "password": "password123"
}
// Response includes token - copy it

// 2. Login as admin
POST http://localhost:5000/api/auth/admin/login
Body: {
  "email": "admin@test.com",
  "password": "password123"
}
// Response includes token - copy it
```

---

### Test 1: Get Cart (User Token) ✅

**Request**:
```bash
GET http://localhost:5000/api/cart
Authorization: Bearer [USER_TOKEN]
```

**Expected**: 
- ✅ 200 OK
- ✅ Cart items returned

---

### Test 2: Get Cart (No Token) ❌

**Request**:
```bash
GET http://localhost:5000/api/cart
```

**Expected**:
- ❌ 401 Unauthorized
- ❌ Message: "Not authorized to access this route, token missing"

---

### Test 3: Get Admin Stats (Admin Token) ✅

**Request**:
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer [ADMIN_TOKEN]
```

**Expected**:
- ✅ 200 OK
- ✅ Admin statistics returned

---

### Test 4: Get Admin Stats (User Token) ❌

**Request**:
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer [USER_TOKEN]
```

**Expected**:
- ❌ 403 Forbidden
- ❌ Message: "Access denied: Administrative privileges required"

---

### Test 5: Get Admin Stats (No Token) ❌

**Request**:
```bash
GET http://localhost:5000/api/admin/stats
```

**Expected**:
- ❌ 401 Unauthorized
- ❌ Message: "Not authorized to access this route, token missing"

---

### Test 6: Create Order (User Token) ✅

**Request**:
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer [USER_TOKEN]
Body: {
  "items": [...],
  "totalAmount": 100,
  "paymentStatus": "pending"
}
```

**Expected**:
- ✅ 201 Created
- ✅ Order created

---

### Test 7: Get All Orders (User Token) ❌

**Request**:
```bash
GET http://localhost:5000/api/orders
Authorization: Bearer [USER_TOKEN]
```

**Expected**:
- ❌ 403 Forbidden (or appropriate business logic error)
- ❌ Admin endpoint denied to user

---

### Test 8: Get All Orders (Admin Token) ✅

**Request**:
```bash
GET http://localhost:5000/api/orders
Authorization: Bearer [ADMIN_TOKEN]
```

**Expected**:
- ✅ 200 OK
- ✅ All orders returned

---

## Browser DevTools Verification

### Check LocalStorage After Login
```javascript
// Press F12 → Application → LocalStorage

// After User Login:
localStorage.getItem('token')      // Should have token
localStorage.getItem('user')       // Should show {"role":"user", ...}

// After Admin Login:
localStorage.getItem('token')      // Should have token  
localStorage.getItem('user')       // Should show {"role":"admin", ...}
```

### Check Cookies
```javascript
// Press F12 → Application → Cookies

// Should see 'token' cookie with:
// - HttpOnly: true
// - Secure: true (production)
// - SameSite: Strict
// - Expires: 30 days from login
```

### Check JWT Token Payload
```javascript
// Decode token at https://jwt.io
// Paste token in Encoded box
// Check Payload:
{
  "id": "user_id",
  "role": "user",      // or "admin"
  "iat": ...,
  "exp": ...
}
```

---

## Network Tab Analysis

### Monitor Request Headers

1. **After Login**:
   - Open DevTools → Network tab
   - Reload page
   - Click on request
   - Check Headers → Authorization: Bearer [token]
   - Or check Cookies for token

2. **API Requests**:
   - All requests to protected routes should include token
   - Admin routes should include admin token

3. **Failed Requests**:
   - 401 Unauthorized - Missing/invalid token
   - 403 Forbidden - Token valid but insufficient permissions

---

## Security Verification Checklist

### Backend Security ✅
- [ ] Admin login endpoint rejects regular users with 403
- [ ] User login endpoint rejects admin users with 403
- [ ] Admin routes require both `protect` and `adminOnly` middleware
- [ ] User routes require `protect` middleware
- [ ] JWT token includes role in payload
- [ ] Invalid tokens rejected with 401
- [ ] Missing tokens rejected with 401

### Frontend Security ✅
- [ ] User cannot navigate to `/admin` (redirected or error shown)
- [ ] Admin cannot access user pages (error shown)
- [ ] Login pages show role-appropriate error messages
- [ ] ProtectedRoute validates role before rendering
- [ ] Navbar shows admin link only to admin users
- [ ] Cart/wishlist not accessible to unauthenticated users
- [ ] LocalStorage cleared on logout

### API Security ✅
- [ ] Admin endpoints reject user tokens (403)
- [ ] User endpoints reject admin tokens when appropriate
- [ ] All protected endpoints require token
- [ ] Public endpoints (products, categories) don't require token
- [ ] Payment webhook doesn't require token (necessary for Razorpay)

---

## Troubleshooting

### Issue: Admin login shows "Invalid credentials"
**Solution**: 
- Verify admin user exists in database
- Check password is correct
- Check user role is 'admin' in database

### Issue: User still sees admin menu after login
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check role in localStorage via DevTools

### Issue: Getting 403 on /api/admin routes with admin token
**Solution**:
- Verify token includes role: 'admin'
- Check JWT_SECRET is consistent between auth and verification
- Ensure `adminOnly` middleware is applied to routes
- Verify token is not expired

### Issue: Redirect to /login not working
**Solution**:
- Ensure ProtectedRoute component is properly imported
- Check `adminOnly` prop is correctly set
- Verify navigation logic in router configuration
- Check useLocation hook is working

### Issue: CORS errors on login
**Solution**:
- Verify frontend URL is in CORS allowedOrigins
- Check credentials: true is set in CORS config
- Ensure cookies are HttpOnly and not blocked

---

## Performance Testing

### Slow Admin Route Access
```javascript
// Check middleware order - protect should run before adminOnly
// Check database queries for N+1 problems
// Monitor network requests for slow responses
```

### Memory Leaks
```javascript
// Check useEffect cleanup in AuthContext
// Verify setInterval/setTimeout are cleared
// Monitor browser memory in DevTools
```

---

## Stress Testing

### Multiple Login Attempts
```javascript
// Test login rate limiter
// Verify authRateLimiter blocks excessive requests
// Check error messages for rate limit
```

### Token Expiration
```javascript
// Set short JWT expiration for testing
// Verify expired tokens are rejected
// Check refresh logic if implemented
```

---

## Security Test Results Template

Document your test results:

```markdown
## Security Testing Report - [DATE]

### Test Environment
- Backend: v1.0.0
- Frontend: v1.0.0
- Node Version: v18.x
- Browser: Chrome/Firefox/Safari

### Test Results

#### Scenario 1: User Login
- [ ] Passed
- [ ] Failed
- Notes: ...

#### Scenario 2: Admin on User Page
- [ ] Passed  
- [ ] Failed
- Notes: ...

[Continue for all scenarios...]

### Issues Found
- None / List any issues

### Recommendations
- All tests passed - production ready
- Or list any improvements needed

### Signed Off By
- Name: 
- Date:
- Role:
```

---

## Important Notes

1. **Always Test in Incognito Mode**: To avoid browser cache issues
2. **Clear LocalStorage Between Tests**: `localStorage.clear()` in console
3. **Monitor Network Tab**: See actual API responses and status codes
4. **Check Console**: For JavaScript errors and auth flow logs
5. **Verify Tokens**: Use jwt.io to decode and verify token payload
6. **Test Mobile**: Security should work on all devices

---

## Conclusion

All test scenarios should pass to confirm the security system is working correctly. If any test fails, check the error message and troubleshooting guide above before going to production.
