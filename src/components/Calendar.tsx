'use client';
import React, { useState, useEffect } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import RoomList from './RoomList';

interface CalendarProps {}

interface Room {
    id: string;
    name: string;
}

interface Reservation {
    roomId: string;
    date: Date;
    timeSlot: string;
}

type CalendarView = 'month' | 'week' | 'day';

const allRooms: Room[] = [
    { id: '1', name: 'Salle A' },
    { id: '2', name: 'Salle B' },
    { id: '3', name: 'Salle C' },
    { id: '4', name: 'Salle D' },
];

const generateReservations = (): Reservation[] => {
    const reservations: Reservation[] = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        for (let i = 0; i < 5; i++) {
            const roomId = allRooms[Math.floor(Math.random() * allRooms.length)].id;
            const hour = Math.floor(Math.random() * 9) + 9;
            reservations.push({
                roomId,
                date: new Date(year, month, day),
                timeSlot: `${hour.toString().padStart(2, '0')}:00`
            });
        }
    }
    return reservations;
};

const reservations: Reservation[] = generateReservations();

const Calendar: React.FC<CalendarProps> = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [currentWeek, setCurrentWeek] = useState(0); // 0-3 pour les 4 semaines du mois

    const navigateDate = (direction: 'prev' | 'next') => {
        if (view === 'week') {
            setCurrentWeek(prev => {
                if (direction === 'next') {
                    if (prev === 3) {
                        setCurrentDate(prevDate => {
                            const newDate = new Date(prevDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            return newDate;
                        });
                        return 0;
                    }
                    return prev + 1;
                } else {
                    if (prev === 0) {
                        setCurrentDate(prevDate => {
                            const newDate = new Date(prevDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            return newDate;
                        });
                        return 3;
                    }
                    return prev - 1;
                }
            });
        } else {
            setCurrentDate(prevDate => {
                const newDate = new Date(prevDate);
                switch (view) {
                    case 'month':
                        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                        break;
                    case 'day':
                        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                        break;
                }
                return newDate;
            });
        }
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        setView('day');
    };


    const handleTimeSlotClick = (date: Date, timeSlot: string) => {
        setCurrentDate(date);
        setSelectedTimeSlot(timeSlot);
        setView('day');
    };

    const getAvailableRooms = (date: Date, timeSlot: string | null): Room[] => {
        if (!timeSlot) {
            return allRooms;
        }

        const reservedRoomIds = reservations.filter(reservation =>
            reservation.date.toDateString() === date.toDateString() &&
            reservation.timeSlot === timeSlot
        ).map(reservation => reservation.roomId);

        return allRooms.filter(room => !reservedRoomIds.includes(room.id));
    };

    const getAvailabilityForDate = (date: Date): number => {
        const dayReservations = reservations.filter(reservation =>
            reservation.date.toDateString() === date.toDateString()
        );
        return allRooms.length * 9 - dayReservations.length; // 9 créneaux par jour
    };

    useEffect(() => {
        setAvailableRooms(getAvailableRooms(currentDate, selectedTimeSlot));
    }, [currentDate, selectedTimeSlot]);

    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <div>
                    <button onClick={() => setView('month')}
                            className={`mr-2 px-3 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Mois
                    </button>
                    <button onClick={() => setView('week')}
                            className={`mr-2 px-3 py-1 rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Semaine
                    </button>
                    <button onClick={() => setView('day')}
                            className={`px-3 py-1 rounded ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Jour
                    </button>
                </div>


                <div className="text-xl font-bold">
                    <button onClick={() => navigateDate('prev')}
                            className="mr-2 px-3 py-1 rounded">&lt;</button>
                    {currentDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                    <button onClick={() => navigateDate('next')} className="px-3 py-1  rounded">&gt;</button>
                </div>


            </div>
            <div className="flex">
                <div className="w-3/4 p-4">
                    {view === 'month' && <MonthView currentDate={currentDate} onDateClick={handleDateClick}
                                                    getAvailabilityForDate={getAvailabilityForDate}/>}
                    {view === 'week' && (
                        <WeekView
                            currentDate={currentDate}
                            currentWeek={currentWeek}
                            onDateClick={handleDateClick}
                            onTimeSlotClick={handleTimeSlotClick}
                            getAvailabilityForDate={getAvailabilityForDate}
                            getAvailableRooms={getAvailableRooms}
                        />
                    )}
                    {view === 'day' && <DayView currentDate={currentDate}
                                                onTimeSlotClick={(timeSlot) => handleTimeSlotClick(currentDate, timeSlot)}
                                                getAvailableRooms={getAvailableRooms}/>}
                </div>
                <div className="w-1/4 bg-gray-100 p-4">
                    <RoomList rooms={availableRooms}/>
                </div>
            </div>
        </div>
    );
};

export default Calendar;