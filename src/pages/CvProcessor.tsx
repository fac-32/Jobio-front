import { useState, type ChangeEvent } from 'react';

// --- Constants ---
const MAX_FILE_SIZE_MB = 5;
// const MIN_TEXT_LENGTH = 5;
const MAX_TEXT_LENGTH = 50;
const ALLOWED_TYPES = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const useBioInputHandler = () => {
    // --- Temporary Local State ---
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [dealBreakers, setDealBreakers] = useState<string>("");
    
    // --- Error State ---
    const [inputError, setInputError] = useState<string | null>(null);

    // 1. Handle File Selection (Immediate Validation)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputError(null); // Clear previous errors
        
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check File Type - handfled already by input accept attribute, but double-check?
            if (!ALLOWED_TYPES.includes(file.type)) {
                setInputError("Invalid file type. Please upload a PDF or Word Document.");
                return;
            }

            // Check File Size
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setInputError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }

            setCvFile(file);
        }
    };

    // 2. Handle Text Input (Length Constraint)
    const handleDealbreakerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        
        // Only update if within limit
        if (text.length >= MAX_TEXT_LENGTH) {
            setInputError(`Input must be less than ${MAX_TEXT_LENGTH} characters.`);
                return; 
        }
        setDealBreakers(text);
    };

    // 3. Final Verification (Call this when user clicks "Upload/Next")
    // Returns the data if valid, or null if invalid
    const verifyAndStageInputs = (): { file: File; text: string } | null => {
        setInputError(null);

        // Constraint: File is mandatory
        if (!cvFile) {
            setInputError("Please select a CV file to upload.");
            return null;
        }

        // Constraint: Dealbreakers can be empty, but we already enforced max length in the handler.
        // Can add minimum length requirements, but would need to test for empty case first & then length
        
        // Return valid data object to be passed to backend logic
        return {
            file: cvFile,
            text: dealBreakers
        };
    };

    return {
        cvFile,
        dealBreakers,
        inputError,
        handleFileChange,
        handleDealbreakerChange,
        verifyAndStageInputs
    };
};
