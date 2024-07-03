import React from 'react';

interface Reservation {
    id: string;
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    color: string; // Ajoutez une propriété couleur à chaque réservation
}

interface WeekViewProps {
    currentDate: Date;
    reservations: Reservation[];
    onDateClick: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, reservations, onDateClick }) => {
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getReservationsForDay = (date: Date) => {
        return reservations.filter(reservation =>
            reservation.startDateTime.getDate() === date.getDate() &&
            reservation.startDateTime.getMonth() === date.getMonth() &&
            reservation.startDateTime.getFullYear() === date.getFullYear()
        );
    };

    const getReservationStyle = (reservation: Reservation) => {
        const startHour = reservation.startDateTime.getHours();
        const startMinute = reservation.startDateTime.getMinutes();
        const endHour = reservation.endDateTime.getHours();
        const endMinute = reservation.endDateTime.getMinutes();

        const top = (startHour + startMinute / 60 ) * 60 + 20; // 60px par heure (20px de marge)
        const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;

        return {
            top: `${top}px`,
            height: `${height}px`,
            backgroundColor: reservation.color,
            zIndex: 1
        };
    };

    return (
        <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-0.5">
                <div className="border p-2">
                    <div className="font-bold">Heure</div>
                </div>
                {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex}
                         className="border p-2 cursor-pointer"
                         onClick={() => onDateClick(day)}>
                        <div className="font-bold">{day.toLocaleDateString('default', { weekday: 'short' })}</div>
                        <div>{day.getDate()}</div>
                    </div>
                ))}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div className="border-r border-b p-2">{`${hour.toString().padStart(2, '0')}:00`}</div>
                        {weekDays.map((day, dayIndex) => (
                            <div key={`${hour}-${dayIndex}`} className="border-r border-b relative" style={{height: '60px'}}>
                                {hour === 0 && getReservationsForDay(day).map((reservation, index) => (
                                    <div
                                        key={reservation.id}
                                        className="opacity-100 absolute left-0 right-0 p-1 text-xs text-white overflow-hidden z-offset"
                                        style={getReservationStyle(reservation)}
                                        title={`${reservation.title}\n${reservation.startDateTime.toLocaleTimeString()} - ${reservation.endDateTime.toLocaleTimeString()}`}
                                    >
                                        {reservation.title}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default WeekView;
