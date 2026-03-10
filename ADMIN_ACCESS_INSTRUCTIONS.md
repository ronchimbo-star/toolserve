# Admin Access Instructions

## Quick Start - Create Your Admin Account

Since you don't have access to the Supabase dashboard, I've created a secure one-time setup page for you.

### Step 1: Access the Setup Page

Go to your website and add `?page=admin-setup` to the URL:

```
https://your-website.com/?page=admin-setup
```

Or if you're testing locally:

```
http://localhost:5173/?page=admin-setup
```

### Step 2: Create Your Admin Account

1. Enter your email address (e.g., `ronchimbo@gmail.com`)
2. Create a password (minimum 6 characters)
3. Confirm your password
4. Click "Create Admin Account"

The page will:
- Create your admin account in Supabase
- Automatically log you in
- Redirect you to the admin dashboard

### Step 3: Log In Normally

After the initial setup, use the regular admin login page:

```
https://your-website.com/?page=admin-login
```

Enter your email and password to access the admin dashboard.

## Security Features

### One-Time Setup Protection

The setup page automatically checks if an admin account already exists:

- **If no admin exists**: Setup page works normally
- **If admin exists**: Setup page shows a message and redirects to login
- **After setup**: Page becomes inaccessible for security

This prevents:
- Unauthorized account creation
- Multiple admin accounts without your knowledge
- Security vulnerabilities from exposed setup pages

### What Was Removed

The previous bypass login option was removed because:
- Token was visible on the public login page
- Anyone could access admin panel by clicking "Use bypass"
- Not secure for production use

### What Was Added

1. **Beautiful Toast Notifications**
   - Green for success
   - Red for errors
   - Amber for warnings
   - Blue for information
   - Auto-dismiss after 5 seconds
   - Smooth animations

2. **Secure One-Time Setup**
   - Only works when no admin exists
   - Creates proper Supabase authentication
   - Automatically disabled after first use

3. **Proper Authentication**
   - Email/password login
   - Session management
   - Password reset available
   - Secure token handling

## What You Can Do in Admin Dashboard

Once logged in, you can:

- View and manage repair requests
- Create and send quotes to customers
- Publish and manage blog posts
- Add/edit testimonials
- Manage FAQs
- Update site settings
- Upload logos and images
- Export data to CSV
- View analytics

All with beautiful toast notifications instead of black popups!

## Troubleshooting

### "Setup Already Complete" Message

If you see this message, an admin account already exists. Use the regular login page instead.

### Can't Remember Password

On the login page:
1. Click "Forgot your password?"
2. Enter your email
3. Check your email for reset link (requires Resend API setup)

### Alternative: Direct Database Access

If you need to reset everything and start fresh, you can:
1. Access your Supabase dashboard
2. Go to Authentication → Users
3. Delete all users
4. Return to the setup page to create a new admin

## Password Requirements

- Minimum 6 characters
- Can include letters, numbers, and special characters
- Should be unique and memorable

## Files Modified

### New Files
- `src/pages/AdminSetupPage.tsx` - One-time admin setup
- `ADMIN_ACCESS_INSTRUCTIONS.md` - This file

### Modified Files
- `src/App.tsx` - Added setup route and URL parameter handling
- `src/components/Toast.tsx` - Beautiful notification system
- All admin components - Using toast notifications

## Next Steps

1. **Access the setup page** at `?page=admin-setup`
2. **Create your admin account** with email and password
3. **Log in** and start managing your site
4. **Optional**: Set up Resend API for password reset emails

See `RESEND_SETUP_INSTRUCTIONS.md` for email configuration.

---

**Note**: The setup page is automatically protected and will only work once. After creating your admin account, always use the regular login page.
