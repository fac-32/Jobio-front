import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import logo from '../assets/logo.png';
import { UserDropdown } from './ui/UserDropdown';
import { useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('token')),
    );

    const [username, setUsername] = useState(
        localStorage.getItem('user_name') ?? '',
    );

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');

        setIsLoggedIn(false);
        setUsername('');
        navigate('/');
    }

    return (
        <div className="sticky bg-gray-50 top-0">
            <header
                className="
                    bg-white shadow-md rounded-4xl top-bar mt-4 mx-6
                    border-[3px] border-indigo-700
                    ring-[3px] ring-indigo-400
                "
            >
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="text-xl font-bold text-indigo-600 tracking-wide"
                    >
                        <img
                            src={logo}
                            alt="Jobio Logo"
                            className="h-10 w-auto"
                        />
                    </NavLink>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/bio"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }
                        >
                            Bio
                        </NavLink>

                        <NavLink
                            to="/match"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }
                        >
                            Match
                        </NavLink>

                        {/* Auth */}
                        {isLoggedIn ? (
                            <UserDropdown
                                username={username}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <NavLink to="/sign-in">
                                <Button variant="outline">Sign In</Button>
                            </NavLink>
                        )}
                    </nav>
                </div>
            </header>
        </div>
    );
}
