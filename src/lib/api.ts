export async function api(url: string, options?: RequestInit) {
    const res = await fetch(`http://localhost:3000${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        const error: any = new Error(data?.error || 'Request failed');
        error.status = res.status;
        throw error;
    }

    return data;
}
