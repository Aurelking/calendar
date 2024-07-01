import React from 'react';

interface WeekViewProps {
    currentDate: Date;
    currentWeek: number;
    onDateClick: (date: Date) => void;
    onTimeSlotClick: (date: Date, timeSlot: string) => void;
    getAvailabilityForDate: (date: Date) => number;
    getAvailableRooms: (date: Date, timeSlot: string | null) => Room[];
}

interface Room {
    id: string;
    name: string;
}

const WeekView: React.FC<WeekViewProps> = ({
                                               currentDate,
                                               currentWeek,
                                               onDateClick,
                                               onTimeSlotClick,
                                               getAvailabilityForDate,
                                               getAvailableRooms
                                           }) => {
    const getWeekDays = (date: Date, weekNumber: number) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDay = new Date(firstDayOfMonth);
        startDay.setDate(1 - firstDayOfMonth.getDay() + weekNumber * 7);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDay);
            day.setDate(startDay.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const weekDays = getWeekDays(currentDate, currentWeek);
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const getAvailabilityColor = (availableRooms: number) => {
        if (availableRooms === 0) return 'bg-red-200';
        if (availableRooms < 2) return 'bg-yellow-200';
        return 'bg-green-200';
    };

    return (
        <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1 min-w-max">
                <div className="border p-2">
                    <div className="font-bold text-sm">Heure</div>
                </div>
                {weekDays.map((day, index) => (
                    <div key={index} className="border p-2">
                        <div className="font-bold text-sm">{day.toLocaleDateString('default', { weekday: 'short' })}</div>
                        <div
                            onClick={() => onDateClick(day)}
                            className="text-center p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {day.getDate()}
                        </div>
                        <div className="text-xs text-green-600">
                            {getAvailabilityForDate(day)} disponibles
                        </div>
                    </div>
                ))}
                {timeSlots.map((slot, slotIndex) => (
                    <React.Fragment key={slotIndex}>
                        <div className="border p-2 text-sm">{slot}</div>
                        {weekDays.map((day, dayIndex) => {
                            const availableRooms = getAvailableRooms(day, slot);
                            return (
                                <div
                                    key={`${slotIndex}-${dayIndex}`}
                                    className={`border p-2 ${getAvailabilityColor(availableRooms.length)} cursor-pointer hover:opacity-75`}
                                    title={`Salles disponibles: ${availableRooms.map(room => room.name).join(', ')}`}
                                    onClick={() => onTimeSlotClick(day, slot)}
                                >
                                    <div className="text-xs font-semibold">{availableRooms.length} disponible{availableRooms.length > 1 ? 's' : ''}</div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default WeekView;