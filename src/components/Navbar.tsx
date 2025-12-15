import { NavLink } from 'react-router-dom';
import { Button } from './ui/Button';
import logo from '../assets/logo.png';

const username = localStorage.getItem('user_name');
const isLoggedIn = !!localStorage.getItem('token');

export default function Navbar() {
    return (
        <div className="sticky bg-white top-0">
            <header
                className="
  bg-white shadow-md rounded-4xl top-bar mt-4 mx-6  left-0 right-0 
  border-[3px] border-indigo-700
  ring-[3px] ring-indigo-400
"
            >
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
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

                        {/* BioPage link */}
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

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-slate-700 font-medium">
                                    {username}
                                </span>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user_name');
                                        window.location.href = '/';
                                    }}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Logout
                                </button>
                            </div>
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
