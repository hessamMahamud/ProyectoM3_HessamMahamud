import { RICK_SYSTEM_PROMPT } from "./prompts.js";
import { buildPayload, normalizeAiResponse, getTrimmedHistory } from "../transform/chatPayload.js";

export async function getCharacterReply(uiMessages) {
    const trimmed = getTrimmedHistory(uiMessages);

    const payload = buildPayload({
        systemPrompt: RICK_SYSTEM_PROMPT,
        uiMessages: trimmed,
    });

    const rawRespponse = await sendToMock(payload);

    const text = normalizeAiResponse(rawRespponse);

    const usage = rawRespponse?.usageMetadata;
    if (usage) {
        console.log(`[Tokens] input: ${usage.promptTokenCount}, output: ${usage.candidatesTokenCount}`);
    }

    return text;
}
