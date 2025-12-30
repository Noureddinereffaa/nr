import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // CORS & Security
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Auth
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.SOVEREIGN_API_KEY || process.env.VITE_SOVEREIGN_API_KEY;

    if (!validKey || apiKey !== validKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    if (!supabase) return res.status(500).json({ error: 'Database connection missing' });

    // Handle POST (Publish/Schedule)
    if (req.method === 'POST') {
        try {
            const { content, platforms, image, date } = req.body;

            if (!content || !platforms || !Array.isArray(platforms)) {
                return res.status(400).json({ error: 'Invalid payload. content and platforms (array) are required.' });
            }

            const status = date ? 'scheduled' : 'published';
            const scheduledDate = date ? new Date(date).toISOString() : new Date().toISOString();

            // 1. Create Social Post Record
            const newPost = {
                id: crypto.randomUUID(),
                content,
                platforms: platforms,
                image: image || null,
                status: status,
                scheduled_date: scheduledDate,
                created_at: new Date().toISOString(),
                likes: 0,
                shares: 0
            };

            // Note: 'social_posts' table needs to support these columns. 
            // Assuming a JSONB column 'data' or specific columns based on previous schema viewing.
            // Based on DataContext, it uses a 'data' jsonb column pattern sometimes for flexible schemas,
            // but let's check if we can just insert the object.
            // In DataContext we saw: supabase.from('social_posts').insert([{ id: newPost.id, data: newPost }])
            // So we will follow that pattern: Insert into 'data' column.

            const { data, error } = await supabase
                .from('social_posts')
                .insert([{
                    id: newPost.id,
                    data: newPost
                    // If table has specific columns like 'status', we might need to duplicate them outside 'data' 
                    // for efficient querying but DataContext implies 'data' blob usage. 
                }])
                .select()
                .single();

            if (error) throw error;

            // 2. Trigger External Integrations (Simulated)
            // Here you would call Twitter/LinkedIn APIs or trigger a Webhook to n8n.
            // For now, we confirm the "Command" was received and logged.

            return res.status(201).json({
                message: `Social Command: ${status.toUpperCase()}`,
                post: newPost,
                note: "Post logged in Sovereign Database. Connect n8n to 'social_posts' table or Webhook to automate actual dispatch."
            });

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
