import { useState } from 'react';
import { api } from '../lib/api';
import { MascotImages } from '../assets/mascotImages';

export default function SignIn() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newUser, setNewUser] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center mt-10 px-4">
            <h1 className="text-3xl font-bold text-indigo-600 mb-6">
                {newUser ? 'Create Account' : 'Sign In'}
            </h1>

            <div className="w-full max-w-sm space-y-4">
                {newUser && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />

                <PwInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {newUser && (
                    <PwInput
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                )}

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
                            return;
                        }

                        if (name.trim().length < 2) {
                            console.log('Name too short');
                            return;
                        }

                        if (
                            password.length < 6 ||
                            password !== repeatPassword
                        ) {
                            console.log('password problem');
                            return;
                        }

                        handleSignUp(name, email, password);
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                    {newUser ? 'Create Account' : 'Sign In'}
                </button>

                <button
                    onClick={() => setNewUser(!newUser)}
                    className="w-full text-indigo-600 hover:underline text-sm mt-2"
                >
                    {newUser
                        ? 'Have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                </button>

                <div className="flex justify-center">
                    <img
                        src={MascotImages.curious}
                        width={300}
                        alt="Curious Jobbie"
                    />
                </div>
            </div>
        </div>
    );
}

async function handleSignin(email: string, password: string) {
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        const token = data.session?.access_token;
        if (!token) throw new Error('No token returned');

        // Save token in local storage
        localStorage.setItem('token', token);

        // Get user with matching email
        const usersData = await api(`/users?email=${email}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (usersData.length === 0) {
            console.log('No user found with matching email');
            return;
        }

        // Save user id in local storage
        localStorage.setItem('user_id', usersData[0].id);

        // Save username (either metadata.name or fallback: email prefix)
        const username =
            data.user?.user_metadata?.name || data.user?.email?.split('@')[0];

        localStorage.setItem('user_name', username);

        console.log('Signed in successfully:', data);

        // Redirect
        window.location.href = '/match';
    } catch (err) {
        console.error('Login failed:', err);
    }
}

async function handleSignUp(name: string, email: string, password: string) {
    try {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        console.log('Sign up successful:', data);

        // ⚠ Important: Supabase does NOT return a session until email is verified
    } catch (err) {
        console.error('Signup failed:', err);
    }
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
