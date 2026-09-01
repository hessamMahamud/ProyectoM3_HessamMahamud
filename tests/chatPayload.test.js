import { describe, it, expect } from "vitest";
import { toApiMessages, normalizeAiResponse, getTrimmedHistory } from "../src/features/chat/chatPayload.js";

describe("toApiMessages", () => {
    it("convierte roles de UI a roles de la API de Gemini", () => {
        const uiMessages = [
            { role:"user", text: "Hola" },
            { role: "character", text: "Saludos" },
        ];

        const result = toApiMessages(uiMessages);

        expect(result).toEqual([
            { role: "user", parts: [{ text: "Hola" }] },
            { role: "model", parts: [{ text: "Saludos" }] },
        ]);
    });
});

describe("normalizeAiResonse", () => {
    it("extrae el texto de una respuesta válida de Gemini", () => {
        const raw = {
            candidates: [{ content: { parts: [ { text: "respuesta del personaje" }] } }],
        };

        expect(normalizeAiResponse(raw)).toBe("Respuesta del personahe");
    })
})
