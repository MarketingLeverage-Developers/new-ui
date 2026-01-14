import type { DayHeaderContentArg } from '@fullcalendar/core/index.js';

type CalendarDayHeaderProps = {
    arg: DayHeaderContentArg;
};

type WeekAndDailyHeaderProps = {
    date: Date;
    day: number;
    arg: DayHeaderContentArg;
    yoil: string;
};

const WeekAndDailyHeader = ({ date, day, arg, yoil }: WeekAndDailyHeaderProps) => (
    <>
        <span className={`yoil ${date.getDay() === 0 ? 'sun' : date.getDay() === 6 ? 'sat' : ''}`}>{yoil}</span>
        <span
            className={`date ${arg.isToday ? 'today' : ''} ${
                date.getDay() === 0 ? 'sun' : date.getDay() === 6 ? 'sat' : ''
            }`}
        >
            {day}
        </span>
    </>
);

export const CalendarDayHeader = ({ arg }: CalendarDayHeaderProps) => {
    const d = arg.date;
    const yoil = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    const day = d.getDate();

    if (arg.view.type === 'dayGridMonth') {
        return (
            <span className={`fc-my-header-month ${d.getDay() === 0 ? 'sun' : d.getDay() === 6 ? 'sat' : ''}`}>
                {yoil}
            </span>
        );
    }

    if (arg.view.type === 'timeGridWeek') {
        return (
            <div className="fc-my-header-week">
                <WeekAndDailyHeader date={d} day={day} arg={arg} yoil={yoil} />
            </div>
        );
    }

    if (arg.view.type === 'timeGridDay') {
        return (
            <div className="fc-my-header-day">
                <WeekAndDailyHeader date={d} day={day} arg={arg} yoil={yoil} />
            </div>
        );
    }

    return arg.text;
};

export default CalendarDayHeader;
