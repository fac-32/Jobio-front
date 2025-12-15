// export async function matchJob({
//     jobDescription,
//     token,
// }: {
//     jobDescription: string;
//     token: string;
// }): Promise<MatchResult> {
//     return api('/matching', {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ jobDescription }),
//     });
// }

import { api } from '../../lib/api';
import type { MatchResult } from './types';

export async function matchJob({
    jobDescription,
    token,
}: {
    jobDescription: string;
    token: string;
}): Promise<MatchResult> {
    return api('/matching', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription }),
    });
}
