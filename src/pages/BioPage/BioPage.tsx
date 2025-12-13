import { Button } from '../../components/ui/Button';
import { useBioInputHandler } from './CvProcessor';
import { api } from '../../lib/api';
const MAX_TEXT_LENGTH = 50;

// BioPage: allows user to upload their bio, including a CV file and
// some text as their dealbreakers
export default function BioPage() {
    // Initialize the hook at the top level of the component
    // This creates the state variables (cvFile, dealBreakers) in memory.
    const {
        handleFileChange,
        handleDealbreakerChange,
        verifyAndStageInputs,
        dealBreakers, // We need this to control the textarea value
        inputError,
    } = useBioInputHandler();

    // Define handleUpload INSIDE the component so it can access 'verifyAndStageInputs'
    const handleUpload = async () => {
        // This calls the verification logic from your hook
        // Note: No arguments are needed. It checks the hook's internal state.
        const validData = verifyAndStageInputs();

        if (validData) {
            // SUCCESS: 'validData' now contains { file: File, text: string }
            console.log('Validation passed!');
            console.log('File:', validData.file.name);
            console.log('Dealbreakers:', validData.dealBreakers);

            // TODO: Call your backend service here
            // await uploadService.send(validData);
            const form = new FormData();
            form.append('cv', validData.file, validData.file.name);
            form.append('user_id', `${localStorage.getItem('user_id')}`);
            // append cv_keywords is a placeholder
            form.append(
                'cv_keywords',
                JSON.stringify(['anson working on integration']),
            );
            api('/users_cvs/upload', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                method: 'POST',
                body: form,
            });
            api('/users_dealbreakers', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    user_id: 9 /* hard coded placeholder */,
                    dealbreakers: validData.dealBreakers,
                }),
            });
        } else {
            console.log('Validation failed');
        }
    };

    // Set up UI for bio upload
    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                Upload Your Bio
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
                Please upload your CV and provide any dealbreakers you have for
                job matching.
            </p>

            {/* --- ERROR BANNER START --- */}
            {/* We only render this block if inputError is not null */}
            {inputError && (
                <div
                    role="alert"
                    className="mb-6 px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 max-w-md w-full text-left flex items-center gap-2"
                >
                    {/* Optional: Add a small warning icon */}
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

                    {/* The Message from the Hook */}
                    <span className="block sm:inline">{inputError}</span>
                </div>
            )}
            {/* --- ERROR BANNER END --- */}

            <div className="space-y-4">
                {/* File input for CV upload - only accept PDF or Word documents */}
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    // className="border p-2 w-full max-w-md"
                    // Connects the UI to your Hook logic
                    onChange={handleFileChange}
                    className={`border p-2 w-full max-w-md rounded 
                        ${inputError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                />
                {/* <textarea
                    placeholder="Enter your dealbreakers here..."
                    className="border p-2 w-full max-w-md h-32"
                    // Connects the UI to your Hook logic
                    onChange={handleDealbreakerChange}
                    // Ensures the box shows exactly what is in your state
                    value={dealBreakers}
                ></textarea> */}
                <div className="space-y-4">
                    {dealBreakers.map((text, index) => (
                        <div key={index} className="w-full">
                            <input
                                type="text"
                                placeholder={`Dealbreaker #${index + 1}`}
                                className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={text}
                                onChange={(e) =>
                                    handleDealbreakerChange(
                                        index,
                                        e.target.value,
                                    )
                                }
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
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    className="px-6 py-3 text-lg"
                >
                    Upload Bio
                </Button>
            </div>
        </div>
    );
}
