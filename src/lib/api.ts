const BASE_URL = 'http://localhost:3000';

export async function api(path: string, options: RequestInit = {}) {
    const res = await fetch(BASE_URL + path, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    return res.json();
}

// export type MatchResult = {
//   overall_match_score: number;
//   deal_breakers_violated: string[];
//   matched_skills: string[];
//   missing_must_have_skills: string[];
//   explanation_short: string;
//   recommendation: 'apply' | 'apply_with_caveats' | 'do_not_apply';
// };

export type MatchResult = {
    match_score: number;
    matched_deal_breakers: string[];
    unmet_or_unknown_deal_breakers: string[];
    matched_skills: string[];
    missing_or_assumed_skills: string[];
    important_skills_missing: string[];
    things_to_work_on: string[];
    explanation: string;
    recommendation: {
        label:
            | 'apply'
            | 'apply_but_be_aware'
            | 'apply_with_caution'
            | 'apply_if_optimistic'
            | 'do_not_apply'
            | string;
        message: string;
    };
};

export async function matchJob({
    jobDescription,
    token,
}: {
    jobDescription: string;
    token: string;
}): Promise<MatchResult> {
    const response = await fetch(`${BASE_URL}/matching`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
            data?.error ?? `Request failed with status ${response.status}`,
        );
    }

    return (await response.json()) as MatchResult;
}
