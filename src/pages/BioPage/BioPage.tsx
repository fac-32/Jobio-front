import { Button } from '../../components/ui/Button';
import { useBioForm } from './useBioForm';
import { useNavigate } from 'react-router-dom';

// Keep this for the character counter display
const MAX_TEXT_LENGTH = 50;

export default function BioPage() {
    const navigate = useNavigate();

    // We now get everything we need directly from the hook.
    // The hook handles the heavy lifting (validation, API calls, error states).
    const {
        handleFileChange, // <--- The function to call on cvfile input change
        handleDealbreakerChange, // <--- The function to call on dealbreaker input change
        submitBio, // <--- The function to call on submit
        cvFile,
        dealBreakers, // <--- Current dealbreakers state
        inputError, // <--- Error message from validation or backend
        isUploading, // <--- Loading state
        isSuccess, // <--- Success state
        bioKeywords, // <--- Extracted keywords from CV
    } = useBioForm();

    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                {isSuccess ? 'Profile Created!' : 'Upload Your Bio'}
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mb-10">
                {isSuccess
                    ? 'Your CV and dealbreakers have been saved successfully.'
                    : 'Please upload your CV and provide any dealbreakers you have for job matching.'}
            </p>
            {/* --- ERROR BANNER --- */}
            {inputError && (
                <div
                    role="alert"
                    className="mb-6 px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 max-w-md w-full text-left flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="block sm:inline">{inputError}</span>
                </div>
            )}
            {/* --- SUCCESS STATE (View Mode) --- */}
            {isSuccess ? (
                <div className="w-full max-w-md space-y-6 animate-fade-in">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-left mb-6">
                        <span className="font-bold">Success!</span> Your profile
                        has been updated.
                    </div>

                    {/* 1. AI Keywords Display */}
                    {bioKeywords.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left shadow-sm">
                            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    ></path>
                                </svg>
                                AI Extracted Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {bioKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="bg-white text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. Dealbreakers Display */}
                    {dealBreakers.some((d) => d.trim() !== '') && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left shadow-sm">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    ></path>
                                </svg>
                                Your Dealbreakers
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-700">
                                {dealBreakers
                                    .filter((d) => d.trim() !== '')
                                    .map((item, index) => (
                                        <li
                                            key={index}
                                            className="text-sm border-b border-slate-100 last:border-0 pb-1 last:pb-0"
                                        >
                                            {item}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Navigation Button */}
                    <Button
                        variant="primary"
                        onClick={() => navigate('/match')}
                        className="w-full py-3 text-lg mt-4"
                    >
                        Continue to Find My Matches
                    </Button>
                </div>
            ) : (
                /* --- FORM STATE (Edit Mode) --- */
                <div className="space-y-6 w-full max-w-md">
                    {/* File Input */}
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload CV (PDF or Word)
                        </label>
                        <input
                            // Key helps reset the input if needed
                            key={cvFile ? 'has-file' : 'no-file'}
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className={`block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer border rounded p-2
                                ${inputError ? 'border-red-500' : 'border-gray-300'}
                            `}
                        />
                    </div>

                    {/* Dealbreakers List */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 text-left">
                            Top 5 Dealbreakers
                        </label>
                        {dealBreakers.map((text, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="text"
                                    placeholder={`Dealbreaker #${index + 1}`}
                                    className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                    value={text}
                                    onChange={(e) =>
                                        handleDealbreakerChange(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    disabled={isUploading}
                                />
                                <div
                                    className={`absolute right-3 top-3 text-xs ${
                                        text.length === MAX_TEXT_LENGTH
                                            ? 'text-red-500 font-bold'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {text.length}/{MAX_TEXT_LENGTH}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        onClick={submitBio}
                        disabled={isUploading}
                        className="w-full py-3 text-lg shadow-lg disabled:opacity-70"
                    >
                        {isUploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Uploading...
                            </span>
                        ) : (
                            'Upload Bio'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
