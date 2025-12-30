import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-api-key');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.SOVEREIGN_API_KEY || process.env.VITE_SOVEREIGN_API_KEY;

    if (!validKey || apiKey !== validKey) return res.status(401).json({ error: 'Unauthorized' });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    if (!supabase) return res.status(500).json({ error: 'Database connection missing' });

    if (req.method === 'GET') {
        try {
            // 1. Fetch Article Stats
            const { data: articles, error: artError } = await supabase
                .from('articles')
                .select('views, seo_score');

            if (artError) throw artError;

            // 2. Fetch Social Stats (from 'data' jsonb column if possible, or basic count)
            const { data: socialPosts, error: socError } = await supabase
                .from('social_posts')
                .select('*'); // We need to parse 'data' column in code

            if (socError) throw socError;

            // Aggregation
            const totalArticles = articles.length;
            const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
            const avgSeoScore = totalArticles > 0 ? Math.round(articles.reduce((sum, a) => sum + (a.seo_score || 0), 0) / totalArticles) : 0;

            const totalSocialPosts = socialPosts.length;
            // Extract metrics from social posts data blob
            let socialReach = 0;
            let socialEngagements = 0;

            socialPosts.forEach(p => {
                const d = p.data || {};
                socialReach += (d.views || 0); // Assuming we track this
                socialEngagements += (d.likes || 0) + (d.shares || 0);
            });

            return res.status(200).json({
                overview: {
                    total_content_pieces: totalArticles + totalSocialPosts,
                    total_audience_views: totalViews + socialReach,
                    engagement_score: socialEngagements
                },
                articles: {
                    count: totalArticles,
                    views: totalViews,
                    avg_seo: avgSeoScore
                },
                social: {
                    count: totalSocialPosts,
                    reach: socialReach,
                    engagements: socialEngagements
                }
            });

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
