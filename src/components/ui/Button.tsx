import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
}

export function Button({
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps) {
    const base =
        'inline-flex items-center justify-center rounded-lg font-medium transition px-4 py-2 cursor-pointer';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',

        // Outline style EXACTLY as you wanted + pointer included already
        outline:
            'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white',

        ghost: 'text-gray-700 hover:text-indigo-600',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
