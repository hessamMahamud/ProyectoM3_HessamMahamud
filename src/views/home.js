import { renderCharacterCard } from "../ui/characterCard.js";
import { } from "../ui/messages.js";

export function renderHome() {
    const app = document.querySelector("#app");
    app.innerHTML = `
    <h1>Home</h1><p>Bienvenido a la app.</p>
    `;
}
