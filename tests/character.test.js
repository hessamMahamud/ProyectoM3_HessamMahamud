import { describe, it, expect } from "vitest";
import { toCharacterProfile } from "../src/shared/character.js";

describe("toCharacterProfile", () => {
    it("mapea correctamente un personaje con todos los datos presentes", () => {
        const rawCharacter = {
            id: "ainz",
            name: "Ainz Ooal Gown",
            status: "No-muerto",
            species: "Esqueleto hechicero",
            image: "https://ejemplo.com/ainz.png",
            origin: { name: "Yggrasil" },
            location: { name: "Nazarick" },
        };

        const profile = toCharacterProfile(rawCharacter);

        expect(profile).toEqual({
            id: "ainz",
            name: "Ainz Ooal Gown",
            status: "No-muerto",
            species: "Esqueleto hechicero",
            image: "https://ejemplo.com/ainz.png",
            originName: "Yggrasil",
            locationName: "Nazarick",
        });
    });

    it("usa valores por defecot cuando faltan campos", () => {
        const rawCharacter = { id: "misterioso" };

        const profile = toCharacterProfile(rawCharacter);

        expect(profile.name).toBe("Desconocido");
        expect(profile.status).toBe("Unknown");
        expect(profile.species).toBe("Unknown");
        expect(profile.image).toBe("");
        expect(profile.originName).toBe("Unknown");
        expect(profile.locationName).toBe("Unknown");
    });

    it("usa 'Unknown' si origin o location existen pero sin name", () => {
        const rawCharacter = {
            id: "raro",
            name: "Raro",
            origin: {},
            location: {},
        };

        const profile = toCharacterProfile(rawCharacter);

        expect(profile.originName).toBe("Unknown");
        expect(profile.locationName).toBe("Unknown");
    });
});
