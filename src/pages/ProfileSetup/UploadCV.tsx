interface UploadCVProps {
    cvFile?: File;
    setCVFile: (file?: File) => void;
}

export default function UploadCV({ cvFile, setCVFile }: UploadCVProps) {
    return (
        <div className="space-y-2">
            <label className="block font-medium">Upload CV</label>
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCVFile(e.target.files?.[0])}
                className="border p-2 rounded"
            />
            {cvFile && <p>Selected file: {cvFile.name}</p>}
        </div>
    );
}
