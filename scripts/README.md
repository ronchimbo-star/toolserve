# Build Scripts

## generate-routes.js

This script dynamically generates the list of routes to prerender by querying the Supabase database for all published content.

### Purpose

When building the application, we need to prerender all pages so search engines can crawl them. However, blog posts and service areas are stored in the database and change over time. This script solves that problem by:

1. Fetching all published blog posts from the database
2. Fetching all active service areas from the database
3. Combining them with static routes (/, /services, /contact, etc.)
4. Updating package.json with the complete list for react-snap to use

### How It Works

```bash
npm run generate-routes
```

This script:
1. Loads environment variables from `.env` file
2. Connects to Supabase using credentials
3. Queries the `blog_posts` table for published posts
4. Queries the `service_areas` table for active areas
5. Creates a complete route list
6. Updates `package.json` reactSnap configuration
7. Saves routes to `prerender-routes.json` for reference

### Environment Variables Required

The script needs these variables from your `.env` file:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Output

1. **Updates package.json**: The `reactSnap.include` array is replaced with all discovered routes
2. **Creates prerender-routes.json**: A JSON file with all routes for reference (gitignored)

Example output:
```
🔍 Fetching dynamic routes from database...
✓ Found 6 published blog posts
✓ Found 10 active service areas

📝 Total routes to prerender: 28
   - Static routes: 12
   - Dynamic routes: 16
✓ Updated package.json with dynamic routes
✓ Saved routes to prerender-routes.json

✅ Route generation complete!
```

### When This Runs

Automatically runs as part of:
```bash
npm run build
```

Which executes:
1. `npm run generate-routes` (this script)
2. `vite build` (build the app)
3. `react-snap` (prerender all routes)

### Adding New Static Routes

If you add a new static page (e.g., /about), edit this script:

```javascript
const staticRoutes = [
  '/',
  '/services',
  '/contact',
  // ... existing routes
  '/about', // Add your new route here
];
```

### Adding New Dynamic Content Types

To prerender a new type of dynamic content (e.g., case studies), add database queries:

```javascript
// Fetch case studies
const { data: caseStudies, error: studiesError } = await supabase
  .from('case_studies')
  .select('slug')
  .eq('published', true);

if (caseStudies) {
  caseStudies.forEach(study => {
    dynamicRoutes.push(`/case-studies/${study.slug}`);
  });
}
```

### Troubleshooting

**Error: Environment variables not set**
- Ensure `.env` file exists in project root
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

**Error: Database connection failed**
- Verify Supabase credentials are correct
- Check network connectivity
- Ensure Supabase project is active

**Routes not being prerendered**
- Check console output for database errors
- Verify blog posts have `published: true`
- Verify service areas have `is_active: true`
- Check that routes appear in `prerender-routes.json`

### CI/CD Considerations

When deploying, ensure:
1. Environment variables are set in your CI/CD platform
2. Build command is: `npm run build` (includes route generation)
3. The build has network access to Supabase API
4. Node.js version is 18 or higher

Example Netlify configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

Then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify dashboard.
