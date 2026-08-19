export function renderNotFound() {
    const app = document.querySelector("#app");
    app.innerHTML = `
    <h1>404</h1>
    <p>Ruta no encontrada.</p>
    <p><a href="/">Volver al inicio</a></p>
    `;
}
