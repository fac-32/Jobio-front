// export default function MatchResultPanel() {
//     return (
//         <div className="h-full p-4">
//             <h2 className="text-xl font-semibold mb-4">Match Results</h2>

//             <div className="text-gray-600 text-sm">
//                 {/* Placeholder */}
//                 No match result yet.
//             </div>
//         </div>
//     );
// }

// src/pages/MatchPage/MatchResultPanel.tsx

import type { MatchResult } from '../../lib/api';

type Props = {
    loading: boolean;
    result: MatchResult | null;
};

export function MatchResultPanel({ loading, result }: Props) {
    if (loading) {
        return (
            <div>
                <h2>Match Results</h2>
                <p>Matching your profile with this job…</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div>
                <h2>Match Results</h2>
                <p>No match result yet.</p>
            </div>
        );
    }

    // Safe defaults in case some fields are missing
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
            : safeResult.match_score >= 50
              ? 'Decent match'
              : 'Weak match';

    return (
        <div>
            <h2>Match Results</h2>
            <h3>{headline}</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                {safeResult.match_score}
            </p>

            {safeResult.unmet_or_unknown_deal_breakers.length > 0 && (
                <p style={{ color: '#b91c1c' }}>
                    Deal breakers violated:{' '}
                    {safeResult.unmet_or_unknown_deal_breakers.join(', ')}
                </p>
            )}

            <p>{safeResult.explanation}</p>

            <h4>Matched skills</h4>
            {safeResult.matched_skills.length ? (
                <ul>
                    {safeResult.matched_skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                    ))}
                </ul>
            ) : (
                <p>No matched skills detected.</p>
            )}

            {safeResult.missing_or_assumed_skills.length > 0 && (
                <>
                    <h4>Missing or assumed skills</h4>
                    <ul>
                        {safeResult.missing_or_assumed_skills.map((skill) => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </>
            )}

            {safeResult.important_skills_missing.length > 0 && (
                <>
                    <h4>Important skills missing</h4>
                    <ul>
                        {safeResult.important_skills_missing.map((skill) => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </>
            )}

            {safeResult.things_to_work_on.length > 0 && (
                <>
                    <h4>Things to work on</h4>
                    <ul>
                        {safeResult.things_to_work_on.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </>
            )}

            <p>
                Recommendation:{' '}
                <strong>
                    {safeResult.recommendation.message ||
                        safeResult.recommendation.label}
                </strong>
            </p>
        </div>
    );
}
