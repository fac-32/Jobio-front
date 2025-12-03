import { useState } from 'react';
import '../App.css';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState(false);

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
                        if (!validateEmail(email)) {
                            console.log('something is wrong with input');
                            return;
                        }
                        if (!newUser) {
                            if (password.length < 0) {
                                console.log('something is wrong with input');
                                return;
                            }
                            handleSignin(email, password);
                            // console.log('input all good');
                            setEmail('');
                            setPassword('');
                            return;
                        }
                        if (password.length < 6) {
                            console.log('passwrd too short');
                            return;
                        }
                        handleSignUp(email, password);
                        // console.log('input all good');
                        setEmail('');
                        setPassword('');
                        return;
                    }}
                >
                    {newUser ? 'Sign Up' : 'Sign In'}
                </button>
            </div>
            <div>
                <button
                    onClick={() => {
                        setNewUser(!newUser);
                    }}
                >
                    {newUser
                        ? 'Have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                </button>
            </div>
        </>
    );
}

function handleSignin(email: string, password: string) {
    console.log('sign in: email: ', email, 'password: ', password);
}

function handleSignUp(email: string, password: string) {
    console.log('sign up; email: ', email, 'password: ', password);
}

function validateEmail(email: string) {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    // regex.test() returns truw if it MATCHES
    return regex.test(email);
}
