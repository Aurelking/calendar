import React from 'react';

interface MonthViewProps {
    currentDate: Date;
    onDateClick: (date: Date) => void;
    getAvailabilityForDate: (date: Date) => number;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, onDateClick, getAvailabilityForDate }) => {
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const getAvailabilityColor = (availability: number) => {
        if (availability === 0) return 'bg-red-200';
        if (availability < 10) return 'bg-yellow-200';
        return 'bg-green-200';
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
                const availability = getAvailabilityForDate(day);
                return (
                    <div
                        key={index}
                        onClick={() => onDateClick(day)}
                        className={`text-center p-2 cursor-pointer ${getAvailabilityColor(availability)} hover:opacity-75 transition duration-150 ease-in-out`}
                    >
                        <div className="font-semibold">{day.getDate()}</div>
                        <div className="text-xs">
                            {availability} créneau{availability > 1 ? 'x' : ''}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MonthView;