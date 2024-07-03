'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';


interface Reservation {
    id: string;
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    color: string; // Ajoutez une propriété couleur à chaque réservation
}
interface ScheduleProps {
    reservations: Reservation[];
    startDate: Date;
    endDate: Date;
}

type CalendarView = 'month' | 'week' | 'day';

const Schedule: React.FC<ScheduleProps> = ({ reservations, startDate, endDate }) => {
    const [currentDate, setCurrentDate] = useState(startDate);
    const [view, setView] = useState<CalendarView>('week');

    const navigateDate = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            switch (view) {
                case 'month':
                    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                    break;
                case 'week':
                    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                    break;
                case 'day':
                    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                    break;
            }
            return newDate < startDate ? startDate : newDate > endDate ? endDate : newDate;
        });
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        setView('day');
    };

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
                    <button onClick={() => navigateDate('prev')} className="mr-2 px-3 py-1 rounded">&lt;</button>
                    {currentDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                    <button onClick={() => navigateDate('next')} className="ml-2 px-3 py-1 rounded">&gt;</button>
                </div>
            </div>
            <div className="flex-grow p-4">
                {view === 'month' &&
                    <MonthView currentDate={currentDate} reservations={reservations} onDateClick={handleDateClick}/>}
                {view === 'week' &&
                    <WeekView currentDate={currentDate} reservations={reservations} onDateClick={handleDateClick}/>}
                {view === 'day' && <DayView currentDate={currentDate} reservations={reservations}/>}
            </div>
        </div>
    );
};

export default Schedule;