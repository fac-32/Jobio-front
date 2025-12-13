// // src/pages/MatchPage/MatchPage.tsx
// import JobAdPanel from './JobAdPanel';
// import MatchResultPanel from './MatchResultPanel';

// const mockJobAd = {
//     title: 'Frontend Developer',
//     company: 'TechCorp',
//     location: 'Remote',
//     description: `
// We are looking for a Frontend Developer skilled in React, TypeScript, and modern UI frameworks.

// Responsibilities:
// • Build responsive UI
// • Collaborate with designers
// • Improve frontend performance

// Required:
// • React experience
// • REST API knowledge

// Nice to have:
// • Tailwind CSS
// • CI/CD experience
// `,
// };

// export default function MatchPage() {
//     return (
//         <div className="flex h-screen">
//             <div className="w-1/2 bg-white">
//                 <JobAdPanel jobAd={mockJobAd} />
//             </div>

//             <div className="w-1/2 bg-gray-50">
//                 <MatchResultPanel />
//             </div>
//         </div>
//     );
// }


// src/pages/MatchPage/MatchPage.tsx
import { useState } from 'react';
import { matchJob, type MatchResult } from '../../lib/api';
import { JobAdPanel } from './JobAdPanel';
import { MatchResultPanel } from './MatchResultPanel';
// import { UploadCVButton } from './UploadCVButton';
// import { DealBreakersModal } from './DealBreakersModal';
// import './MatchPage.css';

function MatchPage() {
  // React "memory"
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  // Temporary: assume your login stored the token like this
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
    <div className="flex h-screen">
      {/* <main className="match-layout"> */}
        <div className="w-1/2 bg-white p-4 flex flex-col">
          {/* <UploadCVButton /> */}
          {/* <DealBreakersModal /> */}

          <JobAdPanel
            jobDescription={jobDescription}
            onChange={setJobDescription}
            onMatchClick={handleMatch}
            loading={loading}
          />

          {error && <p className="match-error">{error}</p>}
        </div>

        <div className="w-1/2 bg-gray-50 p-4 overflow-auto">
          <MatchResultPanel loading={loading} result={result} />
        </div>
      {/* </main> */}
    </div>
  );
}

export default MatchPage;
