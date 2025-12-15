// functions to handle CV file and dealbreaker text input with validation
// Manages state, validation, and error messages
// Used by BioPage.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { bioService } from '../../services/bioService'; // Ensure this path matches where you put bioService.ts
import { useNavigate } from 'react-router-dom'; // Import router to redirect if user not signed-in

// --- Constants ---
const MAX_FILE_SIZE_MB = 5;
const MAX_TEXT_LENGTH = 50;
const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' /* .docx */,
    'text/plain',
];

export const useBioInputHandler = () => {
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

    // --- UI Status State (New) ---
    // 'idle' = nothing happening
    // 'uploading' = sending data
    // 'success' = backend accepted it
    // 'error' = validation failed or backend failed
    const [status, setStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle');
    const [inputError, setInputError] = useState<string | null>(null);

    // 1. Handle File Selection (Immediate Validation)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputError(null);
        setStatus('idle'); // Reset status if user changes file after error

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!ALLOWED_TYPES.includes(file.type)) {
                setInputError(
                    'Invalid file type. Please upload a PDF or Word Document.',
                );
                return;
            }

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

    // 3. The Master Submit Function
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

        // Prepare clean data
        const cleanedDealBreakers = dealBreakers
            .map((d) => d.trim())
            .filter((d) => d !== '');

        // --- B. Submission Phase ---
        setStatus('uploading');

        try {
            // Call the service (which handles the FormData conversion internally)
            await bioService.uploadBio({
                cv: cvFile,
                dealBreakers: cleanedDealBreakers,
            });

            setStatus('success');
            console.log('Upload complete!');
        } catch (error) {
            console.error(error);
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
