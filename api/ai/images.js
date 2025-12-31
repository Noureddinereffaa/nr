export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        const { query, apiKey } = await req.json();

        // Use provided key or environment variable
        const finalKey = apiKey || process.env.UNSPLASH_ACCESS_KEY;
        if (!finalKey) {
            return new Response(JSON.stringify({ error: "No Unsplash API Key provided" }), { status: 401 });
        }

        const UNSPLASH_API_URL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

        const response = await fetch(UNSPLASH_API_URL, {
            headers: {
                'Authorization': `Client-ID ${finalKey}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify({ error: data.errors?.[0] || "Unsplash API Error" }), { status: response.status });
        }

        const imageUrl = data.results?.[0]?.urls?.regular || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200";

        return new Response(JSON.stringify({ imageUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("AI Image Service Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
