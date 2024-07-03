import React from 'react';
import Schedule from '../components/schedule';


const Home: React.FC = () => {
    const reservations = [
        {
            id: '1',
            title: 'Réunion A',
            startDateTime: new Date(2024, 0, 1, 10, 0),
            endDateTime: new Date(2024, 0, 1, 12, 0),
            color: '#4299e1' // bleu
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <Schedule
                reservations={reservations}
                startDate={new Date(2024, 0, 1)}  // 1er janvier 2024
                endDate={new Date(2024, 11, 31)} // 31 décembre 2024
            />
        </div>
    );
};

export default Home;