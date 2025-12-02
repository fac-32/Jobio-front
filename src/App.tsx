import { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Home = lazy(() => import('./pages/home'));

export default function App() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
            </nav>

            <Suspense fallback={<p>Loading…</p>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Suspense>
        </>
    );
}
