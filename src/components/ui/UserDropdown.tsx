import { useEffect, useRef, useState } from 'react';

export function UserDropdown({
    username,
    onLogout,
}: {
    username: string;
    onLogout: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center space-x-2 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-700 font-medium">{username}</span>
            </button>

            {open && (
                <div className="absolute mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={onLogout}
                        className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
