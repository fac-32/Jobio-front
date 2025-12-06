import { useState } from 'react';
import BioForm from './BioForm';
import DealBreakersForm from './DealBreakersForm';
import UploadCV from './UploadCV';
import type { UserProfile } from '../../types/user';

export default function ProfileSetup() {
    const [profile, setProfile] = useState<UserProfile>({
        bio: { headline: '', description: '' },
        dealBreakers: [],
        cvFile: undefined,
    });

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Set up your profile</h1>

            <BioForm
                bio={profile.bio}
                setBio={(bio) => setProfile({ ...profile, bio })}
            />
            <DealBreakersForm
                dealBreakers={profile.dealBreakers}
                setDealBreakers={(dealBreakers) =>
                    setProfile({ ...profile, dealBreakers })
                }
            />
            <UploadCV
                cvFile={profile.cvFile}
                setCVFile={(cvFile) => setProfile({ ...profile, cvFile })}
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit
            </button>
        </div>
    );
}
