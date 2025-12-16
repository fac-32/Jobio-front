import { api } from '../../lib/api';

// Service to handle Bio uploads to the backend

export const bioService = {
    // 1. Upload CV
    uploadCV: async (file: File) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        if (!token) throw new Error('You must be logged in to upload a CV.'); // Ensure authentication
        // Prepare form data
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('user_id', userId || '');
        console.log('Uploading CV for user ID:', userId);

        // We just return the promise. If it fails, api() throws and error,
        // and the component calling this function will catch it.
        return api('/users_cvs', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }, // Attach the authorisation token here
            body: formData,
        });
    },

    // 2. Upload Dealbreakers
    uploadDealbreakers: async (dealBreakers: string[]) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        if (!token)
            throw new Error('You must be logged in to save dealbreakers.');

        return api('/users_dealbreakers', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                dealbreakers: dealBreakers,
                user_id: userId,
            }),
        });
    },

    // --- GET METHODS ---

    // 3. Get Keywords
    getCVKeywords: async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        // Return empty array if no user/token, rather than null/error
        if (!token || !userId) return [];

        // A. Get the raw list from backend
        const data = await api(`/users_cvs?user_id=${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        // B. Check if we actually found a record
        // The backend returns an array, so we check if it has at least one item
        if (Array.isArray(data) && data.length > 0) {
            const record = data[0]; // Take the first record

            // C. Extract the string (e.g., "React, Node, CSS")
            const keywordsString = record.cv_keywords;

            // D. Convert String -> Array
            if (typeof keywordsString === 'string') {
                return keywordsString
                    .split(',') // Split by comma
                    .map((k: string) => k.trim()) // Remove extra spaces
                    .filter((k: string) => k.length > 0); // Remove empty strings
            }
        }

        // Default: Return empty array if no record or no keywords found
        return [];
    },
    // 4. Get Dealbreakers (Cleaned)
    getDealbreakers: async (): Promise<string[]> => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        if (!token || !userId) return [];

        const data = await api(`/users_dealbreakers?user_id=${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        // Case A: Backend returns multiple rows (e.g. [{ dealbreaker_text: "A"}, { dealbreaker_text: "B"}])
        if (Array.isArray(data) && data.length > 0) {
            // CHECK YOUR DB COLUMN NAME: Is it 'dealbreaker_text', 'text', or 'content'?
            // Replace 'dealbreaker_text' below with your actual Supabase column name.
            return data.map(
                (item: { dealbreaker_text?: string; text?: string }) =>
                    item.dealbreaker_text || item.text || '',
            );
        }

        // Case B: If no data found
        return [];
    },
};
