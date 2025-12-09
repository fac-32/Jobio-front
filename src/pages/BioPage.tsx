import { Button } from '../components/ui/Button';

// BioPage: allows user to upload their bio, including a CV file and 
// some text as their dealbreakers
export default function BioPage() {

    // Set up UI for bio upload
    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                Upload Your Bio
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
                Please upload your CV and provide any dealbreakers you have for job matching.
            </p>

            <div className="space-y-4">
                <input type="file" accept=".pdf,.doc,.docx" className="border p-2" />
                <textarea
                    placeholder="Enter your dealbreakers here..."
                    className="border p-2 w-full max-w-md h-32"
                ></textarea>
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

async function handleUpload() {
    // Placeholder function for handling bio upload
    console.log('Bio uploaded (functionality to be implemented)');
}