import { MascotImages } from '../assets/mascotImages';

export default function Home() {
    return (
        <div className="flex flex-col items-center text-center mt-16 px-4">
            <h1 className="text-4xl font-bold text-slate-600 mb-4">
                Welcome to Jobio!
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
                Your AI-powered job matching assistant. Upload your CV, paste in
                job ads, and get personalised match insights from our mascot Jobbie.
            </p>

            <div className="">
                <img src={MascotImages.idle} width={300}
                 alt="Waving Jobbie" />
            </div>
        </div>
    );
}
