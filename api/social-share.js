export default function handler(request, response) {
  const { title, image, desc, url } = request.query;

  // Decode params to ensure correct display
  const decodedTitle = decodeURIComponent(title || 'NR-OS Article');
  const decodedDesc = decodeURIComponent(desc || 'Read this article on NR-OS');
  const decodedImage = decodeURIComponent(image || '');
  const targetUrl = decodeURIComponent(url || 'https://www.noureddinereffaa.xyz');

  const html = `<!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Dynamic Social Tags -->
    <title>${decodedTitle}</title>
    <meta property="og:site_name" content="NR-OS Center">
    <meta property="og:title" content="${decodedTitle}">
    <meta property="og:description" content="${decodedDesc}">
    <meta property="og:image" content="${decodedImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${targetUrl}">
    
    <!-- WhatsApp / General -->
    <meta itemprop="name" content="${decodedTitle}">
    <meta itemprop="description" content="${decodedDesc}">
    <meta itemprop="image" content="${decodedImage}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${decodedTitle}">
    <meta name="twitter:description" content="${decodedDesc}">
    <meta name="twitter:image" content="${decodedImage}">
    
    <style>
      body { background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
      .loader { border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  </head>
  <body>
    <div style="text-align:center">
        <div class="loader" style="margin:0 auto 20px"></div>
        <p>جاري التوجيه للمقال...</p>
    </div>
    <script>
      // Immediate redirect
      setTimeout(function() {
          window.location.href = "${targetUrl}";
      }, 500);
    </script>
  </body>
  </html>`;

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate'); // Ensure fresh tags
  response.send(html);
}
