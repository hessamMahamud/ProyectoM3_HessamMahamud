import { renderCharacterCard } from "../home/characterCard.js";
import { toCharacterProfile } from "../../shared/character.js";
import { CHARACTERS, DEFAULT_CHARACTER_ID } from "../../data/characters.js";

export function renderAbout() {
    const app = document.querySelector("#app");

    const rawCharacter = CHARACTERS[DEFAULT_CHARACTER_ID];
    const profile = toCharacterProfile(rawCharacter);

    app.innerHTML = `
        <section class="view view--about">
            <h1>Sobre este proyecto</h1>
            <p>Esta es una POC desarrollada para ComicSansCon.</p>
            <p>El personaje elegido es <strong>${profile.name}</strong>.</p>
            <p>Stack: HTML, CSS, JavaScript vanilla, Vercel Functions, Google Gemini.</p>
            <div id="characterCardContainer"></div>
        </section>
  `;

    const cardContainer = document.querySelector("#characterCardContainer");
    renderCharacterCard(cardContainer, profile);
}
