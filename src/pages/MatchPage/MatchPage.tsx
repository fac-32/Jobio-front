// src/pages/MatchPage/MatchPage.tsx
import JobAdPanel from './JobAdPanel';
import MatchResultPanel from './MatchResultPanel';

const mockJobAd = {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    description: `
We are looking for a Frontend Developer skilled in React, TypeScript, and modern UI frameworks.

Responsibilities:
• Build responsive UI
• Collaborate with designers
• Improve frontend performance

Required:
• React experience
• REST API knowledge

Nice to have:
• Tailwind CSS
• CI/CD experience
`,
};

export default function MatchPage() {
    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-white">
                <JobAdPanel jobAd={mockJobAd} />
            </div>

            <div className="w-1/2 bg-gray-50">
                <MatchResultPanel />
            </div>
        </div>
    );
}
