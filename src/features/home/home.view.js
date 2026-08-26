import { renderCharacterCard } from "../ui/characterCard.js";
import { toCharacterProfile } from "../transform/charachter.js";
import { CHARACTERS, DEFAULT_CHARACTER_ID } from "../data/characters.js";

export function renderHome() {
    const app = document.querySelector("#app");

    const rawCharacter = CHARACTERS[DEFAULT_CHARACTER_ID];
    const profile = toCharacterProfile(rawCharacter);

    app.innerHTML = `
        <section class="view view--home">
            <h1>Chatea con tu personaje favorito</h1>
            <div id="characterCardContainer"></div>
            <a class="btn btn--primary" href="/chat" data-link>Empezar a chatear</a>
        </section>
    `;

    const cardContainer = document.querySelector("#characterCardContainer");
    renderCharacterCard(cardContainer, profile);
}
