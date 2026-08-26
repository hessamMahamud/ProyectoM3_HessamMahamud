import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { systemPrompt, messages } = req.body; // messages is array of { role: "user"|"model", parts: [{ text }] }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-lite-latest",
            systemInstruction: systemPrompt,
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.6,
            },
        });

        const chat = model.startChat({
            history: messages.slice(0, -1), // history without the last message (the user's new one)
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;
        const text = response.text();

        // Get usage metadata (optional, but nice to have)
        const usage = response.usageMetadata;

        return res.status(200).json({ text, usage });
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Handle rate limit (429) specifically if possible
        if (error.status === 429) {
            return res.status(429).json({ error: "Rate limit exceeded", retryAfterSeconds: 5 });
        }
        return res.status(500).json({ error: error.message });
    }
}
