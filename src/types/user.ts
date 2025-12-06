export interface UserBio {
    headline: string;
    description: string;
}

export type DealBreaker = string;

export interface UserProfile {
    bio: UserBio;
    dealBreakers: DealBreaker[];
    cvFile?: File;
}
