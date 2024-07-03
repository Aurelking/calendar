import React from 'react';

interface Reservation {
    id: string;
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    color: string; // Ajoutez une propriété couleur à chaque réservation
}

interface DayViewProps {
    currentDate: Date;
    reservations: Reservation[];
}

const DayView: React.FC<DayViewProps> = ({ currentDate, reservations }) => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = Math.floor(i);
        const minute = (i % 1) * 60;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });

    const getReservationsForTimeSlot = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        return reservations.filter(reservation =>
            reservation.startDateTime < slotEnd &&
            reservation.endDateTime > slotStart &&
            reservation.startDateTime.getDate() === currentDate.getDate() &&
            reservation.startDateTime.getMonth() === currentDate.getMonth() &&
            reservation.startDateTime.getFullYear() === currentDate.getFullYear()
        );
    };

    const getTimesSlotStyle = (reservation: Reservation) => {
        const startHour = reservation.startDateTime.getHours();
        const startMinute = reservation.startDateTime.getMinutes();
        const endHour = reservation.endDateTime.getHours();
        const endMinute = reservation.endDateTime.getMinutes();

        const top = (startHour + startMinute / 30 ) * 30 + 10; // 60px par heure (20px de marge)
        const height = ((endHour + endMinute / 30) - (startHour + startMinute / 30)) * 30;

        return {
            top: `${top}px`,
            height: `${height}px`,
            backgroundColor: reservation.color,
            zIndex: 1
        };
    };



    const formatTimeRange = (start: Date, end: Date) => {
        return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <div className="space-y-1">
                {timeSlots.map(slot => {
                    const slotReservations = getReservationsForTimeSlot(slot);
                    return (
                        <div key={slot} className="flex border-b py-1">
                            <div className="w-16 text-xs font-semibold">{slot}</div>
                            <div className="flex-grow">
                                {slotReservations.map(reservation => (
                                    <div key={reservation.id}
                                         className="bg-blue-200 text-xs p-1 mb-1 rounded overflow-hidden whitespace-nowrap text-ellipsis"
                                         style={getTimesSlotStyle(reservation)}
                                         title={`${reservation.title}\n${formatTimeRange(reservation.startDateTime, reservation.endDateTime)}`}>
                                        {reservation.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;