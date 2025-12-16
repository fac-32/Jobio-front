import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
}
