import { RICK_SYSTEM_PROMPT } from "./prompts.js";
import {
    toApiMessages,        // <-- Importamos esto para formatear los mensajes
    getTrimmedHistory,
} from "../transform/chatPayload.js";

export async function getCharacterReply(uiMessages) {
    // Recortamos el historial para no pasarnos de los tokens (máximo 12 turnos)
    const trimmed = getTrimmedHistory(uiMessages);

    // Convertimos los mensajes al formato que espera la API de Gemini
    const apiMessages = toApiMessages(trimmed);

    // Armamos el payload que le vamos a mandar a nuestra Serverless Function
    const payload = {
        systemPrompt: RICK_SYSTEM_PROMPT,
        messages: apiMessages,
    };

    // 🔥 CAMBIO CLAVE: ya no usamos el mock, llamamos a nuestra propia API
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    // Si la respuesta no es OK (ej. 429, 500), lanzamos un error con el status
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || "Error en el servidor");
        error.status = response.status;
        if (response.status === 429) {
            error.retryAfterSeconds = errorData.retryAfterSeconds || 5;
        }
        throw error;
    }

    // Extraemos la respuesta de Gemini
    const data = await response.json();
    const text = data.text || "";

    // Log de tokens (útil para debugging)
    if (data.usage) {
        console.log(`[Tokens] input: ${data.usage.promptTokenCount}, output: ${data.usage.candidatesTokenCount}`);
    }

    return text;
}
