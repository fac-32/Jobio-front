const BASE_URL = 'http://localhost:3000';

export async function api(path: string, options: RequestInit = {}) {
    // prepare headers
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    // FIX: Check constructor name to safely detect FormData
    // using 'instanceof' can sometimes fail in certain environments.
    const isFormData =
        options.body && options.body.constructor.name === 'FormData';

    // Only add JSON header if we are NOT sending a file
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    // make the fetch call
    const res = await fetch(BASE_URL + path, {
        ...options,
        headers, // contains auth and correct content-type
    });

    // Handle errors centrally
    if (!res.ok) {
        // Try to parse error as JSON first, fallback to text
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || `Error ${res.status}`);
        } catch {
            // If the error body wasn't JSON, throw the raw text
            throw new Error(text || `HTTP Error ${res.status}`);
        }
    }

    return data;
}
