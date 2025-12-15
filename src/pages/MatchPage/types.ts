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
