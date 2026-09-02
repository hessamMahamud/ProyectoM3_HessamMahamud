import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCharacterReply } from "../src/features/chat/aiClient.js";

describe("getCharacterReply", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve el texto de la respuesta cuando la API responde bien", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ text: "Hola, mortal", usage: null }),
        });

        const reply = await getCharacterReply([{ role: "user", text: "Hola" }], "ainz");

        expect(reply).toBe("Hola, mortal");
        expect(fetch).toHaveBeenCalledWith(
            "/api/chat",
            expect.objectContaining({ method: "POST" })
        );
    });

    it("lanza un error con status cuando la API responde con error", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 429,
            json: async () => ({ error: "Límite excedido", retryAfterSeconds: 10, }),
        });

        await expect(
            getCharacterReply([{ role: "user", text: "Hola" }], "ainz")
        ).rejects.toMatchObject({ status: 429, retryAfterSeconds: 10});
    });
});

