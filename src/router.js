import { renderHome } from "./features/home/home.view.js";
import { renderChat } from "./features/chat/chat.view.js";
import { renderAbout } from "./features/about/about.view.js";
import { renderNotFound } from "./features/notFound/notFound.view.js";

const routes = {
    "/": renderHome,
    "/chat": renderChat,
    "/about": renderAbout,
};

export function router() {
    const path = window.location.pathname;
    const render = routes[path] || renderNotFound;
    render();
}
