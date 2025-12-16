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
        if (!token)
            throw new Error('You must be logged in to save dealbreakers.');

        return api('/users_dealbreakers', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ dealbreakers: dealBreakers }),
        });
    },
};
