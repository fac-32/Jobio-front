import '../App.css';

function Home() {
    return (
        <>
            <h1>Jobio project - placehold Home page</h1>
            <div className="card">
                <button onClick={handleClick}>Fetch From Backend</button>
            </div>
        </>
    );
}

function handleClick() {
    customFetch().then((result) => {
        console.log(result);
    });
}

async function customFetch() {
    // const data = await fetch('/api');
    const data = await fetch('http://localhost:3000/api');
    const text = data.text();
    return text;
}

export default Home;
