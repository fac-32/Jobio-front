import type { MatchResult } from './types';

type Props = {
    loading: boolean;
    result: MatchResult | null;
};

export function MatchResultPanel({ loading, result }: Props) {
    if (loading) {
        return (
            <div className="results-card">
                <div className="card-header">
                    <h1 className="card-title">Match results</h1>
                    <p className="match-quality">
                        Matching your profile with this job…
                    </p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="results-card">
                <div className="card-header">
                    <h1 className="card-title">Match results</h1>
                    <p className="match-quality">No match result yet.</p>
                </div>
            </div>
        );
    }

    const safeResult = {
        match_score: result.match_score ?? 0,
        matched_deal_breakers: result.matched_deal_breakers ?? [],
        unmet_or_unknown_deal_breakers:
            result.unmet_or_unknown_deal_breakers ?? [],
        matched_skills: result.matched_skills ?? [],
        missing_or_assumed_skills: result.missing_or_assumed_skills ?? [],
        important_skills_missing: result.important_skills_missing ?? [],
        things_to_work_on: result.things_to_work_on ?? [],
        explanation: result.explanation ?? '',
        recommendation: result.recommendation ?? { label: '', message: '' },
    };

    const headline =
        safeResult.match_score >= 80
            ? "It's a match!"
            : safeResult.match_score >= 65
              ? 'Decent match'
              : 'Weak match';

    const score = safeResult.match_score;
    const recommendationText =
        safeResult.recommendation.message || safeResult.recommendation.label;

    return (
        <div className="results-card">
            {/* Header */}
            <div className="card-header">
                <h1 className="card-title">Match results</h1>
                <p className="match-quality">{headline}</p>
            </div>

            {/* Score */}
            <div className="score-display">
                <div className="score-circle">
                    <div className="score-number">{score}</div>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            {/* Deal breakers */}
            <div className="content-section">
                <div className="section-header">
                    <svg
                        className="section-icon"
                        fill="none"
                        stroke="#dc2626"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    Deal breakers
                </div>
                {safeResult.unmet_or_unknown_deal_breakers.length === 0 && (
                    <div className="deal-breaker">
                        <span>No deal breakers violated</span>
                    </div>
                )}
                <div className="deal-breakers-list">
                    {safeResult.unmet_or_unknown_deal_breakers.map(
                        (item, idx) => (
                            <div className="deal-breaker" key={idx}>
                                <svg
                                    width="20"
                                    height="20"
                                    fill="#dc2626"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{item}</span>
                            </div>
                        ),
                    )}
                </div>
            </div>

            {/* Matched skills */}
            <div className="content-section">
                <div className="section-header">
                    <svg
                        className="section-icon"
                        fill="none"
                        stroke="#10b981"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Matched skills
                </div>
                <div className="skills-grid">
                    {safeResult.matched_skills.length === 0 && (
                        <div className="skill-chip skill-matched">
                            No matched skills detected
                        </div>
                    )}
                    {safeResult.matched_skills.map((skill) => (
                        <div key={skill} className="skill-chip skill-matched">
                            {skill}
                        </div>
                    ))}
                </div>
            </div>

            {/* Important skills missing */}
            <div className="content-section">
                <div className="section-header">
                    <svg
                        className="section-icon"
                        fill="none"
                        stroke="#f59e0b"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    Important skills missing
                </div>
                <div className="skills-grid">
                    {safeResult.important_skills_missing.length === 0 && (
                        <div className="skill-chip skill-missing">
                            No important skills missing
                        </div>
                    )}
                    {safeResult.important_skills_missing.map((skill) => (
                        <div key={skill} className="skill-chip skill-missing">
                            {skill}
                        </div>
                    ))}
                </div>
            </div>

            {/* Things to work on */}
            <div className="content-section">
                <div className="section-header">
                    <svg
                        className="section-icon"
                        fill="none"
                        stroke="#6366f1"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    Things to work on
                </div>
                <div className="skills-grid">
                    {safeResult.things_to_work_on.length === 0 && (
                        <div className="skill-chip skill-work-on">
                            No specific suggestions
                        </div>
                    )}
                    {safeResult.things_to_work_on.map((item, idx) => (
                        <div key={idx} className="skill-chip skill-work-on">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendation */}
            <div className="recommendation-box">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 17 L9 11 L13 15 L20 8"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M20 8 L20 12"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 8 L16 8"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="recommendation-text">
                    <strong>Recommendation:</strong>{' '}
                    <span>{recommendationText}</span>
                </div>
            </div>
        </div>
    );
}
