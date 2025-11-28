import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <p>Hello world</p>
            <h1>Jobio project</h1>
            <div className="card">
                <button onClick={handleClick}>Fetch From Backend</button>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

function handleClick() {
    customFetch().then((result) => {
        console.log(result);
    });
}

async function customFetch() {
    const data = await fetch('/api');
    const text = data.text();
    return text;
}

export default App;
