
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge for speed if possible, or omit if using node-specifics

export async function POST(req: NextRequest) {
    try {
        const { image, apiKey } = await req.json();

        if (!apiKey || !image) {
            return NextResponse.json({ error: 'Missing API Key or Image' }, { status: 400 });
        }

        // Call OpenAI GPT-4o
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a business card scanner. Extract the following fields: Name, Email, Phone, Job Title, Company, Website. Return ONLY a JSON object with keys: name, email, phone, title, company, website, notes (summary of other info)."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Extract info from this business card." },
                            { type: "image_url", image_url: { url: image } } // Assumes base64 data URI
                        ]
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenAI Error: ${err}`);
        }

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        return NextResponse.json(content);

    } catch (error: any) {
        console.error('Scan Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
