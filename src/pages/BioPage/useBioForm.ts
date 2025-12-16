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
        Array.from({ length: 5 }, (_, i) => `Dealbreaker #${i + 1}`),
    );
    const [bioKeywords, setBioKeywords] = useState<string[]>([]); // store the keywords extracted from the CV
    const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for initial fetch
    const [hasExistingCv, setHasExistingCv] = useState(false); //Track if backend already has a CV

    // --- UI Status State (New) ---
    // 'idle' = nothing happening
    // 'uploading' = sending data
    // 'success' = backend accepted it
    // 'error' = validation failed or backend failed
    const [status, setStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle');
    const [inputError, setInputError] = useState<string | null>(null);

    // ---  Handlers ---

    // 1. Enable Editing
    // Simply resets status to 'idle' so the form renders again.
    // We keep the data in state so the inputs are pre-filled.
    const enableEditing = () => {
        setStatus('idle');
        setInputError(null);
    };

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

    // --- Fetch Data on Mount ---
    useEffect(() => {
        const checkExistingProfile = async () => {
            try {
                // Fetch both in parallel
                const [keywords, dbList] = await Promise.all([
                    bioService.getCVKeywords(),
                    bioService.getDealbreakers(),
                ]);

                console.log('Fetched dealbreakers:', dbList);

                let hasData = false;

                // 1. Handle keywords
                if (keywords.length > 0) {
                    setBioKeywords(keywords);
                    hasData = true;
                    setHasExistingCv(true); // Mark that we have a CV
                }

                // 2. Handle Dealbreakers
                if (dbList.length > 0) {
                    // We need 5 inputs in the UI, so we add empty strings if we have fewer than 5
                    const paddedList = [...dbList, ...Array(5).fill('')].slice(
                        0,
                        5,
                    );

                    // Filter out any default placeholder strings that might still be in the initial state
                    // before we set the new data.
                    setDealBreakers(paddedList); // <--- This is correct as it overwrites the initial state
                    hasData = true;
                }
                // If dbList is empty, the state remains initialized to the "Dealbreaker #X" strings.

                // If we found data, show the Success/View screen immediately
                if (hasData) {
                    setStatus('success');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                // We don't block the user; if fetch fails, just let them fill the form
            } finally {
                setIsLoadingData(false);
            }
        };

        checkExistingProfile();
    }, []);

    // --- Submit Function ---
    // It validates AND sends the data - UI just calls this
    const submitBio = async () => {
        setInputError(null);

        // --- A. Validation Phase ---
        // 1. Check for CV: strictly require a file ONLY if we don't have one on the server yet.
        if (!cvFile && !hasExistingCv) {
            setInputError('Please select a CV file to upload.');
            return;
        }

        // 2. Check for text length violations
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
            .map((d) => d.trim()) // Trim whitespace
            .filter((d) => d !== ''); // <-- REMOVES EMPTY STRINGS

        // --- B. Submission Phase ---
        setStatus('uploading');
        // REMOVED: setBioKeywords([]) from here.
        // We only want to clear keywords if we are actually uploading a NEW file.

        try {
            // Step 1: Upload CV (Only if user selected a NEW file)
            if (cvFile) {
                // Now it is safe to clear old keywords because we are fetching new ones
                setBioKeywords([]);

                const cvResponse = await bioService.uploadCV(cvFile);

                if (cvResponse.generated_tags) {
                    setBioKeywords(cvResponse.generated_tags);
                }
                setHasExistingCv(true); // Mark that we definitely have a CV now
            }

            // Step 2: Upload Dealbreakers
            // We upload if there are any, even if we didn't upload a new CV
            if (cleanedDealBreakers.length > 0) {
                await bioService.uploadDealbreakers(cleanedDealBreakers);
            }

            setStatus('success');
        } catch (error) {
            console.error('Bio submission failed:', error);
            setStatus('error');
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
        isLoadingData,
        hasExistingCv,
        enableEditing,
        // Actions
        handleFileChange,
        handleDealbreakerChange,
        submitBio, // The UI only needs to call this now
    };
};
