import { useState } from 'react';
import { matchJob } from './matchApi';
import type { MatchResult } from './types';
import { JobAdPanel } from './JobAdPanel';
import { MatchResultPanel } from './MatchResultPanel';

function MatchPage() {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<MatchResult | null>(null);

    const token = localStorage.getItem('token') ?? '';

    const handleMatch = async () => {
        setError(null);
        setResult(null);

        if (!jobDescription.trim()) {
            setError('Please paste a job description first.');
            return;
        }
        if (!token) {
            setError('You must be signed in to use matching.');
            return;
        }

        setLoading(true);
        try {
            const data = await matchJob({ jobDescription, token });
            setResult(data);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error while calling matching API.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex overflow-hidden">
            <div className="w-1/2 bg-gray-50 p-4 flex">
                <JobAdPanel
                    jobDescription={jobDescription}
                    onChange={setJobDescription}
                    onMatchClick={handleMatch}
                    loading={loading}
                />
                {error && <p className="match-error">{error}</p>}
            </div>
            <div className="w-1/2 bg-gray-50 p-4 flex">
                <MatchResultPanel loading={loading} result={result} />
            </div>
        </div>
    );
}

export default MatchPage;
