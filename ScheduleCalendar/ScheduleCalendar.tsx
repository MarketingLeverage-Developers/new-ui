import type React from 'react';

import styles from './ScheduleCalendar.module.scss';

import MLCalendarProvider, { type CalendarEvent, type CalendarView } from '@/shared/headless/MLCalendar/MLCalendar';
import CalendarSidebar from '../MLCalendar/MLCalendarSidebar/MLCalendarSidebar';
import CalendarEventItem from './components/CalendarEnvetItem/CalendarEnvetItem';
import CalendarDayHeader from './components/CalendarDayHeader/CalendarDayHeader';
import { CalendarHeader } from './components/CalendarHeader/CalendarHeader';
import { CalendarTemplate } from './components/CalendarTemplate/CalendarTemplate';
import CalendarModal from './components/CalendarModal/CalendarModal';
import ScheduleCalendarCalendar from './components/ScheduleCalendarCalendar/ScheduleCalendarCalendar';

// Types export
type ScheduleCalendarProps = {
    children: React.ReactNode;
    initialView?: CalendarView;
    initialDate?: Date;
    initialEvents?: CalendarEvent[];

    externalEvents?: CalendarEvent[]; // 추가

    onViewChange?: (view: CalendarView) => void;
    onDateChange?: (date: Date) => void;
    onEventSelect?: (event: CalendarEvent | null) => void;
    onEventsChange?: (events: CalendarEvent[]) => void;
};

export const ScheduleCalendar = ({
    children,
    initialView,
    initialDate,
    initialEvents,
    externalEvents,
    onViewChange,
    onDateChange,
    onEventSelect,
    onEventsChange,
}: ScheduleCalendarProps) => (
    <div className={styles.container}>
        <MLCalendarProvider
            initialView={initialView}
            initialDate={initialDate}
            initialEvents={initialEvents}
            externalEvents={externalEvents}
            onViewChange={onViewChange}
            onDateChange={onDateChange}
            onEventSelect={onEventSelect}
            onEventsChange={onEventsChange}
        >
            {children}
        </MLCalendarProvider>
    </div>
);

ScheduleCalendar.Sidebar = CalendarSidebar;
ScheduleCalendar.EventItem = CalendarEventItem;
ScheduleCalendar.DayHeader = CalendarDayHeader;
ScheduleCalendar.CalendarHeader = CalendarHeader;
ScheduleCalendar.CalendarModal = CalendarModal;
ScheduleCalendar.Calendar = ScheduleCalendarCalendar;
ScheduleCalendar.Template = CalendarTemplate;
// ScheduleCalendar.useContext = useScheduleCalendar;

// export { ScheduleCalendarSidebar, ScheduleCalendarEventItem, ScheduleCalendarDayHeader, ScheduleCalendarCalendarHeader, ScheduleCalendarTemplate };

export default ScheduleCalendar;
