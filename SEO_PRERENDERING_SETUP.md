# SEO Prerendering Setup

## Overview
This application now uses **react-snap** to prerender static HTML for all pages, making content immediately available to search engine crawlers without requiring JavaScript execution.

**Key Feature**: Dynamic route generation automatically detects and prerenders:
- All published blog posts (including future posts)
- All active service areas
- All static pages

Routes are fetched from the database at build time, ensuring new content is always included in prerendering.

## What Gets Prerendered

### ✅ Successfully Prerendered
- **All page content** including text, images, and structure
- **H1 headings** on every page (critical for SEO)
- **Navigation and footer** with internal links
- **Complete DOM structure** for all components
- **Service area pages** (dynamically discovered and prerendered)
- **Blog posts** (dynamically discovered and prerendered)

### ⚠️ Partially Rendered
- **Meta tags from react-helmet-async** - These are set via JavaScript after hydration
- **Structured data (JSON-LD)** - Also managed by Helmet, renders after hydration
- Static meta tags in `index.html` are preserved and visible to crawlers

## How It Works

1. **Build Process**:
   ```bash
   npm run build
   ```
   This runs three steps:
   - `npm run generate-routes` - Queries database for dynamic routes
   - `vite build` - Creates production build
   - `react-snap` - Crawls and prerenders all discovered routes

2. **Route Generation** (`scripts/generate-routes.js`):
   - Connects to Supabase database
   - Fetches all published blog posts (from `blog_posts` table)
   - Fetches all active service areas (from `service_areas` table)
   - Combines with static routes
   - Updates `package.json` reactSnap configuration
   - Creates `prerender-routes.json` for reference

3. **Hydration**:
   - When users visit, React "hydrates" the prerendered HTML
   - All interactive features and dynamic meta tags load after hydration
   - Users see instant content, no loading spinners

4. **Pages Prerendered** (automatically includes):
   - **Static pages**: /, /services, /contact, /faq, /blog, etc.
   - **Blog posts**: /blog/[slug] for ALL published posts
   - **Service areas**: /service-area/[slug] for ALL active areas
   - **Policy pages**: /privacy, /terms, /cookies

**Future Content**: Every time you run `npm run build`, the script queries the database for new blog posts and service areas, automatically including them in prerendering.

## SEO Benefits

### Before Prerendering
```html
<body>
  <div id="root"></div>
  <script src="/assets/index-xyz.js"></script>
</body>
```
Crawlers see: Empty div, no content, no H1 tags

### After Prerendering
```html
<body>
  <div id="root">
    <nav>...</nav>
    <main>
      <h1>Repairing Tools, Reducing Waste</h1>
      <p>Full page content visible to crawlers...</p>
    </main>
    <footer>...</footer>
  </div>
</body>
```
Crawlers see: Full HTML with H1, content, links, images

## Configuration

### package.json
```json
{
  "scripts": {
    "generate-routes": "node scripts/generate-routes.js",
    "build": "npm run generate-routes && vite build && react-snap",
    "build:no-prerender": "vite build"
  },
  "reactSnap": {
    "source": "dist",
    "minifyHtml": {
      "collapseWhitespace": true,
      "removeComments": true
    },
    "puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"],
    "include": [
      "// This array is automatically updated by generate-routes.js",
      "// It includes all static pages + dynamic blog posts + service areas"
    ]
  }
}
```

### scripts/generate-routes.js
This script:
- Loads environment variables from `.env`
- Connects to Supabase using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Queries `blog_posts` table for published posts
- Queries `service_areas` table for active areas
- Updates `package.json` with complete route list
- Creates `prerender-routes.json` for reference

**Important**: The `.env` file must be present with valid Supabase credentials for route generation to work.

### main.tsx
```typescript
// Use hydration for prerendered content
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
```

## Testing Prerendering

### Check if pages are prerendered:
```bash
# View source of built files
cat dist/index.html
cat dist/services/index.html
cat dist/contact/index.html

# Check for H1 tags
grep -o "<h1[^>]*>.*</h1>" dist/index.html
grep -o "<h1[^>]*>.*</h1>" dist/services/index.html

# Check for content
grep "Repairing Tools, Reducing Waste" dist/index.html
```

### Validate with SEO tools:
1. **View Page Source** in browser - should show full HTML
2. **Google Rich Results Test** - https://search.google.com/test/rich-results
3. **Lighthouse SEO audit** - npm run build && npx serve dist
4. **Fetch as Google** in Search Console

## Deployment

The prerendered files deploy normally to any static host:
- **Netlify**: Automatic deployment with _redirects for SPA fallback
- **Vercel**: Works with static output
- **GitHub Pages**: Full static site support
- **Any CDN**: Standard HTML files, no special configuration

## Maintenance

### Adding New Content (Blog Posts, Service Areas):
**No manual work required!** When you:
1. Publish a new blog post in the database
2. Add a new service area in the database
3. Run `npm run build`

The route generation script automatically discovers and includes the new content.

### Adding New Static Pages:
1. Edit `scripts/generate-routes.js`
2. Add the route to the `staticRoutes` array
3. Run `npm run build`

### Debugging:
- **Test route generation**: `npm run generate-routes`
- **Check generated routes**: View `prerender-routes.json`
- **Build without prerendering**: `npm run build:no-prerender`
- **Check console logs**: Look for errors during `npm run build`
- **Verify pages render**: Test with `npm run dev` first

### CI/CD Integration:
Ensure your build environment has:
- `.env` file with Supabase credentials (or environment variables set)
- Node.js 18+ installed
- Network access to Supabase API

Example for Netlify:
```
# Build command
npm run build

# Environment variables (set in Netlify dashboard)
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

## Known Limitations

1. **Dynamic Meta Tags**: react-helmet-async meta tags update after hydration
   - Static meta tags in index.html still work for crawlers
   - Page-specific titles and descriptions render client-side

2. **Structured Data**: JSON-LD scripts from StructuredData component load after hydration
   - Consider adding critical structured data to index.html directly

3. **Authentication Pages**: Admin pages are prerendered but shouldn't be
   - These are noindexed anyway, so not a concern for SEO

## Future Improvements

1. **Server-Side Rendering (SSR)**: Migrate to Next.js or Remix for true SSR
2. **Static Site Generation**: Use Astro or Gatsby for full static generation
3. **Edge Rendering**: Deploy with Vercel/Cloudflare for edge SSR

## Results

✅ **All pages now have:**
- Visible H1 headings in HTML source
- Full content accessible without JavaScript
- Complete DOM structure for crawlers
- Fast initial page loads
- SEO-friendly architecture

✅ **Crawler Compatibility:**
- Google bot can index all content
- Bing, Yahoo, DuckDuckGo can read pages
- Social media crawlers get Open Graph data
- Preview tools show actual content
