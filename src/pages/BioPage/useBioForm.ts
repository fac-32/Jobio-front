// functions to handle CV file and dealbreaker text input with validation
// Manages state, validation, and error messages
// Used by BioPage.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { bioService } from './bioService'; // Ensure this path matches where you put bioService.ts
import { useNavigate } from 'react-router-dom'; // Import router to redirect if user not signed-in

// --- Constants ---
const MAX_FILE_SIZE_MB = 5;
const MAX_TEXT_LENGTH = 50;
const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' /* .docx */,
    'text/plain',
];

export const useBioForm = () => {
    const navigate = useNavigate(); // Initialize navigation

    // --- The Auth Guard ---
    // This runs once when the component loads.
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // User isn't logged in? Send them to Sign In immediately.
            // 'replace: true' prevents them from clicking "Back" to return here.
            navigate('/sign-in', { replace: true });
        }
    }, [navigate]);

    // --- Local Data State ---
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [dealBreakers, setDealBreakers] = useState<string[]>(
        Array(5).fill(''),
    );
    const [bioKeywords, setBioKeywords] = useState<string[]>([]); // store the keywords extracted from the CV

    // --- UI Status State (New) ---
    // 'idle' = nothing happening
    // 'uploading' = sending data
    // 'success' = backend accepted it
    // 'error' = validation failed or backend failed
    const [status, setStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle');
    const [inputError, setInputError] = useState<string | null>(null);

    // --- 4. Handlers ---
    // 1. Handle File Selection (Immediate Validation)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputError(null);
        setStatus('idle'); // Reset status if user changes file after error

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate Type
            if (!ALLOWED_TYPES.includes(file.type)) {
                setInputError(
                    'Invalid file type. Please upload a PDF or Word Document.',
                );
                return;
            }
            // Validate Size
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setInputError(
                    `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
                );
                return;
            }

            setCvFile(file);
        }
    };

    // 2. Handle Text Input
    const handleDealbreakerChange = (index: number, value: string) => {
        if (inputError) setInputError(null);

        const updatedList = [...dealBreakers];
        updatedList[index] = value;
        setDealBreakers(updatedList);
    };

    // --- The Master Submit Function ---
    // It validates AND sends the data - UI just calls this
    const submitBio = async () => {
        setInputError(null);

        // --- A. Validation Phase ---
        if (!cvFile) {
            setInputError('Please select a CV file to upload.');
            return;
        }

        const hasLengthViolation = dealBreakers.some(
            (text) => text.length > MAX_TEXT_LENGTH,
        );
        if (hasLengthViolation) {
            setInputError(
                `One or more dealbreakers exceed the ${MAX_TEXT_LENGTH} character limit.`,
            );
            return;
        }

        // Prepare clean dealbreakers (trimmed, non-empty)
        const cleanedDealBreakers = dealBreakers
            .map((d) => d.trim())
            .filter((d) => d !== '');

        // --- B. Submission Phase ---
        setStatus('uploading');
        setBioKeywords([]); // Clear previous results

        try {
            // Step 1: Upload CV
            // Call the service (which handles the FormData conversion internally)
            const cvResponse = await bioService.uploadCV(cvFile);

            // Capture the keywords from the backend response
            // The key 'generated_tags' matches the backend response
            if (cvResponse.generated_tags) {
                setBioKeywords(cvResponse.generated_tags);
            }

            // Step 2: Upload Dealbreakers (only if CV upload worked)
            if (cleanedDealBreakers.length > 0) {
                await bioService.uploadDealbreakers(cleanedDealBreakers);
            }

            setStatus('success');
            console.log('AI Output:', cvResponse.generated_tags); // Check console too!
        } catch (error) {
            console.error('Bio submission failed:', error);
            setStatus('error');
            // Check if the error object has a message we can show
            const msg =
                error instanceof Error
                    ? error.message
                    : 'Failed to connect to the server.';
            setInputError(msg);
        }
    };

    return {
        // Data
        cvFile,
        dealBreakers,
        bioKeywords, // Export this so the UI can use it

        // Status Flags (Easy for UI to read)
        inputError,
        isUploading: status === 'uploading',
        isSuccess: status === 'success',

        // Actions
        handleFileChange,
        handleDealbreakerChange,
        submitBio, // The UI only needs to call this now
    };
};
