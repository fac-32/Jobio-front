// this works as an equivalent to laoyout
import { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// this is lazy import,
// it lets you defer loading component's code until it is rendered for the first time
// when creating a new page
// 1. do lazy import as follow
// 2. add a nav link
// 3. add a Route inside the Routes blcok, make sure the path matches with Link

const Home = lazy(() => import('./pages/Home'));
const MatchPage = lazy(() => import('./pages/MatchPage/MatchPage'));
const SignIn = lazy(() => import('./pages/Signin'));

export default function App() {
    return (
        <>
            {/* The <nav> element will exist on every page, since we are only sqapping the Routes below */}
            <nav>
                <Link to="/home">Home</Link>
                <Link to="/sign-in">Sign In</Link>
            </nav>

            <Suspense fallback={<p>Loading…</p>}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/match" element={<MatchPage />} />
                    <Route path="/sign-in" element={<SignIn />} />
                </Routes>
            </Suspense>
        </>
    );
}
