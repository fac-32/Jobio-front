import { Button } from '../components/ui/Button';

export default function Home() {
    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                Welcome to Jobio
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
                Your AI-powered job matching assistant. Upload your CV, analyze
                job ads, and get personalized match insights instantly.
            </p>

            <div className="space-x-4">
                <Button
                    variant="primary"
                    onClick={handleClick}
                    className="px-6 py-3 text-lg"
                >
                    Fetch From Backend
                </Button>
                <Button className="px-6 py-3 bg-sky-500 text-white text-lg hover:bg-sky-600">
                    Learn More
                </Button>
            </div>
        </div>
    );
}

async function handleClick() {
    try {
        const response = await fetch('/api');
        const text = await response.text();
        console.log('Backend says:', text);
    } catch (error) {
        console.error('Error fetching:', error);
    }
}
