# Role-Based Access Control Setup Guide

## Overview
Your application now has a complete role-based access control system where:
- **Users** have the default role `"user"` and can access customer features
- **Admins** have the role `"admin"` and can access admin dashboard features

## How It Works

### 1. User Profile Creation
When a user signs in (either via Email or Google):
1. The system checks if a user profile exists in Firestore under the `users` collection
2. If not, a new profile is created with:
   - `uid`: Firebase user ID
   - `email`: User email
   - `displayName`: Display name
   - `role`: "user" (default)
   - `createdAt`: Account creation timestamp
   - `lastLogin`: Last login timestamp

### 2. Role Verification
- When accessing routes marked with `requiredRole="admin"`:
  - The `ProtectedRoute` component checks Firestore for the user's role
  - Only users with `role: "admin"` are granted access
  - All others are redirected to the home page

### 3. Protected Routes
Admin-only routes:
```
/admin                  → Admin Dashboard Overview
/admin/menu            → Menu Management
/admin/customers       → Customer Management
/admin/promos          → Promotion Management
```

## Setting Up Admins

### Option 1: Firestore Console (Manual)
1. Go to Firebase Console → Firestore Database
2. Navigate to the `users` collection
3. Find the user document you want to make admin
4. Edit the `role` field and change it from "user" to "admin"
5. Save the changes

### Option 2: Use the Role Management Utility
In your application code:
```javascript
import { setUserRole } from '../config/roleManagement';

// Make a user admin
await setUserRole(userId, 'admin');

// Revert to regular user
await setUserRole(userId, 'user');
```

### Option 3: Create an Admin Panel Feature
You could add a management feature in the AdminDashboard to allow existing admins to promote other users to admin.

## Firestore Schema

### Users Collection Structure
```
users/
  {userId}/
    uid: string
    email: string
    displayName: string
    photoURL: string (nullable)
    role: "user" | "admin"
    createdAt: timestamp
    lastLogin: timestamp
    phone: string (optional)
    address: string (optional)
```

## Testing the Role System

### Test 1: Regular User Access
1. Sign in with a regular user account
2. Try to access `/admin` - should redirect to home page
3. Can access `/menu` and `/CustomerDashboard` ✓

### Test 2: Admin Access
1. Sign in with an admin account
2. Access `/admin` - should load admin dashboard ✓
3. All admin features should be accessible ✓

### Test 3: Promote User to Admin
1. Go to Firestore Console
2. Change a user's role to "admin"
3. Have that user log out and log back in
4. They should now be able to access admin features ✓

## Available Role Management Functions

### In `config/roleManagement.js`:

```javascript
// Get user's role
const role = await getUserRole(userId);

// Check if user is admin
const isAdmin = await isUserAdmin(userId);

// Set user role
await setUserRole(userId, 'admin');

// Create user profile
await createUserProfile(userId, { displayName: 'John Doe' });
```

## Security Considerations

1. **Client-Side Checks**: The current implementation checks roles client-side. For production, ensure your Firestore security rules also enforce role-based access.

2. **Firestore Security Rules** (Recommended):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admins can access admin collections
    match /menuItems/{document=**} {
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow read: if request.auth.uid != null;
    }
    
    match /promotions/{document=**} {
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow read: if request.auth.uid != null;
    }
  }
}
```

3. **Never Trust Client Alone**: Always verify roles on the backend before performing sensitive operations.

## Files Modified/Created

- ✅ `src/config/roleManagement.js` - Role utility functions
- ✅ `src/config/auth.js` - Updated to create user profiles
- ✅ `src/components/ProtectedRoute.jsx` - Now checks Firestore for roles
- ✅ `src/Pages/AdminDashboard.jsx` - Enhanced with role verification

## Troubleshooting

### Issue: User can't access admin dashboard
**Solution**: 
1. Check Firestore console - ensure user document exists
2. Verify the `role` field is exactly `"admin"` (case-sensitive)
3. User must log out and log back in after role change

### Issue: New user can't sign in
**Solution**:
1. Ensure the auth.js `ensureUserProfile` function is working
2. Check browser console for errors
3. Verify Firestore is writable

### Issue: Admin pages show "Access Denied"
**Solution**:
1. Confirm user has `role: "admin"` in Firestore
2. Clear browser cache and restart
3. Check that ProtectedRoute is properly checking roles
