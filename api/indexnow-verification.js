export default function handler(req, res) {
    // In a real app, this key should be stored in the database or env vars
    // The key must match the filename requested: {key}.txt
    // For simplicity in this demo, we'll verify against a known key env var or just echo back if verified

    const { key } = req.query; // handled via rewrite potentially, or just direct request

    // Security: You might want to validate this key against your DB
    // For IndexNow: The content of the file must be the key itself.

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(key);
}
