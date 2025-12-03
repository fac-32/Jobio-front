import { useState } from 'react';
import '../App.css';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <h1>Sign in Page</h1>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button
                    onClick={() => {
                        if (!validateEmail(email) || password.length < 0) {
                            console.log('something is wrong with input');
                            return;
                        }
                        // console.log('input all good');
                        handleSignin(email, password);
                        setEmail('');
                        setPassword('');
                    }}
                >
                    Sign In
                </button>
            </div>
        </>
    );
}

function handleSignin(email: string, password: string) {
    console.log('email: ', email, 'password: ', password);
}

function validateEmail(email: string) {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    // regex.test() returns truw if it MATCHES
    return regex.test(email);
}
