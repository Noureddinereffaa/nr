export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        const { stage, payload, apiKey } = await req.json();

        // Use provided key or environment variable
        const finalKey = apiKey || process.env.AI_FORGE_GEMINI_KEY || process.env.GEMINI_API_KEY;
        if (!finalKey) {
            return new Response(JSON.stringify({ error: "No API Key provided" }), { status: 401 });
        }


        let prompt = "";
        if (stage === 'architect') {
            prompt = `
            You are the Sovereign Architect AI, specialized in high-authority strategic content.
            Target: Create a comprehensive, structural outline for a 2500+ word professional article in Arabic.
            
            Template Base: ${payload.templateTitle}
            Topic: ${payload.topic}
            Tone: ${payload.tone || 'Professional, Authoritative, Strategic'}
            
            Return ONLY a valid JSON object with this structure:
            {
              "title": "Final Catchy Title in Arabic",
              "excerpt": "A powerful 2-sentence summary in Arabic",
              "keywords": ["keyword1", "keyword2"],
              "sections": [
                {
                  "id": "intro",
                  "title": "Section Title in Arabic",
                  "goal": "What this section should achieve (Arabic)",
                  "keywords": ["specific", "keywords"],
                  "targetWordCount": 300
                }
                // ... 8 to 12 more sections to total 2500+ words
              ]
            }
            `;
        } else if (stage === 'test') {
            prompt = "Say 'SUCCESS'.";
        } else if (stage === 'forge') {
            prompt = `
            You are the Sovereign Writer AI. Write a high-authority, detailed section for a strategic article in Arabic.
            
            Article Topic: ${payload.topic}
            Section Title: ${payload.section.title}
            Section Goal: ${payload.section.goal}
            Section Keywords: ${payload.section.keywords.join(', ')}
            Previous Context Summary: ${payload.context || 'None'}
            
            Requirements:
            - Language: Formal Arabic (العربية الفصحى الحديثة).
            - Word Count: Minimum ${payload.section.targetWordCount || 400} words.
            - Format: Use HTML tags for structure (<h3>, <p>, <strong>, <ul>, <li>).
            - Tone: Elite, Strategic, Informative.
            - Visuals: If you suggest an image here, insert a tag like [IMAGE_PROMPT: description in english].
            
            WRITE ONLY THE CONTENT FOR THIS SPECIFIC SECTION.
            `;
        } else {
            return new Response(JSON.stringify({ error: "Invalid stage" }), { status: 400 });
        }

        const modelsToTry = [
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        ];

        let finalResponse = null;
        let lastErrorMsg = "Unknown Error";

        for (const baseUrl of modelsToTry) {
            try {
                const response = await fetch(`${baseUrl}?key=${finalKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        }
                    })
                });

                if (response.ok) {
                    finalResponse = await response.json();
                    break;
                } else {
                    const errData = await response.json().catch(() => ({}));
                    lastErrorMsg = errData.error?.message || "Model unsupported";
                    console.warn(`Attempt failed with ${baseUrl}:`, lastErrorMsg);
                    if (response.status === 401 || response.status === 403) break;
                }
            } catch (err) {
                lastErrorMsg = err.message;
            }
        }

        if (!finalResponse) {
            return new Response(JSON.stringify({
                error: `All models failed: ${lastErrorMsg}. Verify your API Key permits these models.`
            }), { status: 500 });
        }

        const content = finalResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // If architect stage, try to extract JSON even if there is markdown wrapper
        let result = content;
        if (stage === 'architect') {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            }
        }

        return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("AI Forge Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
