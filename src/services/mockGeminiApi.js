const CANNED_REPLIES = [
    "Ohh geez, *urp*, que pregunta mas obvia. Morty, ven a explicarle.",
    "Mira, *urp*, en mil universos ya respondi esto. Buscalo en uno.",
    "Wubba lubba dub dub. La respuesta es: depende. Como todo.",
    "*urp* La ciencia dice que si. La ciencia tambien dice que no me importa.",
    "Es complicado. O no. En realidad es simple si tenes mi cerebro.",
];

function pickReplay() {
    return CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
}

function buildOkResponse(replayText, inputTokens) {
    const outputTokens = Math.ceil(replayText.length / 4);

    return {
        candidates: [
            {
                content: {
                    parts: [{ text: replayText }],
                    role: "model",
                },
                finishReason: "STOP",
            },
        ],
        usageMetadata: {
            promptTokenCount: inputTokens,
            candidatesTokenCount: outputTokens,
            totalTokenCount: inputTokens + outputTokens,
        },
    };
}

function estimateInputTokens(payload) {
    const systemText = payload.systemInstruction?.parts?.[0]?.text ?? "";
    const messagesText = (payload.content ?? [])
        .flatMap((C) => C.parts ?? [])
        .map((p) => p.text ?? "")
        .join(" ");
    return Math.ceil((systemText.length + messagesText.length) / 4);
}
