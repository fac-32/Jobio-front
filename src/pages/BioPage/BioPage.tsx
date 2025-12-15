import { Button } from '../../components/ui/Button';
import { useBioInputHandler } from './CvProcessor';

// Keep this for the character counter display
const MAX_TEXT_LENGTH = 50;

export default function BioPage() {
    // We now get everything we need directly from the hook.
    // The hook handles the heavy lifting (validation, API calls, error states).
    const {
        handleFileChange, // <--- The function to call on cvfile input change
        handleDealbreakerChange, // <--- The function to call on dealbreaker input change
        submitBio, // <--- The function to call on submit
        dealBreakers, // <--- Current dealbreakers state
        inputError, // <--- Error message from validation or backend
        isUploading, // <--- Loading state
        isSuccess, // <--- Success state
        bioKeywords, // <--- Extracted keywords from CV
    } = useBioInputHandler();

    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                Upload Your Bio
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
                Please upload your CV and provide any dealbreakers you have for
                job matching.
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

            {/* Bio Keywords Display Section */}
            {isSuccess && bioKeywords.length > 0 && (
                <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">
                        AI Extracted Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {bioKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="bg-white text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SUCCESS BANNER --- */}
            {isSuccess && (
                <div
                    role="alert"
                    className="mb-6 px-4 py-3 rounded relative bg-green-100 border border-green-400 text-green-700 max-w-md w-full text-left"
                >
                    <span className="font-bold">Success!</span> Your bio has
                    been uploaded.
                </div>
            )}

            <div className="space-y-4">
                {/* File input */}
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className={`border p-2 w-full max-w-md rounded 
                        ${inputError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                />

                {/* Dealbreakers Input List */}
                <div className="space-y-4">
                    {dealBreakers.map((text, index) => (
                        <div key={index} className="w-full">
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

                            {/* Character Counter */}
                            <div
                                className={`text-xs text-right mt-1 ${
                                    text.length === MAX_TEXT_LENGTH
                                        ? 'text-red-500 font-bold'
                                        : 'text-gray-400'
                                }`}
                            >
                                {text.length} / {MAX_TEXT_LENGTH}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <Button
                    variant="primary"
                    onClick={submitBio} // Directly calling the hook function
                    disabled={isUploading}
                    className="px-6 py-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Uploading...' : 'Upload Bio'}
                </Button>
            </div>
        </div>
    );
}
