# Email Notification Setup Guide

This guide will help you set up email notifications for repair request confirmations and status updates using Resend.

## Why Resend?

Resend is a modern email API service that's:
- Easy to set up and use
- Affordable (free tier: 100 emails/day, 3,000/month)
- Reliable and fast
- Developer-friendly with great documentation
- No credit card required for free tier

## Setup Steps

### 1. Create a Resend Account

1. Go to [Resend.com](https://resend.com)
2. Click **"Sign Up"** or **"Start for Free"**
3. Create your account using email or GitHub
4. Verify your email address

### 2. Get Your API Key

1. Once logged in, go to **API Keys** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name: `ToolServe Production`
4. Select **"Full Access"** (needed for sending emails)
5. Click **"Create"**
6. **Important**: Copy the API key immediately - you won't see it again!
7. Save it somewhere secure (you'll need it in the next step)

### 3. Configure Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `toolserve.co.uk`
4. Add the DNS records provided by Resend to your domain registrar:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT)
5. Wait for DNS propagation (can take 1-48 hours)
6. Click **"Verify"** in Resend dashboard

**For testing**: You can skip this step and use `onboarding@resend.dev` as the sender (limited to 1 recipient per day).

### 4. Configure Supabase Edge Function

The API key is automatically configured in your Supabase environment. The edge function `send-email` is already deployed and ready to use.

To verify:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Edge Functions**
3. You should see `send-email` listed as deployed

### 5. Update Email Sender (After Domain Verification)

Once your domain is verified, update the sender email in the edge function:

1. Open `supabase/functions/send-email/index.ts`
2. Find this line (around line 330):
   ```typescript
   from: "ToolServe <noreply@toolserve.co.uk>",
   ```
3. Make sure it matches your verified domain
4. Redeploy the function if needed

**For testing without a verified domain:**
```typescript
from: "ToolServe <onboarding@resend.dev>",
```

### 6. Test Email Notifications

Test that emails are working:

1. Go to your ToolServe application
2. Submit a test repair request
3. Check the email inbox for the address you used
4. You should receive a confirmation email within seconds

**Troubleshooting**:
- Check your spam folder
- Verify the Resend API key is correct
- Check browser console for error messages
- Check Supabase Edge Function logs

## Email Templates Included

The system includes three professional email templates:

### 1. Repair Request Confirmation
**Sent when**: Customer submits a new repair request
**Includes**:
- Thank you message
- Reference number (if available)
- Request details
- Next steps
- Contact information

### 2. Status Update Notification
**Sent when**: Admin updates request status
**Includes**:
- Current status (diagnosing, in repair, completed)
- Status-specific message
- Estimated completion date (if provided)
- Additional notes from admin
- Contact information

### 3. Completion Notification
**Sent when**: Repair is marked as completed
**Includes**:
- Completion confirmation
- Collection/delivery instructions
- Request summary
- Thank you message
- Feedback request

## Sending Emails from Admin Dashboard

To send status update emails when changing request status:

The email integration is already built into the repair request form. For admin dashboard integration (coming soon), you'll be able to:

1. View a repair request
2. Change its status
3. Add optional notes
4. Click "Update & Notify" to send an email automatically

## Email Sending Limits

### Resend Free Tier
- **100 emails per day**
- **3,000 emails per month**
- **1 domain**
- **Unlimited API keys**

### If You Need More
Upgrade to Resend Pro:
- **50,000 emails per month** for $20/month
- Additional emails: $1 per 1,000 emails
- Unlimited domains
- Better support

## Monitoring Email Delivery

### View Sent Emails

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Click **"Emails"** in the sidebar
3. See all sent emails with:
   - Delivery status
   - Open rate
   - Click rate
   - Bounce information

### Email Analytics

Track:
- Delivery rate
- Open rate
- Bounce rate
- Spam complaints

Use this data to improve email content and deliverability.

## Best Practices

### 1. Email Content
- Keep emails concise and clear
- Use branded colors (#f97316 orange)
- Include clear calls-to-action
- Provide contact information
- Add unsubscribe option (for marketing emails)

### 2. Deliverability
- Verify your domain (SPF, DKIM, DMARC)
- Use a consistent sender email
- Avoid spammy words in subject lines
- Monitor bounce and complaint rates
- Keep email list clean

### 3. Security
- Never expose API keys in frontend code
- Use environment variables for secrets
- Rotate API keys periodically
- Monitor for unauthorized usage
- Set up rate limiting if needed

### 4. Testing
- Test with multiple email providers (Gmail, Outlook, Yahoo)
- Check mobile rendering
- Verify links work correctly
- Test spam score using [Mail Tester](https://www.mail-tester.com/)

## Troubleshooting

### Emails Not Being Received

**Possible causes**:
1. **Spam folder**: Check recipient's spam/junk folder
2. **Domain not verified**: Verify your domain in Resend
3. **API key issue**: Check API key is correct and has full access
4. **Rate limit**: Check you haven't exceeded daily/monthly limits
5. **Invalid recipient**: Ensure email address is valid

**Solutions**:
- Check Resend dashboard for delivery status
- Look at Edge Function logs in Supabase
- Verify API key has correct permissions
- Check browser console for errors

### Emails Going to Spam

**Common reasons**:
1. Domain not verified
2. Missing SPF/DKIM records
3. Spam-like content
4. Low sender reputation

**Solutions**:
- Complete domain verification
- Add all DNS records
- Avoid excessive links/images
- Use professional email content
- Monitor spam complaint rate

### API Errors

**Error**: "API key invalid"
- **Solution**: Check API key in Supabase secrets, regenerate if needed

**Error**: "Rate limit exceeded"
- **Solution**: Wait for limit reset or upgrade Resend plan

**Error**: "Domain not verified"
- **Solution**: Complete domain verification or use onboarding@resend.dev

## Alternative Email Services

If you prefer to use a different service:

### SendGrid
- More features
- Higher free tier (100 emails/day forever)
- More complex setup

### AWS SES
- Very affordable at scale
- Requires AWS account
- More technical setup

### Postmark
- Great for transactional emails
- 100 emails/month free
- Easy to use

To switch services, update the edge function at `supabase/functions/send-email/index.ts` to use the new provider's API.

## Support

### Resend Support
- [Documentation](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [Email Support](mailto:support@resend.com)
- [Discord Community](https://discord.gg/resend)

### ToolServe Email Issues
- Check Edge Function logs in Supabase
- Review browser console errors
- Test API key validity
- Verify domain configuration

---

**Setup Complete!** Your ToolServe application can now send professional email notifications to customers. 📧
