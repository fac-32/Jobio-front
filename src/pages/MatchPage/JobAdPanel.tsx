// import { useState } from 'react';
// import { Button } from '../../components/ui/Button';

// interface JobAd {
//     title: string;
//     company: string;
//     location: string;
//     description: string;
// }

// export default function JobAdPanel({ jobAd }: { jobAd: JobAd }) {
//     const MAX_SIZE_MB = 5;
//     const [fileName, setFileName] = useState<string | null>(null);
//     const [dealBreakers, setDealBreakers] = useState<string[]>([]);
//     const [inputValue, setInputValue] = useState('');

//     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         if (file.size > MAX_SIZE_MB * 1024 * 1024) {
//             alert(`File must be < ${MAX_SIZE_MB}MB`);
//             return;
//         }

//         if (
//             ![
//                 'application/pdf',
//                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//             ].includes(file.type)
//         ) {
//             alert('Only PDF or DOCX allowed');
//             return;
//         }

//         setFileName(file.name);
//         console.log('CV uploaded:', file);
//     };

//     const addDealBreaker = () => {
//         if (!inputValue.trim()) return;
//         setDealBreakers((prev) => [...prev, inputValue.trim()]);
//         setInputValue('');
//     };

//     const removeDealBreaker = (text: string) => {
//         setDealBreakers((prev) => prev.filter((item) => item !== text));
//     };

//     const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') addDealBreaker();
//     };

//     return (
//         <div className="h-full overflow-y-auto p-4 border-r border-gray-200 space-y-6">
//             {/* Upload CV */}
//             <div>
//                 <label className="block font-medium mb-2">Upload your CV</label>
//                 <input
//                     type="file"
//                     accept=".pdf,.docx"
//                     onChange={handleFileUpload}
//                     className="block text-sm text-gray-700"
//                 />
//                 {fileName && (
//                     <p className="text-xs text-green-600 mt-1">
//                         Uploaded: {fileName}
//                     </p>
//                 )}
//             </div>

//             {/* Deal-breakers UI */}
//             <div>
//                 <label className="block font-medium mb-2">Deal Breakers</label>
//                 <div className="flex items-center space-x-2">
//                     <input
//                         type="text"
//                         placeholder="Add a required skill..."
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         onKeyDown={handleEnterKey}
//                         className="border p-2 rounded text-sm flex-1"
//                     />
//                     <button
//                         onClick={addDealBreaker}
//                         className="px-3 py-2 bg-gray-800 text-white text-sm rounded hover:bg-black"
//                     >
//                         Add
//                     </button>
//                 </div>

//                 {/* Tag list */}
//                 <div className="flex flex-wrap gap-2 mt-3">
//                     {dealBreakers.map((db, index) => (
//                         <span
//                             key={index}
//                             className="flex items-center bg-red-100 text-red-700 px-2 py-1 text-xs rounded"
//                         >
//                             {db}
//                             <button
//                                 onClick={() => removeDealBreaker(db)}
//                                 className="ml-2 text-red-600 hover:text-red-800 font-bold"
//                             >
//                                 ×
//                             </button>
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Job Ad text */}
//             {/* Job Ad text */}
//             <div>
//                 <h2 className="text-xl font-semibold">{jobAd.title}</h2>
//                 <p className="text-sm text-gray-600 mb-1">{jobAd.company}</p>
//                 <p className="text-xs text-gray-500 mb-4">{jobAd.location}</p>

//                 <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
//                     {jobAd.description}
//                 </pre>
//             </div>

//             <Button variant="primary" className="mt-6">
//                 Match Me
//             </Button>
//         </div>
//     );
// }



// src/pages/MatchPage/JobAdPanel.tsx
type Props = {
  jobDescription: string;
  onChange: (value: string) => void;
  onMatchClick: () => void;
  loading: boolean;
};

export function JobAdPanel({ jobDescription, onChange, onMatchClick, loading }: Props) {
  return (
    <div>
      <h2>Job ad</h2>
      <textarea
        style={{ width: '100%', minHeight: '260px', marginBottom: '1rem' }}
        value={jobDescription}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste the job description here…"
      />
      <button
        onClick={onMatchClick}
        disabled={loading}
        style={{
          padding: '0.6rem 1.4rem',
          borderRadius: 999,
          border: 'none',
          backgroundColor: '#6d28d9',
          color: 'white',
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Matching…' : 'Match Me'}
      </button>
    </div>
  );
}
