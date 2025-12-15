import { type BioPayload } from '../pages/types';

// Service to handle Bio uploads to the backend

// Path to the backend API
const API_URL = 'http://localhost:3000';

export const bioService = {
    uploadBio: async (payload: BioPayload) => {
        // Get the token (Adjust 'token' to whatever key you use in localStorage)
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to upload a bio.'); // Ensure authentication
        }
        // Prepare form data
        const formData = new FormData();
        formData.append('cv', payload.cv);
        formData.append('dealbreakers', JSON.stringify(payload.dealBreakers));

        try {
            const response = await fetch(`${API_URL}/upload-cv`, {
                method: 'POST',
                headers: {
                    // Attach the authorisation token here
                    Authorization: `Bearer ${token}`,
                    // Note: do NOT set 'Content-Type' for FormData; fetch handles it.
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please login again.');
                }
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.error || 'Upload failed');
                } catch {
                    throw new Error(
                        `Server error: ${response.status} ${response.statusText}`,
                    );
                }
            }

            return await response.json();
        } catch (error) {
            console.error('Bio upload error:', error);
            throw error;
        }
    },
};
