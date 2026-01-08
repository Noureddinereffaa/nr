import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://nr-os.vercel.app'; // Replace with actual domain

export default async function handler(req, res) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all dynamic content
    const { data: articles } = await supabase.from('articles').select('slug, updated_at');

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/services',
        '/contact',
        '/blog',
        '/portfolio'
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
            .map((url) => {
                return `
            <url>
              <loc>${SITE_URL}${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
            })
            .join('')}
      ${articles
            ? articles
                .map(({ slug, updated_at }) => {
                    return `
            <url>
              <loc>${SITE_URL}/blog/${slug}</loc>
              <lastmod>${updated_at || new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
                })
                .join('')
            : ''}
    </urlset>
  `;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
}
