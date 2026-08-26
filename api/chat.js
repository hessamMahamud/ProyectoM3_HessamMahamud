import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { systemPrompt, messages } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-lite-latest",
            systemInstruction: systemPrompt,
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.6,
            },
        });

        const history = messages.slice(0, -1);
        const lastMessage = messages[messages.length - 1];
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const text = result.response.text();
        const usage = result.response.usageMetadata;

        return res.status(200).json({ text, usage });
    } catch (error) {
        console.error("Error en Gemini:", error);
        if (error.status === 429) {
            return res.status(429).json({
                error: "Límite de tasa excedido",
                retryAfterSeconds: 5,
            });
        }
        return res.status(500).json({ error: error.message });
    }
}
