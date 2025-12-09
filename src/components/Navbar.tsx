import { NavLink } from 'react-router-dom';
import { Button } from './ui/Button';

export default function Navbar() {
    return (
        <header
            className="
  bg-white shadow-md rounded-4xl mx-6 my-4
  border-[3px] border-indigo-700
  ring-[3px] ring-indigo-400
"
        >
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <NavLink
                    to="/"
                    className="text-xl font-bold text-indigo-600 tracking-wide"
                >
                    Jobio
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

                    <NavLink to="/sign-in">
                        <Button variant="outline">Sign In</Button>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
