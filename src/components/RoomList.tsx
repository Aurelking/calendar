import React from 'react';
interface Room {
    id: string;
    name: string;
}

interface RoomListProps {
    rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Salles disponibles</h2>
            {rooms.length > 0 ? (
                <ul className="space-y-2">
                    {rooms.map((room, index) => (
                        <li key={index} className="p-2 bg-white rounded shadow">{room.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucune salle disponible pour ce créneau.</p>
            )}
        </div>
    );
};

export default RoomList;