export async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
    }

    return await response.json();
}
