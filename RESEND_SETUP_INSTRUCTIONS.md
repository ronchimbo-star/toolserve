# Email Setup Instructions - IMPORTANT

Your repair requests are being saved successfully, but emails are not being sent because the Resend API key needs to be configured.

## Step 1: Get Your Resend API Key

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Create a free account (no credit card required)
3. Once logged in, go to **API Keys** in the sidebar
4. Click **"Create API Key"**
5. Name it: `ToolServe`
6. Select **"Sending access"** permission
7. Click **"Add"**
8. **IMPORTANT**: Copy the API key immediately (starts with `re_`)

## Step 2: Configure the API Key in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/hgdzhvotlwlffiwermoz)
2. Click on your project: **hgdzhvotlwlffiwermoz**
3. In the left sidebar, click **"Edge Functions"**
4. Look for the **"Manage secrets"** section or click **"Settings"**
5. Find **"Function Secrets"** or **"Edge Function Secrets"**
6. Add a new secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (the one you copied in Step 1)
7. Click **"Save"** or **"Add Secret"**

## Step 3: Verify Email Settings

### For Testing (No Domain Required)

If you don't have a domain set up yet, update the email sender to use Resend's test domain:

1. I'll update the edge functions to use `onboarding@resend.dev` for testing
2. This allows you to send test emails immediately

### For Production (Domain Required)

To use your own domain (`toolserve.co.uk`):

1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter: `toolserve.co.uk`
4. Add the DNS records to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record
5. Wait for verification (can take 1-48 hours)
6. Once verified, emails will be sent from `noreply@toolserve.co.uk`

## Step 4: Test Email Functionality

1. Go to your ToolServe website
2. Navigate to **"Submit Repair Request"**
3. Fill out a test repair request with your email address
4. Submit the form
5. Check your email inbox (and spam folder)
6. You should receive a confirmation email within seconds

## Step 5: Verify Email Delivery

Check Resend Dashboard:
1. Go to [https://resend.com/emails](https://resend.com/emails)
2. View all sent emails and their delivery status
3. Check for any errors or bounces

## Troubleshooting

### "Emails still not sending"
- Verify the RESEND_API_KEY is correctly set in Supabase
- Check Edge Function logs in Supabase for errors
- Make sure you saved the secret after adding it

### "Emails going to spam"
- This is normal for testing with `onboarding@resend.dev`
- Once you verify your domain, this should be resolved

### "API key invalid error"
- Make sure you copied the full API key (starts with `re_`)
- Regenerate the API key in Resend if needed
- Update the secret in Supabase with the new key

## Current Status

✅ **Database**: Working - Repair requests are being saved
❌ **Emails**: Not configured - Need to add RESEND_API_KEY

## Support

- Resend Documentation: [https://resend.com/docs](https://resend.com/docs)
- Supabase Edge Functions: [https://supabase.com/docs/guides/functions/secrets](https://supabase.com/docs/guides/functions/secrets)

---

Once you complete Step 2 (adding the RESEND_API_KEY to Supabase), your emails will start working immediately!
