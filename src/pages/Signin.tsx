import { useState } from 'react';
import { api } from '../lib/api';
import { MascotImages } from '../assets/mascotImages';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const isFormValid = newUser
        ? validateEmail(email) &&
          name.trim().length >= 2 &&
          password.length > 0 &&
          repeatPassword.length > 0
        : validateEmail(email) && password.length > 0;

    if (signupSuccess) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 px-4">
                <h1 className="text-2xl font-bold text-indigo-600 mb-4">
                    Check your email 📬
                </h1>
                <p className="text-slate-600 text-center max-w-sm">
                    We’ve sent you a confirmation link. Please check your inbox
                    to verify your account before signing in.
                </p>
            </div>
        );
    }

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
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                        setError(null);
                    }}
                    className={`w-full rounded-lg px-4 py-2 outline-none border
        ${
            emailError
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
        }
    `}
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

                {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <button
                    disabled={loading || !isFormValid}
                    onClick={() => {
                        if (loading || !isFormValid) return;

                        if (!newUser) {
                            handleSignin(email, password);
                            return;
                        }

                        if (password.length < 6) {
                            setError(
                                'Password must be at least 6 characters long.',
                            );
                            return;
                        }

                        if (password !== repeatPassword) {
                            setError('Passwords do not match.');
                            return;
                        }

                        handleSignUp(
                            name,
                            email,
                            password,
                            setError,
                            setLoading,
                            setEmailError,
                            setSignupSuccess,
                            setNewUser,
                        );
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition text-white
        ${
            loading || !isFormValid
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
        }
    `}
                >
                    {loading
                        ? 'Please wait...'
                        : newUser
                          ? 'Create Account'
                          : 'Sign In'}
                </button>

                <button
                    onClick={() => setNewUser(!newUser)}
                    className="w-full text-indigo-600 hover:underline cursor-pointer text-sm mt-2"
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

async function handleSignUp(
    name: string,
    email: string,
    password: string,
    setError: (msg: string) => void,
    setLoading: (v: boolean) => void,
    setEmailError: (v: boolean) => void,
    setSignupSuccess: (v: boolean) => void,
    setNewUser: (v: boolean) => void,
) {
    try {
        setLoading(true);
        setError(null);

        await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        setSignupSuccess(true);
        setNewUser(false);
        console.log('Sign up successful');
    } catch (err: any) {
        if (err.status === 409) {
            setError(
                'This email is already registered. Please sign in instead.',
            );
            setEmailError(true);
            return;
        }

        setError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
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
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                type={visible ? 'text' : 'password'}
                placeholder={placeholder || 'Password'}
                value={value}
                onChange={onChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                aria-label={visible ? 'Hide password' : 'Show password'}
            >
                {visible ? (
                    <EyeOff className="cursor-pointer" size={18} />
                ) : (
                    <Eye className="cursor-pointer" size={18} />
                )}
            </button>
        </div>
    );
}
