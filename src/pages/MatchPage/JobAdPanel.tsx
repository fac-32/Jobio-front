type Props = {
    jobDescription: string;
    onChange: (value: string) => void;
    onMatchClick: () => void;
    loading: boolean;
};

export function JobAdPanel({
    jobDescription,
    onChange,
    onMatchClick,
    loading,
}: Props) {
    return (
        <div className="left-column">
            <div className="job-card">
                <div className="job-label"></div>
                <div className="job-type-row">
                    <span className="job-type-pill">Job description</span>
                </div>
                <div className="job-content">
                    <textarea
                        className="job-textarea"
                        value={jobDescription}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Paste the job description here…"
                    />
                </div>
            </div>
            <div className="match-button-row">
                <button
                    onClick={onMatchClick}
                    disabled={loading}
                    className="match-button"
                >
                    {loading ? 'Matching…' : 'Match Me'}
                </button>
            </div>
        </div>
    );
}
