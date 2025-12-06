import type { DealBreaker } from '../../types/user';
import { useState } from 'react';

interface DealBreakersFormProps {
    dealBreakers: DealBreaker[];
    setDealBreakers: (dealBreakers: DealBreaker[]) => void;
}

export default function DealBreakersForm({
    dealBreakers,
    setDealBreakers,
}: DealBreakersFormProps) {
    const [input, setInput] = useState('');

    const addDealBreaker = () => {
        if (input.trim()) {
            setDealBreakers([...dealBreakers, input.trim()]);
            setInput('');
        }
    };

    const removeDealBreaker = (index: number) => {
        setDealBreakers(dealBreakers.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <label className="block font-medium">Deal Breakers</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border p-2 rounded"
                />
                <button
                    onClick={addDealBreaker}
                    className="bg-green-500 text-white px-3 rounded"
                >
                    Add
                </button>
            </div>
            <ul className="flex flex-wrap gap-2 mt-2">
                {dealBreakers.map((item, idx) => (
                    <li
                        key={idx}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                    >
                        {item}
                        <button
                            onClick={() => removeDealBreaker(idx)}
                            className="text-red-500 font-bold"
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
