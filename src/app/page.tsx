import type { NextPage } from 'next';
import Head from 'next/head';
import Calendar from '../components/Calendar';

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col">
            <Head>
                <title>Calendrier de réservation de salles</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex-grow container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Réservation de salles</h1>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <Calendar />
                </div>
            </main>

            <footer className="mt-8 text-center text-gray-500">
                <p>&copy; 2024 Système de réservation de salles</p>
            </footer>
        </div>
    );
};

export default Home;