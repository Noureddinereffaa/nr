export default function handler(req, res) {
    const SITE_URL = 'https://nr-os.vercel.app'; // Replace with actual domain

    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

# Optimize for AI Agents to find content
User-agent: GPTBot
Allow: /blog/
Allow: /services/

User-agent: Google-Extended
Allow: /blog/
Allow: /services/

Sitemap: ${SITE_URL}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robots);
}
