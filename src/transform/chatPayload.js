const MODEL_NAME = "gemini-flash-lite-latest";
const MAX_OUTPUT_TOKENS = 200;
const TEMPERATURE = 0.9;
const MAX_TURNS_HISTORY = 12;

export function toApiMessages(uiMessages) {
    return uiMessages.map((msg) => ({
        role: msg.role === "charachter" ? "model" : "user",
        parts: [{ text: msg.text }],
    }));
}
