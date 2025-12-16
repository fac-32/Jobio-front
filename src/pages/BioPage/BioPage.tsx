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
        cvFile, // <--- Current CV file state
        hasExistingCv, // <--- Does the user already have a CV uploaded?
        dealBreakers, // <--- Current dealbreakers state
        inputError, // <--- Error message from validation or backend
        isUploading, // <--- Loading state
        isSuccess, // <--- Success state
        bioKeywords, // <--- Extracted keywords from CV
        enableEditing, // <--- Function to re-enable editing
        isLoadingData, // <--- Get the loading state
    } = useBioForm();

    // --- LOADING STATE ---
    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-500">Checking profile...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center mt-16 px-4 pb-24">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                {isSuccess
                    ? 'Your Profile'
                    : hasExistingCv
                      ? 'Update Profile'
                      : 'Create Profile'}
            </h1>

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

            {/* --- VIEW MODE (Success or Existing Data) --- */}
            {isSuccess ? (
                // --- UPDATE #1: WIDER CONTAINER FOR VIEW MODE ---
                <div className="w-full md:w-2/3 lg:w-1/2 max-w-4xl space-y-6 animate-fade-in transition-all duration-300">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-left mb-6">
                        <span className="font-bold">Ready for matching!</span>{' '}
                        Your profile.
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

                    <div className="flex flex-col gap-3 mt-6">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/match')}
                            className="w-full py-3 text-lg"
                        >
                            Find Matches
                        </Button>

                        <button
                            onClick={enableEditing}
                            className="text-slate-500 hover:text-blue-600 text-sm font-semibold underline decoration-dotted underline-offset-4"
                        >
                            Edit Keywords or Dealbreakers
                        </button>
                    </div>
                </div>
            ) : (
                /* --- FORM MODE (Edit / Create) --- */
                <div className="w-full md:w-2/3 lg:w-1/2 max-w-4xl space-y-6 transition-all duration-300">
                    {/* File Input */}
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {hasExistingCv
                                ? 'Update CV (Optional)'
                                : 'Upload CV'}{' '}
                        </label>

                        {hasExistingCv && !cvFile && (
                            <div className="text-xs text-green-600 mb-2 font-medium bg-green-50 p-2 rounded border border-green-200">
                                ✓ Current CV active. Upload new file only to
                                replace it.
                            </div>
                        )}
                        <input
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
                        {dealBreakers.map((text, index) => {
                            // Determine the default display text
                            const defaultPlaceholder = `Dealbreaker #${index + 1}`;
                            return (
                                <div key={index} className="relative">
                                    <input
                                        type="text"
                                        placeholder={defaultPlaceholder} // <-- ONLY use placeholder for hint
                                        value={text} // <-- ALWAYS use the actual state value
                                        className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                        onChange={(e) =>
                                            // Update state with whatever the user types
                                            handleDealbreakerChange(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        disabled={isUploading}
                                    />

                                    {/* The rest of your code for character count remains the same */}
                                    <div
                                        className={`absolute right-3 top-3 text-xs ${text.length === MAX_TEXT_LENGTH ? 'text-red-500 font-bold' : 'text-gray-400'}`}
                                    >
                                        {text.length}/{MAX_TEXT_LENGTH}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        onClick={submitBio}
                        disabled={isUploading}
                        className="w-full py-3 text-lg shadow-lg disabled:opacity-70"
                    >
                        {isUploading
                            ? 'Saving...'
                            : hasExistingCv
                              ? 'Save Changes'
                              : 'Upload Bio'}
                    </Button>

                    {/* Cancel Edit Button */}
                    {hasExistingCv && (
                        <button
                            onClick={() => window.location.reload()}
                            className="text-slate-400 text-sm hover:text-slate-600 block mx-auto mt-2"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
