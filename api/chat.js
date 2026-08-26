// 1. IMPORTS y SETUP
import { GoogleGenerativeAI } from "@google/generative-ai";

// 2. EL MANEJADOR PRINCIPAL (lo que Vercel ejecuta)
export default async function handler(req, res) {
    // Solo aceptamos POST (como ya tenías)
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        // Extraemos el systemPrompt y los mensajes del cuerpo de la petición
        const { systemPrompt, messages } = req.body;

        // 3. CONFIGURACIÓN DE GEMINI
        // La clave mágica está en process.env.GEMINI_API_KEY (NUNCA se ve en el frontend)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest", // Modelo rápido y gratuito
            systemInstruction: systemPrompt,
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.6,
            },
        });

        // El historial son TODOS los mensajes MENOS el último (que es el que enviamos ahora)
        const history = messages.slice(0, -1);
        const lastMessage = messages[messages.length - 1];

        // Iniciamos la sesión de chat con el historial
        const chat = model.startChat({ history });

        // Enviamos el último mensaje del usuario
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;
        const text = response.text();

        // (Opcional) extraemos metadata de tokens para debugging
        const usage = response.usageMetadata;

        // Devolvemos la respuesta al frontend
        return res.status(200).json({ text, usage });

    } catch (error) {
        console.error("Error en Gemini:", error);

        // Detectamos rate limit (429) para que el frontend haga su magia de reintento
        if (error.status === 429) {
            return res.status(429).json({
                error: "Límite de tasa excedido",
                retryAfterSeconds: 5,
            });
        }

        // Cualquier otro error
        return res.status(500).json({ error: error.message });
    }
}
