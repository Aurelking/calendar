import React from 'react';

interface Reservation {
    id: string;
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    color: string; // Ajoutez une propriété couleur à chaque réservation
}

interface MonthViewProps {
    currentDate: Date;
    reservations: Reservation[];
    onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, reservations, onDateClick }) => {
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const getReservationsForDate = (date: Date) => {
        return reservations.filter(reservation =>
            reservation.startDateTime.getDate() === date.getDate() &&
            reservation.startDateTime.getMonth() === date.getMonth() &&
            reservation.startDateTime.getFullYear() === date.getFullYear()
        );
    };

    const formatTimeRange = (start: Date, end: Date) => {
        return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    return (
        <div className="grid grid-cols-7 gap-1">
            {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map(day => (
                <div key={day} className="text-center font-bold text-sm py-2">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="text-center p-2"></div>
            ))}
            {days.map((day, index) => {
                const dayReservations = getReservationsForDate(day);
                return (
                    <div key={index} className="border p-2 min-h-[100px] overflow-y-auto">
                        <div className="font-semibold">{day.getDate()}</div>
                        {dayReservations.map(reservation => (
                            <div key={reservation.id}
                                 className="bg-blue-200 text-xs p-1 mt-1 rounded overflow-hidden whitespace-nowrap text-ellipsis"
                                 onClick={() => onDateClick(day)}
                                 title={`${reservation.title}\n${formatTimeRange(reservation.startDateTime, reservation.endDateTime)}`}>
                                {reservation.title}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default MonthView;