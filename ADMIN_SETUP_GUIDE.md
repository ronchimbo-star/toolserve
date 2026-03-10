# Admin Setup Guide - Fresh Database

## Current Status: No Users in Database

Your Supabase database is fresh with no existing admin users. You need to create your first admin account!

## Quick Start: Create Your Admin Account

### Step 1: Go to Admin Setup Page

Add `?page=admin-setup` to your website URL:

**Local testing:**
```
http://localhost:5173/?page=admin-setup
```

**Live site:**
```
https://toolserve.co.uk/?page=admin-setup
```

### Step 2: Fill in the Setup Form

You'll see a beautiful setup form with three fields:

1. **Admin Email**: Enter your email (e.g., `ronchimbo@gmail.com`)
2. **Password**: Create a secure password (minimum 6 characters)
3. **Confirm Password**: Re-enter your password

### Step 3: Create Account

1. Click "Create Admin Account"
2. Wait for the green success notification
3. You'll be automatically logged in and taken to the admin dashboard!

## What If Setup Page Won't Show?

If you see "Setup Already Complete" but there are no users in Supabase:

1. The system might think setup is done based on `site_settings` table
2. Go directly to: `?page=admin-login`
3. Use the "Forgot Password" feature (requires email setup)
4. Or manually create a user in Supabase Dashboard

### Creating User Manually in Supabase Dashboard

1. Go to [Supabase Dashboard → Authentication → Users](https://supabase.com/dashboard/project/hgdzhvotlwlffiwermoz/auth/users)
2. Click "Add user" or "Invite user"
3. Enter your email and a temporary password
4. Save the user
5. Go to your site's login page: `?page=admin-login`
6. Sign in with the credentials you just created

## After Creating Your Admin Account

### Access the Admin Dashboard

**Login URL:** `?page=admin-login`

Use the email and password you created during setup.

### Dashboard Features

Once logged in, you have access to:

#### Content Management
- **Blog Posts** - Write and publish articles
- **Testimonials** - Add customer reviews
- **FAQs** - Manage common questions
- **Policy Pages** - Edit Terms, Privacy, Cookies

#### Business Operations
- **Repair Requests** - View and manage customer requests
- **Quotes** - Create and send quotes to customers
- **Site Settings** - Configure company info, contact details, branding

#### Analytics
- View request statistics
- Track repair statuses
- Monitor equipment types
- Recent activity feed

### Beautiful UI Features
- Color-coded toast notifications (green=success, red=error, blue=info)
- Responsive design for all devices
- Real-time updates
- Secure authentication

## Creating Additional Admin Users

### Method 1: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. The new user can log in at `?page=admin-login`

### Method 2: Via SQL (Advanced)

```sql
-- This requires running in Supabase SQL Editor
-- Replace email and password with actual values
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'new-admin@example.com',
  crypt('SecurePassword123!', gen_salt('bf')),
  NOW()
);
```

## Security Best Practices

1. **Strong Passwords**: Use mix of uppercase, lowercase, numbers, special characters
2. **Unique Accounts**: Each admin should have their own login
3. **Regular Updates**: Change passwords periodically
4. **Email Security**: Enable 2FA on your email account
5. **Monitor Access**: Check Supabase Auth logs for suspicious activity

## Password Recovery

### If You Forget Your Password

#### Option 1: Password Reset via Site (Requires Email Setup)

1. Go to `?page=admin-login`
2. Click "Forgot your password?"
3. Enter your admin email
4. Check email for reset link
5. Set new password

**Note**: Requires Resend API configuration. See `RESEND_SETUP_INSTRUCTIONS.md`

#### Option 2: Reset via Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user
3. Click "..." menu → "Send password recovery email"
4. Or manually update the password in the dashboard

#### Option 3: Recovery Code (If Available)

1. Go to `?page=admin-recovery`
2. Enter your recovery code (if you have one)
3. Enter your email
4. Set new password

See `PASSWORD_RECOVERY_INSTRUCTIONS.md` for details.

## Troubleshooting

### Can't Access Admin Setup Page?

**Problem**: Page shows "Setup Already Complete"
**Solution**: Go to login page instead: `?page=admin-login`

### Can't Create Account?

Check these:
- Password is at least 6 characters
- Passwords match exactly
- Email is valid format
- Check browser console for errors
- Verify `.env` has correct Supabase credentials

### Login Shows "Invalid Credentials"?

- Double-check email and password
- Ensure account was created successfully
- Try password reset if needed
- Check Supabase Dashboard → Users to verify account exists

### Session Expires Quickly?

This is normal Supabase security behavior. Simply log in again when prompted.

### Can't Receive Emails?

Email features require Resend API setup. See `RESEND_SETUP_INSTRUCTIONS.md` for configuration.

## Environment Variables

Ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/hgdzhvotlwlffiwermoz/settings/api)

## Database Tables

Your database includes these tables (from migrations):

- `admin_notifications` - Admin activity tracking
- `admin_recovery_tokens` - Password recovery codes
- `admin_tokens` - Bypass tokens (legacy, not used)
- `blog_posts` - Blog content
- `chat_conversations` - Chatbot history
- `faqs` - Frequently asked questions
- `policy_pages` - Terms, privacy, cookies
- `quotes` - Customer quotes
- `repair_requests` - Service requests
- `site_settings` - Site configuration
- `testimonials` - Customer reviews

Plus Supabase's built-in `auth.users` table for authentication.

## Next Steps After Setup

1. **Configure Site Settings** - Add company name, contact info, logo
2. **Add Initial Content** - Create some testimonials and FAQs
3. **Customize Policy Pages** - Update terms, privacy policy
4. **Write Blog Post** - Share your expertise
5. **Test Repair Request Form** - Submit a test request to see the flow
6. **Setup Email** (Optional) - Configure Resend for notifications

## Getting Help

If you encounter issues:

1. Check browser console for detailed errors
2. Verify Supabase project is active
3. Confirm `.env` variables are correct
4. Check Supabase Dashboard → Authentication → Users
5. Review this guide thoroughly

For Supabase-specific questions: https://supabase.com/docs/guides/auth

---

**Ready to start?** Go to `?page=admin-setup` and create your admin account now!
