#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateRoutes() {
  console.log('🔍 Fetching dynamic routes from database...');

  const staticRoutes = [
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
    '/cookies'
  ];

  const dynamicRoutes = [];

  try {
    // Fetch all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);

    if (blogError) {
      console.error('Error fetching blog posts:', blogError.message);
    } else if (blogPosts) {
      blogPosts.forEach(post => {
        if (post.slug) {
          dynamicRoutes.push(`/blog/${post.slug}`);
        }
      });
      console.log(`✓ Found ${blogPosts.length} published blog posts`);
    }

    // Fetch all active service areas
    const { data: serviceAreas, error: areasError } = await supabase
      .from('service_areas')
      .select('slug')
      .eq('is_active', true);

    if (areasError) {
      console.error('Error fetching service areas:', areasError.message);
    } else if (serviceAreas) {
      serviceAreas.forEach(area => {
        if (area.slug) {
          dynamicRoutes.push(`/service-area/${area.slug}`);
        }
      });
      console.log(`✓ Found ${serviceAreas.length} active service areas`);
    }

  } catch (error) {
    console.error('Error fetching routes:', error.message);
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  console.log(`\n📝 Total routes to prerender: ${allRoutes.length}`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - Dynamic routes: ${dynamicRoutes.length}`);

  // Update package.json with the routes
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(
    await import('fs').then(fs => fs.promises.readFile(packageJsonPath, 'utf-8'))
  );

  packageJson.reactSnap = {
    ...packageJson.reactSnap,
    include: allRoutes
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✓ Updated package.json with dynamic routes\n');

  // Also write to a separate file for reference
  const routesPath = join(__dirname, '..', 'prerender-routes.json');
  writeFileSync(routesPath, JSON.stringify(allRoutes, null, 2) + '\n');
  console.log(`✓ Saved routes to prerender-routes.json\n`);

  return allRoutes;
}

generateRoutes()
  .then(routes => {
    console.log('✅ Route generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Route generation failed:', error);
    process.exit(1);
  });
