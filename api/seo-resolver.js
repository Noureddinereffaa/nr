import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function
export default async function handler(req, res) {
    // 1. Get Path and Identifiers
    // Vercel rewrites path to ?path=/... but original query params are also available
    const { path: rawPath, slug: querySlug, id: queryId, article: queryArticle } = req.query;

    // Normalize path
    const path = rawPath || '/';
    const host = req.headers.host || 'nr-os.vercel.app';
    const baseUrl = `https://${host}`;

    // 2. Setup Default Metadata (Professional Homepage)
    const defaults = {
        title: 'NR-OS | Noureddine Reffaa Operating System',
        desc: 'نظام التشغيل الاستراتيجي للنمو والأتمتة - حلول الذكاء الاصطناعي المتقدمة للتسويق والمحتوى.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=630',
        url: baseUrl
    };

    let meta = { ...defaults };
    let targetUrl = baseUrl;

    // 3. Extract Identifiers from Path if not in Query
    let finalSlug = querySlug;
    let finalId = queryId || queryArticle;

    if (!finalSlug && path.startsWith('/blog/')) {
        finalSlug = path.replace('/blog/', '').split('?')[0];
    }

    // Set Target URL for the human redirect
    if (finalSlug) {
        targetUrl = `${baseUrl}/blog/${finalSlug}`;
    } else if (finalId) {
        targetUrl = `${baseUrl}/?article=${finalId}`;
    } else {
        targetUrl = `${baseUrl}${path}`;
    }

    // 4. Fetch from Supabase if Identifier Exists
    if (finalSlug || finalId) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const supabase = createClient(supabaseUrl, supabaseKey);
                let query = supabase.from('articles').select('title, excerpt, image, content');

                if (finalSlug) {
                    query = query.eq('slug', finalSlug);
                } else {
                    query = query.eq('id', finalId);
                }

                const { data, error } = await query.maybeSingle();

                if (data && !error) {
                    meta.title = data.title;
                    meta.desc = data.excerpt || (data.content ? data.content.substring(0, 160).replace(/<[^>]*>/g, '') + '...' : defaults.desc);

                    // Handle Image: Ensure absolute URL
                    if (data.image) {
                        meta.image = data.image.startsWith('http') ? data.image : `${baseUrl}${data.image.startsWith('/') ? '' : '/'}${data.image}`;
                    }
                }
            } catch (e) {
                console.error('Supabase SEO Fetch Error:', e);
            }
        }
    }

    // 5. Return Optimized HTML for Bots
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.desc}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${finalSlug || finalId ? 'article' : 'website'}">
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.desc}">
  <meta property="og:image" content="${meta.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="NR-OS">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${targetUrl}">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.desc}">
  <meta name="twitter:image" content="${meta.image}">
  
  <link rel="icon" href="${baseUrl}/favicon.ico">

  <style>
    body { 
        background: #020617; 
        color: white; 
        display: flex; 
        flex-direction: column;
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        margin: 0;
        font-family: 'Inter', -apple-system, sans-serif; 
        text-align: center; 
    }
    .container { padding: 2rem; max-width: 600px; }
    h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: #6366f1; }
    p { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; }
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: #6366f1;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        margin-bottom: 2rem;
    }
    @keyframes rotation { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } } 
  </style>
</head>
<body>
  <div class="container">
    <span class="loader"></span>
    <h1>${meta.title}</h1>
    <p>جاري تحويلك إلى التجربة الكاملة لـ NR-OS...</p>
  </div>
  <script>
     // Humans land here because browser bots masquerade sometimes, or social preview clicks
     setTimeout(() => {
        window.location.href = "${targetUrl}";
     }, 100);
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).send(html);
}
