// This is the single source of truth for a valid Bio submission
// src/types.ts
export interface BioPayload {
    cv: File; // The CV file to be uploaded
    dealBreakers: string[]; // List of dealbreakers
}
