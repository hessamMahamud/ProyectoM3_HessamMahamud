import { getCharacterReply } from "./aiClient.js";
import { debounce, wait } from "../../shared/debounce.js";
import { getUserMessage } from "./errorMessages.js";
import { CHARACTERS, DEFAULT_CHARACTER_ID } from "../../data/characters.js";

//Variables globales
let currentCharacterId = null;
let activeCharacter = null;
let CHAT_STORAGE_KEY = null;
let state = null;

/* const activeCharacter = getCharacterFromUrl();
const currentCharacterId = activeCharacter.id;
const CHAT_STORAGE_KEY = `chatHistory:${currentCharacterId}`; */



//Funciones de utilidad
function getCharacterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("character");
    return CHARACTERS[id] || CHARACTERS[DEFAULT_CHARACTER_ID]
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(CHAT_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;

    } catch {
        return null;
    }
}

function saveHistory(messages) {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));

    } catch {

    }
}

function clearHistory() {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    Object.assign(state, {
        messages: [{ role: "character", text: activeCharacter.greeting }],
        status: "idle",
        error: null,
        lastUserMessage: null,
        hasSavedHistory: false,
    });

    renderChat();
}

//Inicialización chat
function initChat(characterId) {
    if (currentCharacterId === characterId) return;

    //Actualizar personajes
    activeCharacter = CHARACTERS[characterId] || CHARACTERS[DEFAULT_CHARACTER_ID];
    currentCharacterId = activeCharacter.id;
    CHAT_STORAGE_KEY = `chatHistory:${currentCharacterId}`;
    localStorage.setItem("lastCharacterId", currentCharacterId);

    //cargar historial
    const savedMessages = loadHistory(CHAT_STORAGE_KEY);
    state = {
        messages: savedMessages ?? [{ role: "character", text: activeCharacter.greeting }],
        status: "idle",
        error: null,
        lastUserMessage: null,
        retryCountdown: null,
        hasSavedHistory: savedMessages !== null,
    };
}

//Renderizar
export function renderChat() {
    //Obtener personaje
    const characterFromUrl = getCharacterFromUrl();
    const characterId = characterFromUrl.id;

    //Inicializar chat por personaje
    initChat(characterId);

    //Renderiza DOM estado actual
    const app = document.querySelector("#app");
    if (!app) {
        console.error("🚫 #app no encontrada");
        return;
    }

    app.innerHTML = `
        <div class="chatApp">
            <header class="chatHeader">
                <h1 class="chatHeader__title">Chat</h1>
                <p class="chatHeader__subtitle">Chateando con ${activeCharacter.name}</p>
                ${state.hasSavedHistory ? `<p class="chatHeader__badge">💾 Tienes un historial guardado</p>` : ""}
                <button class="chatHeader__clearBtn" id="clearHistoryBtn" type="button">Borrar historial</button>
            </header>

            <main class="chatMessages" id="chatMessages" aria-live="polite">
                ${renderMessages()}
                ${renderStatus()}
            </main>

            <form class="chatComposer" id="chatComposer">
                <input
                    class="chatComposer__input"
                    id="chatInput"
                    type="text"
                    placeholder="Escribe un mensaje..."
                    aria-label="Escribe tu mensaje"
                    ${state.status === "loading" ? "disabled" : ""}
                />
                <button class="chatComposer__send" type="submit" ${state.status === "loading" ? "disabled" : ""}>
                    Enviar
                </button>
            </form>
        </div>
    `;

    setupChat();
    scrollToBottom();
}

function renderMessages() {
    return state.messages
        .map(
            (msg) => `
             <div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>
            `,
        )
        .join("");
}

function renderStatus() {
    if (state.status === "loading" && state.retryCountdown != null) {
        return `
            <div class="message message--character message--typing">
                Esperando para reintentar (${state.retryCountdown} segundos)...
            </div>
        `;
    }

    if (state.status === "loading") {
        return `<div class="message message--character message--typing">escribiendo...</div>`;
    }

    if (state.status === "error") {
        return `
            <div class="message message--error">
                ${state.error}
                <button class="message__retry" id="retryBtn" type="button">Reintentar</button>
            </div>
        `;
    }

    return "";
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function setState(updates) {
    Object.assign(state, updates);
    if (updates.messages) {
        saveHistory(state.messages);
        state.hasSavedHistory = true;
    }
    renderChat();
}

function setupChat() {
    const $form = document.querySelector("#chatComposer");
    const $input = document.querySelector("#chatInput");
    const $retry = document.querySelector("#retryBtn");
    document.querySelector("#clearHistoryBtn")?.addEventListener("click", clearHistory);

    const debouncedSend = debounce(async () => {
        if (state.status === "loading") return;

        const text = $input.value.trim();
        if (!text) return;

        await sendMessage(text);
        $input.value = "";
    }, 200);

    $form.addEventListener("submit", async (event) => {
        event.preventDefault();
        debouncedSend();
    });

    $retry?.addEventListener("click", () => {
        if (state.lastUserMessage) {
            sendMessage(state.lastUserMessage, true);
        }
    });

    $input.focus();
}

async function sendMessage(text, isRetry = false) {
    const nextMessages = isRetry ? state.messages : [...state.messages, { role: "user", text }];

    setState({
        messages: nextMessages,
        status: "loading",
        error: null,
        lastUserMessage: isRetry ? state.lastUserMessage : text,
    });

    try {
        const reply = await getCharacterReply(nextMessages, currentCharacterId);
        setState({
            messages: [...nextMessages, { role: "character", text: reply }],
            status: "idle",
            error: null,
            lastUserMessage: null,
        });

    } catch (error) {
        if (error.status === 429) {
            const seconds = error.retryAfterSeconds ?? 5;

            for (let s = seconds; s > 0; s--) {
                setState({ status: "loading", retryCountdown: s });
                await wait(1000);
            }

            try {
                setState({ status: "loading", retryCountdown: null });
                const reply = await getCharacterReply(nextMessages);
                setState({
                    messages: [...nextMessages, { role: "character", text: reply }],
                    status: "idle",
                    error: null,
                    lastUserMessage: null,
                });
                return;

            } catch (errorRetry) {
                setState({
                    status: "error",
                    error: getUserMessage(errorRetry),
                });
                return;
            }
        }

        setState({
            status: "error",
            error: getUserMessage(error),
        });
    }
}

function scrollToBottom() {
    const $messages = document.querySelector("#chatMessages");
    if ($messages) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}
