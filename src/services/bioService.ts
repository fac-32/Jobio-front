import { type BioPayload } from '../pages/types';

// Service to handle Bio uploads to the backend

// Path to the backend API
const API_URL = 'http://localhost:3000';

export const bioService = {
    uploadBio: async (payload: BioPayload) => {
        const formData = new FormData();

        // FIX IS HERE: Use 'payload.cv', NOT 'payload.file'
        formData.append('cv', payload.cv);

        // Append dealbreakers
        formData.append('dealbreakers', JSON.stringify(payload.dealBreakers));

        try {
            const response = await fetch(`${API_URL}/upload-cv`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Bio upload error:', error);
            throw error;
        }
    },
};
