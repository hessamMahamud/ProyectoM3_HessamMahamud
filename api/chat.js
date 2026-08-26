import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method no permitido" });
    }

    try {
        const { systemPrompt, messages } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: ""
        })

    } catch (error) {
        console.error("Error en Gemini:", error);
    }
}
