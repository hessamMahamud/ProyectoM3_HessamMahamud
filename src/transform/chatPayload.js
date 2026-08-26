const MODEL_NAME = "gemini-1.5-flash-latest";
const MAX_OUTPUT_TOKENS = 200;
const TEMPERATURE = 0.9;
const MAX_TURNS_HISTORY = 12;

export function toApiMessages(uiMessages) {
    return uiMessages.map((msg) => ({
        // 🔥 CORREGIDO: "charachter" -> "character"
        role: msg.role === "character" ? "model" : "user",
        parts: [{ text: msg.text }],
    }));
}

export function buildPayload({ systemPrompt, uiMessages }) {
    return {
        model: MODEL_NAME,
        // 🔥 CORREGIDO: "sistemInstruction" -> "systemInstruction"
        systemInstruction: {
            // 🔥 CORREGIDO: "systemPropmt" -> "systemPrompt"
            parts: [{ text: systemPrompt }],
        },
        contents: toApiMessages(uiMessages),
        generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: TEMPERATURE,
        },
    };
}

// 🔥 CORREGIDO: agregué el parámetro "raw" que faltaba
export function normalizeAiResponse(raw) {
    const parts = raw?.candidates?.[0]?.content?.parts;
    if (!parts) return "";

    return parts
        .filter((p) => p && typeof p.text === "string")
        .map((p) => p.text)
        .join("")
        .trim();
}

export function appendUserMessage(messages, text) {
    return [...messages, { role: "user", text }];
}

export function appendAssistantMessage(messages, text) { // 🔥 Corregí "Assitant" a "Assistant"
    return [...messages, { role: "character", text }];
}

export function getTrimmedHistory(messages, maxTurns = MAX_TURNS_HISTORY) {
    return messages.slice(-maxTurns);
}
