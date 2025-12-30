import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. CORS & Methods
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Auth Check
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.SOVEREIGN_API_KEY || process.env.VITE_SOVEREIGN_API_KEY;

    if (!validKey || apiKey !== validKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    // 3. Supabase Init
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server Configuration Error: Database connection missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Handle GET (List)
    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const start = (page - 1) * limit;
            const end = start + limit - 1;

            let query = supabase
                .from('articles')
                .select('*', { count: 'exact' })
                .order('date', { ascending: false })
                .range(start, end);

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            return res.status(200).json({
                data,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    // 5. Handle POST (Create)
    if (req.method === 'POST') {
        try {
            const body = req.body;

            // Validation
            if (!body.title) return res.status(400).json({ error: 'Missing required field: title' });

            // Defaults
            const newArticle = {
                id: crypto.randomUUID(),
                title: body.title,
                slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                content: body.content || '',
                status: body.status || 'draft',
                date: new Date().toISOString(),
                author: body.author || 'Noureddine Reffaa', // Default Author
                image: body.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
                seo_score: 0,
                views: 0
            };

            const { data, error } = await supabase
                .from('articles')
                .insert([newArticle])
                .select()
                .single();

            if (error) throw error;

            return res.status(201).json({ message: 'Article created successfully', data });

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
