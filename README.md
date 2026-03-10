# ToolServe - Repair & Sustainability Portal

A comprehensive web application for ToolServe, a UK-based tool and appliance repair company focused on sustainability and waste reduction.

## Features

### Public-Facing Features
- **Homepage**: Mission statement, statistics, testimonials, and clear calls-to-action
- **Services Page**: Detailed information about repair, servicing, and bulk project services
- **Repair Request Form**: Easy-to-use form for submitting repair requests with photo upload support (no login required)
- **Photo Upload**: Drag-and-drop image upload for repair requests (up to 5 photos, 2MB each)
- **Email Notifications**: Automated confirmation emails sent to customers upon request submission
- **Sustainability Page**: Environmental impact metrics and case studies
- **Blog System**: Dynamic blog with categories, search, and individual post pages
- **Contact Page**: Multiple contact methods and quick action cards
- **AI Chatbot**: OpenAI-powered assistant for instant customer support and FAQs

### Admin Features
- **Secure Authentication**: Email/password login for admin access
- **Request Management**: View and update status of all repair requests
- **Blog Management**: Create, edit, publish, and manage blog posts
- **Dashboard**: Overview of requests and content

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS (with custom orange color scheme)
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database + Authentication + Storage + Edge Functions)
- **Email Service**: Resend (for transactional emails)
- **AI**: OpenAI GPT-4o-mini (chatbot)
- **Build Tool**: Vite

## Database Schema

### Tables

#### repair_requests
Stores customer repair submissions with fields for:
- Customer details (name, email, phone, address)
- Equipment information (type, make, model, serial number)
- Service type (repair, servicing, bulk)
- Issue description
- Status tracking (received, diagnosing, in_repair, completed, cancelled)
- Timestamps

#### blog_posts
Manages blog content with:
- Title, slug, content, excerpt
- Category and featured image
- SEO metadata (meta description, keywords)
- Published status and date
- View count tracking

#### chat_conversations
Stores chatbot conversations for analytics:
- Session ID for tracking conversation threads
- User and assistant messages
- Timestamps and optional user email
- Context data for analytics

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Supabase project (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Admin Access

To access the admin dashboard:

1. Create an admin user in Supabase:
   - Go to your Supabase dashboard
   - Navigate to Authentication > Users
   - Click "Add User"
   - Create an account with your email and password

2. Access the admin panel by navigating to the admin route (hidden from public navigation)

3. Sign in with your credentials to access:
   - Repair request management
   - Blog post creation and editing
   - Status updates and analytics

## Usage Guide

### For Customers

**Submitting a Repair Request:**
1. Click "Request Repair" in the navigation or homepage
2. Fill out your contact details
3. Provide equipment information
4. Describe the issue
5. Submit the form - you'll receive confirmation

**Reading Blog Content:**
1. Visit the Blog page
2. Filter by category if desired
3. Click any post to read the full content

**Using the AI Chatbot:**
1. Look for the chat button in the bottom-right corner of any page
2. Click to open the chat interface
3. Ask questions about services, pricing, turnaround times, or sustainability
4. The AI assistant provides instant answers based on ToolServe's information
5. For complex issues, the chatbot will guide you to contact the team directly

### For Administrators

**Managing Repair Requests:**
1. Log in to the admin dashboard
2. View all requests in the Repair Requests tab
3. Update status using the dropdown (received → diagnosing → in_repair → completed)
4. Click "View Details" for full request information

**Managing Blog Posts:**
1. Go to the Blog Posts tab
2. Click "Create New Post" to add content
3. Toggle published status to make posts live
4. Edit or delete existing posts

## SEO Optimization

The application includes:
- Comprehensive meta tags for all pages
- Open Graph and Twitter Card support
- UK geo-targeting metadata
- Descriptive titles and descriptions
- Semantic HTML structure
- Fast loading times

## AI Chatbot

The application includes a fully functional AI-powered chatbot using OpenAI's GPT-4o-mini model.

### Features
- Instant responses to customer queries
- Knowledge about all ToolServe services, pricing, and processes
- Conversation history maintained during session
- Accessible from all public pages via floating button
- Graceful error handling with fallback messages
- Conversations stored in database for analytics

### Configuration
The chatbot is powered by a Supabase Edge Function that communicates with OpenAI's API. The OpenAI API key is automatically configured in the Supabase environment.

### Customization
To modify the chatbot's knowledge or behavior:
1. Edit the `SYSTEM_PROMPT` in `supabase/functions/chat/index.ts`
2. Redeploy the edge function
3. The chatbot will immediately use the updated information

## Photo Upload System

The application includes a fully functional photo upload system for repair requests.

### Features
- Drag-and-drop interface for easy uploads
- Support for JPG, PNG, and WebP formats
- Up to 5 photos per request (2MB max per image)
- Client-side image validation
- Real-time upload progress
- Preview thumbnails with file sizes
- Secure storage in Supabase

### Setup Required
Before photo uploads will work, you need to:
1. Create a Supabase Storage bucket named `repair-request-photos`
2. Configure access policies for public upload
3. See `SUPABASE_STORAGE_SETUP.md` for detailed instructions

## Email Notification System

Automated email notifications are sent to customers using Resend.

### Features
- Professional HTML email templates
- Confirmation emails upon request submission
- Status update notifications (coming soon to admin dashboard)
- Completion notifications
- Responsive email design
- Plain text fallbacks

### Setup Required
Before emails will send, you need to:
1. Create a Resend account (free tier: 100 emails/day)
2. Get your API key
3. Optionally verify your domain for production use
4. See `EMAIL_SETUP.md` for detailed instructions

### Email Templates
- **Repair Confirmation**: Sent immediately after request submission
- **Status Update**: Sent when request status changes
- **Completion Notice**: Sent when repair is completed

## Future Enhancements

### Planned Features
1. **Customer Portal**: Track repair status with unique reference numbers
2. **Advanced Analytics**: Request trends, chatbot usage, and performance metrics
3. **Payment Integration**: Online quotes and payment processing with Stripe
4. **Status Update Emails from Admin**: Send emails directly from admin dashboard
5. **SMS Notifications**: Optional text message alerts
6. **Chatbot Learning**: Use stored conversations to improve responses over time

### How to Add Features

## Support & Maintenance

### Common Tasks

**Updating Content:**
- Homepage stats: Edit `src/pages/HomePage.tsx`
- Services information: Edit `src/pages/ServicesPage.tsx`
- Contact details: Edit `src/pages/ContactPage.tsx` and `src/components/Footer.tsx`

**Adding Blog Posts:**
Use the admin dashboard or insert directly into the database:
```sql
INSERT INTO blog_posts (title, slug, content, category, published)
VALUES ('Your Title', 'your-slug', 'Content here', 'Category', true);
```

**Troubleshooting:**
- Database connection issues: Check `.env` file for correct Supabase credentials
- Build errors: Run `npm install` to ensure all dependencies are installed
- Authentication issues: Verify Supabase auth configuration

## License

Copyright 2024 ToolServe. All rights reserved.

## Contact

For technical support or questions about this application:
- Website: www.toolserve.co.uk
- Email: info@toolserve.co.uk
