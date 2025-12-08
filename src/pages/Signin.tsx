import { useState } from 'react';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newUser, setNewUser] = useState(false);

    return (
        <div className="flex flex-col items-center mt-10 px-4">
            <h1 className="text-3xl font-bold text-indigo-600 mb-6">
                {newUser ? 'Create Account' : 'Sign In'}
            </h1>

            <div className="w-full max-w-sm space-y-4">
                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />

                {/* Password */}
                <PwInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Repeat password (only for sign-up) */}
                {newUser && (
                    <PwInput
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                )}

                {/* Submit button */}
                <button
                    onClick={() => {
                        if (!validateEmail(email)) {
                            console.log('invalid email input');
                            return;
                        }
                        if (!newUser) {
                            if (password.length < 1) {
                                console.log('missing pw input');
                                return;
                            }
                            handleSignin(email, password);
                            setEmail('');
                            setPassword('');
                            return;
                        }
                        if (
                            password.length < 6 ||
                            password !== repeatPassword
                        ) {
                            console.log('password problem');
                            return;
                        }
                        handleSignUp(email, password);
                        setEmail('');
                        setPassword('');
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                    {newUser ? 'Create Account' : 'Sign In'}
                </button>

                {/* Toggle between sign in / sign up */}
                <button
                    onClick={() => setNewUser(!newUser)}
                    className="w-full text-indigo-600 hover:underline text-sm mt-2"
                >
                    {newUser
                        ? 'Have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
}

function handleSignin(email: string, password: string) {
    console.log('sign in:', email, password);
}

function handleSignUp(email: string, password: string) {
    console.log('sign up:', email, password);
}

function validateEmail(email: string) {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return regex.test(email);
}

type PwInputProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function PwInput({ placeholder, value, onChange }: PwInputProps) {
    return (
        <input
            type="password"
            placeholder={placeholder || 'Password'}
            value={value}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
    );
}
