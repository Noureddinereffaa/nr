import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function
export default async function handler(req, res) {
    // 1. Get Identifiers
    const { slug, id } = req.query;

    // 2. Setup Default Metadata
    const defaults = {
        title: 'NR-OS | Noureddine Reffaa Operating System',
        desc: 'Automate your growth with AI-powered content strategy and competitor intelligence.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
        url: `https://${req.headers.host || 'nr-os.vercel.app'}`
    };

    let meta = { ...defaults };
    let targetUrl = defaults.url;

    if (slug) {
        targetUrl = `${defaults.url}/blog/${slug}`;
    } else if (id) {
        targetUrl = `${defaults.url}/?article=${id}`;
    }

    // 3. Fetch from Supabase if Identifier Exists
    if (slug || id) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const supabase = createClient(supabaseUrl, supabaseKey);
                let query = supabase.from('articles').select('title, excerpt, image, content');

                if (slug) {
                    query = query.eq('slug', slug);
                } else if (id) {
                    query = query.eq('id', id);
                }

                const { data, error } = await query.maybeSingle();

                if (data && !error) {
                    meta.title = data.title;
                    meta.desc = data.excerpt || (data.content ? data.content.substring(0, 150) + '...' : defaults.desc);
                    meta.image = data.image || defaults.image;
                }
            } catch (e) {
                console.error('Supabase SEO Fetch Error:', e);
            }
        }
    }

    // 4. Return Raw HTML for Bots
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.desc}">
  <meta property="og:image" content="${meta.image}">
  <meta property="og:site_name" content="NR-OS">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${targetUrl}">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.desc}">
  <meta name="twitter:image" content="${meta.image}">
  
  <style>
    body { background: #020617; color: white; display: flex; flex-col; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    p { color: #94a3b8; }
  </style>
</head>
<body>
  <div>
    <h1>${meta.title}</h1>
    <p>Redirecting to full experience...</p>
  </div>
  <script>
     // Ensure humans who accidentally get here are redirected to the SPA
     window.location.href = "${targetUrl}";
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Cache for performance
    res.status(200).send(html);
}
