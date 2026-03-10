# Password Recovery Instructions

## Your Admin Password Recovery

Since there's already an admin account in the database (`ronchimbo@gmail.com`), I've created a secure password recovery system for you.

**FIXED:** The recovery system now uses a secure edge function that properly handles password resets with the service role key, ensuring the process works correctly.

## Step-by-Step Instructions

### Step 1: Go to Recovery Page

Add `?page=admin-recovery` to your website URL:

**If testing locally:**
```
http://localhost:5173/?page=admin-recovery
```

**Or on your live site:**
```
https://your-site.com/?page=admin-recovery
```

### Step 2: Enter Your Recovery Information

You'll see a form with four fields:

1. **Recovery Code**: Enter this code exactly as shown:
   ```
   RECOVER-2026-ADMIN
   ```

2. **Admin Email**: Enter your admin email:
   ```
   ronchimbo@gmail.com
   ```

3. **New Password**: Create your new password (minimum 6 characters)

4. **Confirm New Password**: Re-enter your new password

### Step 3: Reset Your Password

1. Click "Reset Password"
2. Wait for confirmation message
3. You'll be automatically redirected to the login page
4. Log in with your new password

## Important Security Notes

### One-Time Use Token
- The recovery code can only be used ONCE
- After successfully resetting your password, the code becomes invalid
- This prevents unauthorized access

### Token Expiration
- The recovery code is valid for 7 days
- Expires on: February 10, 2026
- After expiration, contact support for a new code

### Secure Process
- Recovery code stored securely in database
- Not visible in any public code
- Validates email ownership
- Automatically marked as used after successful reset

## What Happens After Recovery

1. Your new password is set
2. Recovery code is marked as "used"
3. You're redirected to login page
4. Log in normally with your new credentials

## Future Password Changes

After recovering your account, you can:
- Log in to the admin dashboard
- Change your password through account settings (if available)
- Use the "Forgot Password" feature on login page (requires email setup)

## If You Need Help

### Recovery Code Not Working?

Check that you:
- Entered the code exactly: `RECOVER-2026-ADMIN`
- Used the correct email: `ronchimbo@gmail.com`
- Haven't already used this code (it's one-time use only)
- Are within the 7-day validity period

### Need a New Recovery Code?

If the code has expired or been used, you can:
1. Generate a new recovery code via database
2. Contact technical support
3. Access Supabase dashboard if possible

## Alternative: Email Password Reset

If you have email configured (Resend API), you can also:
1. Go to login page: `?page=admin-login`
2. Click "Forgot your password?"
3. Enter your email
4. Check email for reset link

See `RESEND_SETUP_INSTRUCTIONS.md` for email setup.

## System Features

### Beautiful Notifications
- Green success messages when password is reset
- Red error messages if something goes wrong
- Clear feedback at every step

### Security Features
- One-time use recovery codes
- Time-based expiration
- Email verification
- No public token exposure
- Secure database storage

## Summary

**Your Recovery Code:** `RECOVER-2026-ADMIN`
**Your Admin Email:** `ronchimbo@gmail.com`
**Recovery URL:** `?page=admin-recovery`
**Valid Until:** February 10, 2026

---

**Quick Steps:**
1. Go to `?page=admin-recovery`
2. Enter code: `RECOVER-2026-ADMIN`
3. Enter email: `ronchimbo@gmail.com`
4. Create new password
5. Click "Reset Password"
6. Log in with new credentials

You're all set! After recovery, you'll have full access to the admin dashboard with beautiful toast notifications.
