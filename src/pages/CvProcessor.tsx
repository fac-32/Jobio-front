// functions to handle CV file and dealbreaker text input with validation
// Manages state, validation, and error messages
// Used by BioPage.tsx
import { useState, type ChangeEvent } from 'react';

// --- Constants ---
const MAX_FILE_SIZE_MB = 5;
// const MIN_TEXT_LENGTH = 5;
const MAX_TEXT_LENGTH = 50;
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface BioData {
    file: File;
    dealBreakers: string[];
}

export const useBioInputHandler = () => {
    // --- Temporary Local State ---
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [dealBreakers, setDealBreakers] = useState<string[]>(
        Array(5).fill(''),
    );

    // --- Error State ---
    const [inputError, setInputError] = useState<string | null>(null);

    // 1. Handle File Selection (Immediate Validation)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputError(null); // Clear previous errors

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check File Type - handfled already by input accept attribute, but double-check?
            if (!ALLOWED_TYPES.includes(file.type)) {
                setInputError(
                    'Invalid file type. Please upload a PDF or Word Document.',
                );
                return;
            }

            // Check File Size
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setInputError(
                    `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
                );
                return;
            }

            setCvFile(file);
        }
    };

    // 2. Handle Text Input (Length Constraint)
    const handleDealbreakerChange = (index: number, value: string) => {
        // Removed the "if (value.length <= MAX)" block.
        // This lets the user type 150 chars, see the error, and fix it.

        if (inputError) setInputError(null); // Clear error on edit

        const updatedList = [...dealBreakers];
        updatedList[index] = value;
        setDealBreakers(updatedList);
    };

    // 3. Final Verification (Call this when user clicks "Upload/Next")
    // Returns the data if valid, or null if invalid
    const verifyAndStageInputs = (): BioData | null => {
        setInputError(null);

        // Constraint: File is mandatory
        if (!cvFile) {
            setInputError('Please select a CV file to upload.');
            return null;
        }

        // Constraint: Dealbreakers can be empty, but enforce max length here.
        // We look for ANY item in the array that exceeds the limit
        const hasLengthViolation = dealBreakers.some(
            (text) => text.length > MAX_TEXT_LENGTH,
        );
        if (hasLengthViolation) {
            setInputError(
                `One or more dealbreakers exceed the ${MAX_TEXT_LENGTH} character limit. Please shorten them.`,
            );
            return null;
        }
        // We only want to send actual text, not empty strings
        const cleanedDealBreakers = dealBreakers
            .map((d) => d.trim())
            .filter((d) => d !== '');

        // Return valid data object to be passed to backend logic
        return {
            file: cvFile,
            dealBreakers: cleanedDealBreakers,
        };
    };

    return {
        cvFile,
        dealBreakers,
        inputError,
        handleFileChange,
        handleDealbreakerChange,
        verifyAndStageInputs,
    };
};
