'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, DatesSetArg, EventDropArg } from '@fullcalendar/core';

import Grid from '@/shared/primitives/Grid/Grid';
import Flex from '@/shared/primitives/Flex/Flex';

import { useMLCalendar, type CalendarEvent, type CalendarView } from '@/shared/headless/MLCalendar/MLCalendar';

import styles from '../../MLCalendar.module.scss';
import { CalendarSidebar, type FilterId } from '../CalendarSidebar/CalendarSidebar';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader';
import CalendarEventItem from '../CalendarEnvetItem/CalendarEnvetItem';
import CalendarDayHeader from '../CalendarDayHeader/CalendarDayHeader';
import CalendarModal from '../CalendarModal/CalendarModal';

type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: string;
    badge?: string;
};

const getEventCategory = (e: CalendarEvent) => String(e.extendedProps?.category ?? '');

export const CalendarTemplate = () => {
    const ctx = useMLCalendar();
    const calRef = useRef<FullCalendar | null>(null);

    const [selected, setSelected] = useState<FilterId[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState<Draft | null>(null);

    const [draftEvent, setDraftEvent] = useState<any | null>(null);

    const filteredEvents = useMemo(() => {
        if (selected.length === 0) return ctx.events;
        const selectedSet = new Set(selected);
        return ctx.events.filter((e) => selectedSet.has(getEventCategory(e) as FilterId));
    }, [ctx.events, selected]);

    // Context(view/date) -> FullCalendar 동기화
    useEffect(() => {
        const api = calRef.current?.getApi();
        if (!api) return;

        if (api.view.type !== ctx.view) {
            api.changeView(ctx.view);
        }

        // FullCalendar가 이미 같은 날짜 범위면 gotoDate가 의미 없을 수 있지만 안전하게 호출
        api.gotoDate(ctx.currentDate);
    }, [ctx.view, ctx.currentDate]);

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

    const handleDatesSet = (arg: DatesSetArg) => {
        const v = arg.view.type as CalendarView;
        ctx.setView(v);

        // currentStart는 “현재 뷰가 기준으로 삼는 날짜”라서 네비게이션 동기화에 유용
        ctx.setCurrentDate(arg.view.currentStart);
    };

    const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
        const isTimeView = ctx.view !== 'dayGridMonth';
        const startDate = new Date(arg.date);
        const endDate = isTimeView ? new Date(startDate.getTime() + 60 * 60 * 1000) : undefined;

        setDraft({
            title: '',
            allDay: !isTimeView || arg.allDay,
            startDate,
            endDate,
            category: selected[0] ?? 'default',
        });
        setModalOpen(true);
    };

    const handleSelect = (info: DateSelectArg) => {
        const isTimeView = ctx.view !== 'dayGridMonth';

        setDraft({
            title: '',
            allDay: info.allDay || !isTimeView,
            startDate: info.start,
            endDate: info.end ?? undefined,
            category: selected[0] ?? 'default',
        });
        setModalOpen(true);
    };

    const handleUnselect = () => setDraftEvent(null);

    const handleEventDrop = (arg: EventDropArg) => {
        ctx.updateEvent(arg.event.id, {
            start: arg.event.start ?? undefined,
            end: arg.event.end ?? undefined,
        });
    };

    const addEvent = () => {
        if (!draft) return;
        if (!draft.title.trim()) return;

        ctx.addEvent({
            id: String(Date.now()),
            title: draft.title,
            start: draft.startDate,
            end: draft.allDay ? undefined : draft.endDate,
            allDay: draft.allDay,
            extendedProps: {
                category: draft.category,
                badge: draft.badge,
            },
        });

        setModalOpen(false);
        setDraft(null);
    };

    return (
        <Flex className={styles.container} direction="column" padding={{ r: 60, l: 20 }} gap={10}>
            <CalendarHeader />

            <Grid cols={15} rowGap={32} colGap={24}>
                <Grid.Col span={2} align="stretch">
                    <Flex
                        direction="column"
                        padding={{ x: 24, y: 30 }}
                        style={{
                            background: '#FAFAFA',
                            height: '100%',
                            borderRadius: '20px',
                        }}
                    >
                        <CalendarSidebar value={selected} onChange={setSelected} />
                    </Flex>
                </Grid.Col>

                <Grid.Col span={13} align="stretch">
                    <div className={styles.fcViewAnim} key={ctx.view}>
                        <FullCalendar
                            ref={(r) => {
                                calRef.current = r;
                            }}
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
                            eventContent={(arg) => <CalendarEventItem arg={arg} />}
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
                        />
                    </div>
                </Grid.Col>
            </Grid>
            <CalendarModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                draft={draft}
                onChangeTitle={(title) => setDraft((prev) => (prev ? { ...prev, title } : null))}
                onSubmit={addEvent}
            />
        </Flex>
    );
};
