import { type BioPayload } from '../types';
import { api } from '../../lib/api';

// Service to handle Bio uploads to the backend

export const bioService = {
    uploadBio: async (payload: BioPayload) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to upload a bio.'); // Ensure authentication
        }
        // Prepare form data
        const formData = new FormData();
        formData.append('cv', payload.cv);
        // // Backend requires 'user_id' as well, but we assume it's extracted from the token server-side
        // formData.append('dealbreakers', JSON.stringify(payload.dealBreakers));

        try {
            // Points to the router mounted at /users_cvs
            const response = await api(`/users_cvs`, {
                method: 'POST',
                headers: {
                    // Attach the authorisation token here
                    Authorization: `Bearer ${token}`,
                    // Note: do NOT set 'Content-Type' for FormData; fetch handles it.
                },
                body: formData,
            });

            // SUCCESS: No need to check response.ok here.
            // If we reached this line, the upload worked.
            return response;

            // if (!response.ok) {
            //     if (response.status === 401) {
            //         throw new Error('Session expired. Please login again.');
            //     }
            //     const text = await response.text();
            //     try {
            //         const json = JSON.parse(text);
            //         throw new Error(json.error || 'Upload failed');
            //     } catch {
            //         throw new Error(
            //             `Server error: ${response.status} ${response.statusText}`,
            //         );
            //     }
            // }

            return await response.json();
        } catch (error) {
            console.error('Bio upload error:', error);
            throw error;
        }
    },
};
