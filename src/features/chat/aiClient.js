import { SYSTEM_PROMPTS_BY_CHARACTER } from "./prompts.js";
import {
    toApiMessages,
    getTrimmedHistory,
} from "./chatPayload.js";

export async function getCharacterReply(uiMessages, characterId) {
    const trimmed = getTrimmedHistory(uiMessages);
    const apiMessages = toApiMessages(trimmed);

    const payload = {
        systemPrompt: SYSTEM_PROMPTS_BY_CHARACTER[characterId],
        messages: apiMessages,
    };

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || "Error en el servidor");
        error.status = response.status;
        if (response.status === 429) {
            error.retryAfterSeconds = errorData.retryAfterSeconds || 5;
        }
        throw error;
    }

    return text;
}
