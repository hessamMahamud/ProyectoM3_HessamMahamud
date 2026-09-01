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

describe("normalizeAiResponse", () => {
    it("extrae el texto de una respuesta válida de Gemini", () => {
        const raw = {
            candidates: [{ content: { parts: [ { text: "respuesta del personaje" }] } }],
        };

        expect(normalizeAiResponse(raw)).toBe("respuesta del personaje");
    });

    it("devuelve string vació si no hay parts", () => {
        expect(normalizeAiResponse({})).toBe("");
    });
});

describe("getTrimmedHistory", () => {
    it("recorta el historial al máximo de turnos indicado", () => {
        const messages = Array.from({ length: 20 }, (_, i) => ({ role: "user", text: `msg${i}` }));

        const result = getTrimmedHistory(messages, 5);

        expect(result).toHaveLength(5);
        expect(result[0].text).toBe("msg15");
    });
});
