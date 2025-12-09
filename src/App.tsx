// this works as an equivalent to laoyout
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// this is lazy import,
// it lets you defer loading component's code until it is rendered for the first time
// when creating a new page
// 1. do lazy import as follow
// 2. add a nav link - in components/Navbar.tsx
// 3. add a Route inside the Routes block, make sure the path matches with Link

const Home = lazy(() => import('./pages/home'));
const BioPage = lazy(() => import('./pages/BioPage'));
const MatchPage = lazy(() => import('./pages/MatchPage/MatchPage'));
const SignIn = lazy(() => import('./pages/Signin'));

export default function App() {
    return (
        <>
            <Suspense fallback={<p>Loading…</p>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/bio" element={<BioPage />} />
                        <Route path="/match" element={<MatchPage />} />
                        <Route path="/sign-in" element={<SignIn />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}
