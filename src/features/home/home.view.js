import { renderCharacterCard } from "./characterCard.js";
import { toCharacterProfile } from "../../shared/character.js";
import { CHARACTERS } from "../../data/characters.js";

export function renderHome() {
    const app = document.querySelector("#app");

    // tarjetas para todos los personajes
    const charactersList = Object.values(CHARACTERS);
    const cardsHtml= charactersList
        .map((raw) => {
            const profile = toCharacterProfile(raw);
            const container = document.createElement("div");
            renderCharacterCard(container, profile);
            const cardHtml = container.innerHTML;
            return `
                <a class="characterLink" href="/chat?character=${profile.id}" data-link>
                    ${cardHtml}
                </a>
            `;

        })
        .join("");

    app.innerHTML = `
        <section class="view view--home">
            <h1>Chatea con tu personaje favorito</h1>
            <div class="characters-grid">
                ${cardsHtml}
            </div>
        </section>
    `;
}
