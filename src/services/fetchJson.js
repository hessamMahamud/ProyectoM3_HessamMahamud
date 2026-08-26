export async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;

        try {
            error.body = null;
        } catch {
            error.body = null;
        }

        throw error;
    }

    return await response.json();
}
