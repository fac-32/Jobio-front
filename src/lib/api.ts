export const BASE_URL = 'https://jobio-back.onrender.com';

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

    const data = await res.json();

    // Handle errors centrally
    if (!res.ok) {
        const error: any = new Error(data?.error || 'Request failed');
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}
