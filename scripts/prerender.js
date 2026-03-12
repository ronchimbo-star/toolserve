import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist');
const indexPath = join(distPath, 'index.html');

// Routes to prerender
const routes = [
  '/',
  '/services',
  '/contact',
  '/faq',
  '/blog',
  '/service-coverage',
  '/sustainability',
  '/track-repair',
  '/repair-request',
  '/privacy',
  '/terms',
  '/cookies',
  '/service-area/london',
  '/service-area/kent',
  '/service-area/surrey',
  '/service-area/sussex',
  '/service-area/essex',
];

async function prerender() {
  console.log('Starting prerendering process...');

  // Start a dev server to render the pages
  const server = await createServer({
    root: distPath,
    server: {
      port: 3000
    }
  });

  await server.listen();
  console.log('Dev server started on http://localhost:3000');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const route of routes) {
    try {
      console.log(`Prerendering ${route}...`);

      const page = await browser.newPage();
      await page.goto(`http://localhost:3000${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for React to render
      await page.waitForTimeout(2000);

      const html = await page.content();

      // Create directory structure if needed
      const routePath = route === '/' ? 'index.html' : `${route}/index.html`;
      const fullPath = join(distPath, routePath);
      const dir = dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the prerendered HTML
      fs.writeFileSync(fullPath, html);
      console.log(`✓ Prerendered ${route} to ${routePath}`);

      await page.close();
    } catch (error) {
      console.error(`✗ Error prerendering ${route}:`, error.message);
    }
  }

  await browser.close();
  await server.close();

  console.log('Prerendering complete!');
}

prerender().catch(console.error);
