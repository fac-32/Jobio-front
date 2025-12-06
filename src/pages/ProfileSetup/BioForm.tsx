import type { UserBio } from '../../types/user';

interface BioFormProps {
    bio: UserBio;
    setBio: (bio: UserBio) => void;
}

export default function BioForm({ bio, setBio }: BioFormProps) {
    return (
        <div className="space-y-2">
            <label className="block font-medium">Headline</label>
            <input
                type="text"
                value={bio.headline}
                onChange={(e) => setBio({ ...bio, headline: e.target.value })}
                className="w-full border p-2 rounded"
            />
            <label className="block font-medium">Description</label>
            <textarea
                value={bio.description}
                onChange={(e) =>
                    setBio({ ...bio, description: e.target.value })
                }
                className="w-full border p-2 rounded"
            />
        </div>
    );
}
