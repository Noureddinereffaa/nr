import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. CORS
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
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Missing article ID' });
    }

    // 4. Handle GET (Single)
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) return res.status(404).json({ error: 'Article not found' });

            return res.status(200).json({ data });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    // 5. Handle PUT (Update)
    if (req.method === 'PUT') {
        try {
            const body = req.body;
            const { data, error } = await supabase
                .from('articles')
                .update(body)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return res.status(200).json({ message: 'Article updated successfully', data });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    // 6. Handle DELETE (Remove)
    if (req.method === 'DELETE') {
        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json({ message: 'Article deleted successfully' });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
