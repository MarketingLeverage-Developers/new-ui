'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, DatesSetArg, EventDropArg, EventContentArg } from '@fullcalendar/core';

import { useMLCalendar, type CalendarEvent, type CalendarView } from '@/shared/headless/MLCalendar/MLCalendar';

import CalendarEventItem from '../CalendarEnvetItem/CalendarEnvetItem';
import CalendarDayHeader from '../CalendarDayHeader/CalendarDayHeader';
import type { FilterId } from '../CalendarSidebar/CalendarSidebar';

import styles from '../../ScheduleCalendar.module.scss';

type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: string;
    badge?: string;
};

type ScheduleCalendarCalendarProps = {
    selected: FilterId[];
    onRequestCreate?: (draft: Draft) => void;
    renderEventItem?: (arg: EventContentArg) => React.ReactNode;
    calendarProps?: Partial<React.ComponentProps<typeof FullCalendar>>;
};

const getEventCategory = (e: CalendarEvent) => String(e.extendedProps?.category ?? '');

const normalizeDay = (d: Date) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const ScheduleCalendarCalendar = ({
    selected,
    onRequestCreate,
    renderEventItem,
    calendarProps,
}: ScheduleCalendarCalendarProps) => {
    const ctx = useMLCalendar();
    const calRef = useRef<FullCalendar | null>(null);

    const [draftEvent, setDraftEvent] = useState<any | null>(null);

    const filteredEvents = useMemo(() => {
        if (selected.length === 0) return ctx.events;
        const selectedSet = new Set(selected);
        return ctx.events.filter((e) => selectedSet.has(getEventCategory(e) as FilterId));
    }, [ctx.events, selected]);

    /**
     * 🔥 핵심: ctx -> FullCalendar 동기화는 "진짜 다를 때만" 수행
     * - changeView는 view 다를 때만
     * - gotoDate는 day-level로 다를 때만
     */
    useEffect(() => {
        const api = calRef.current?.getApi();
        if (!api) return;

        if (api.view.type !== ctx.view) {
            api.changeView(ctx.view);
        }

        const apiDate = normalizeDay(api.getDate()); // FullCalendar 현재 기준 날짜
        const ctxDate = normalizeDay(ctx.currentDate);

        if (!isSameDay(apiDate, ctxDate)) {
            api.gotoDate(ctxDate);
        }
    }, [ctx.view, ctx.currentDate]);

    /**
     * 🔥 핵심: FullCalendar -> ctx 업데이트도 "진짜 다를 때만" 수행
     * datesSet은 changeView/gotoDate에도 발화하므로 반드시 가드 필요
     */
    const handleDatesSet = useCallback(
        (arg: DatesSetArg) => {
            const v = arg.view.type as CalendarView;
            const nextDate = normalizeDay(arg.view.currentStart);

            if (ctx.view !== v) ctx.setView(v);

            const cur = normalizeDay(ctx.currentDate);
            if (!isSameDay(cur, nextDate)) ctx.setCurrentDate(nextDate);
        },
        [ctx]
    );

    const handleSelectAllow = (info: { start: Date; end: Date; allDay?: boolean }) => {
        setDraftEvent({
            id: 'draft',
            title: '(제목 없음)',
            start: info.start,
            end: info.end,
            allDay: !!info.allDay,
            editable: false,
            display: 'auto',
            extendedProps: { category: 'default', isDraft: true },
        });
        return true;
    };

    const emitCreateRequest = (next: Draft) => {
        onRequestCreate?.(next);
    };

    const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
        const isTimeView = ctx.view !== 'dayGridMonth';
        const startDate = new Date(arg.date);
        const endDate = isTimeView ? new Date(startDate.getTime() + 60 * 60 * 1000) : undefined;

        emitCreateRequest({
            title: '',
            allDay: !isTimeView || arg.allDay,
            startDate,
            endDate,
            category: selected[0] ?? 'default',
        });
    };

    const handleSelect = (info: DateSelectArg) => {
        const isTimeView = ctx.view !== 'dayGridMonth';

        emitCreateRequest({
            title: '',
            allDay: info.allDay || !isTimeView,
            startDate: info.start,
            endDate: info.end ?? undefined,
            category: selected[0] ?? 'default',
        });
    };

    const handleUnselect = () => setDraftEvent(null);

    const handleEventDrop = (arg: EventDropArg) => {
        ctx.updateEvent(arg.event.id, {
            start: arg.event.start ?? undefined,
            end: arg.event.end ?? undefined,
        });
    };

    return (
        <div className={styles.fcViewAnim}>
            <FullCalendar
                ref={(r) => {
                    calRef.current = r;
                }}
                fixedWeekCount={false}
                initialView={ctx.view}
                initialDate={ctx.currentDate}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={false}
                dateClick={handleDateClick}
                datesSet={handleDatesSet}
                dayCellContent={(arg) => ({ html: String(arg.date.getDate()) })}
                selectable
                selectMirror={false}
                select={handleSelect}
                selectAllow={handleSelectAllow}
                unselect={handleUnselect}
                editable
                events={[...filteredEvents, ...(draftEvent ? [draftEvent] : [])]}
                eventClassNames={(arg) => {
                    const cat = arg.event.extendedProps?.category as string | undefined;
                    const group = cat?.split('_')[0];
                    return group ? [`cat-${group}`] : [];
                }}
                eventDrop={handleEventDrop}
                eventContent={(arg) => (renderEventItem ? renderEventItem(arg) : <CalendarEventItem arg={arg} />)}
                dayMaxEvents={3}
                dayPopoverFormat={{
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                }}
                moreLinkContent={(arg) => ({ html: `${arg.num}개 더보기` })}
                locale="ko"
                height="auto"
                dayHeaderContent={(arg) => <CalendarDayHeader arg={arg} />}
                dayHeaderClassNames={() => ['fc-my-header']}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: undefined,
                    meridiem: 'short',
                    hour12: true,
                }}
                {...calendarProps}
            />
        </div>
    );
};

export default ScheduleCalendarCalendar;
