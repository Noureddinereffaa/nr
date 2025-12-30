export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    return new Response(JSON.stringify({ error: "AI Service permanently removed." }), {
        status: 410,
        headers: { 'Content-Type': 'application/json' },
    });
}
