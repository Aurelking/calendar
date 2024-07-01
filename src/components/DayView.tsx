import React from 'react';

interface DayViewProps {
    currentDate: Date;
    onTimeSlotClick: (timeSlot: string) => void;
    getAvailableRooms: (date: Date, timeSlot: string | null) => Room[];
}

interface Room {
    id: string;
    name: string;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, onTimeSlotClick, getAvailableRooms }) => {
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const getAvailabilityColor = (availableRooms: number) => {
        if (availableRooms === 0) return 'bg-red-200 hover:bg-red-300';
        if (availableRooms < 2) return 'bg-yellow-200 hover:bg-yellow-300';
        return 'bg-green-200 hover:bg-green-300';
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <div className="space-y-2">
                {timeSlots.map(slot => {
                    const availableRooms = getAvailableRooms(currentDate, slot);
                    return (
                        <button
                            key={slot}
                            onClick={() => onTimeSlotClick(slot)}
                            className={`w-full p-2 text-left border rounded ${getAvailabilityColor(availableRooms.length)} transition duration-150 ease-in-out`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{slot}</span>
                                <span className="text-sm">
                                    {availableRooms.length} salle{availableRooms.length > 1 ? 's' : ''} disponible{availableRooms.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="text-xs mt-1">
                                {availableRooms.map(room => room.name).join(', ')}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;