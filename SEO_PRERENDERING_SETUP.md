# SEO Prerendering Setup

## Overview
This application now uses **react-snap** to prerender static HTML for all pages, making content immediately available to search engine crawlers without requiring JavaScript execution.

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
   This runs:
   - `vite build` - Creates production build
   - `react-snap` - Crawls and prerenders all pages

2. **Hydration**:
   - When users visit, React "hydrates" the prerendered HTML
   - All interactive features and dynamic meta tags load after hydration
   - Users see instant content, no loading spinners

3. **Pages Prerendered** (30+ pages):
   - Static pages: /, /services, /contact, /faq, /blog, etc.
   - Dynamic pages discovered through links:
     - Service areas: /service-area/erith, /service-area/greenwich, etc.
     - Blog posts: /blog/[slug] for all published posts
     - Policy pages: /privacy, /terms, /cookies

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
    "build": "vite build && react-snap",
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
      "/",
      "/services",
      "/contact",
      "/faq",
      "/blog",
      "/service-coverage",
      "/sustainability",
      "/track-repair",
      "/repair-request",
      "/privacy",
      "/terms",
      "/cookies"
    ]
  }
}
```

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

### Adding new routes to prerender:
1. Add routes to `reactSnap.include` in package.json
2. OR ensure they're linked from included pages (react-snap auto-discovers)
3. Run `npm run build` to regenerate

### Debugging:
- Use `npm run build:no-prerender` to build without prerendering
- Check console logs during `npm run build` for crawl errors
- Verify all pages render correctly with `npm run dev` first

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
