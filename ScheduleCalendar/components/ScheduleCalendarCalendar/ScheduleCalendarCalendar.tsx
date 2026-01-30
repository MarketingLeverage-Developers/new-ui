import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type {
    DateSelectArg,
    DatesSetArg,
    EventDropArg,
    EventContentArg,
    MoreLinkArg,
    MoreLinkSimpleAction,
} from '@fullcalendar/core';

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

/**
 * FullCalendar 콜백(datesSet 등) 내부에서 React state를 즉시 업데이트하면
 * FullCalendar 내부 flushSync와 충돌하여 경고/루프가 날 수 있음.
 * - datesSet에서 ctx.setState는 microtask로 미루고
 * - ctx->FC 동기화로 인해 발생한 datesSet은 무시(syncingRef)
 */
export const ScheduleCalendarCalendar = ({
    selected,
    onRequestCreate,
    renderEventItem,
    calendarProps,
}: ScheduleCalendarCalendarProps) => {
    const ctx = useMLCalendar();
    const calRef = useRef<FullCalendar | null>(null);
    const viewRef = useRef<HTMLDivElement | null>(null);

    const [draftEvent, setDraftEvent] = useState<any | null>(null);

    /** ctx->FC 동기화로 유발된 datesSet 무시용 */
    const syncingRef = useRef(false);
    const stopSyncLater = useCallback(() => {
        // next tick에 해제 (FC 내부 flushSync/레이아웃 계산 끝난 다음)
        setTimeout(() => {
            syncingRef.current = false;
        }, 0);
    }, []);

    const filteredEvents = useMemo(() => {
        if (selected.length === 0) return ctx.events;
        const selectedSet = new Set(selected);
        return ctx.events.filter((e) => selectedSet.has(getEventCategory(e) as FilterId));
    }, [ctx.events, selected]);

    /**
     * ✅ ctx -> FullCalendar 동기화 (진짜 다를 때만)
     * - changeView / gotoDate는 datesSet을 발생시키므로 syncingRef로 보호
     */
    useEffect(() => {
        const api = calRef.current?.getApi();
        if (!api) return;

        syncingRef.current = true;

        if (api.view.type !== ctx.view) {
            api.changeView(ctx.view);
        }

        const apiDate = normalizeDay(api.getDate());
        const ctxDate = normalizeDay(ctx.currentDate);

        if (!isSameDay(apiDate, ctxDate)) {
            api.gotoDate(ctxDate);
        }

        stopSyncLater();
    }, [ctx.view, ctx.currentDate, stopSyncLater]);

    /**
     * ✅ FullCalendar -> ctx 업데이트
     * - datesSet은 changeView/gotoDate에도 발화하므로 syncingRef면 무시
     * - state update는 microtask로 미뤄 flushSync 경고 방지
     */
    const handleDatesSet = useCallback(
        (arg: DatesSetArg) => {
            if (syncingRef.current) return;

            const v = arg.view.type as CalendarView;
            const nextDate = normalizeDay(arg.view.currentStart);

            // microtask로 미루기
            queueMicrotask(() => {
                // view
                if (ctx.view !== v) ctx.setView(v);

                // currentDate (day-level)
                const cur = normalizeDay(ctx.currentDate);
                if (!isSameDay(cur, nextDate)) ctx.setCurrentDate(nextDate);
            });
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

    const positionMorePopover = useCallback((popoverEl: HTMLElement, anchorEl?: HTMLElement | null) => {
        const padding = 10;
        const gap = 8;
        const preferredMaxHeight = 410;
        const viewportHeight = window.innerHeight;

        const anchorRect = anchorEl?.getBoundingClientRect();
        const fallbackMaxHeight = Math.max(0, Math.min(preferredMaxHeight, viewportHeight - padding * 2));

        let placeBelow = true;
        let maxHeight = fallbackMaxHeight;

        if (anchorRect) {
            const spaceBelow = Math.max(0, viewportHeight - padding - anchorRect.bottom - gap);
            const spaceAbove = Math.max(0, anchorRect.top - padding - gap);

            placeBelow = spaceBelow >= spaceAbove;
            const availableSpace = (placeBelow ? spaceBelow : spaceAbove) || fallbackMaxHeight;
            maxHeight = Math.max(0, Math.min(preferredMaxHeight, availableSpace));
        }
        popoverEl.style.setProperty('--fc-more-popover-max-height', `${maxHeight}px`);

        const headerEl = popoverEl.querySelector<HTMLElement>('.fc-popover-header');
        const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
        popoverEl.style.setProperty('--fc-more-popover-body-max-height', `${Math.max(0, maxHeight - headerHeight)}px`);

        const rect = popoverEl.getBoundingClientRect();
        const overflowBottom = rect.bottom - (viewportHeight - padding);
        const overflowTop = padding - rect.top;

        if (overflowBottom <= 0 && overflowTop <= 0) {
            return;
        }

        const originTop = popoverEl.offsetParent?.getBoundingClientRect().top ?? 0;
        let targetTop = rect.top;

        if (anchorRect) {
            targetTop = placeBelow ? anchorRect.bottom + gap : anchorRect.top - gap - rect.height;
        }

        const maxTop = viewportHeight - padding - rect.height;
        if (Number.isFinite(maxTop)) {
            targetTop = Math.min(Math.max(targetTop, padding), maxTop);
        } else {
            targetTop = Math.max(targetTop, padding);
        }

        popoverEl.style.top = `${targetTop - originTop}px`;
    }, []);

    const scheduleMorePopoverAdjust = useCallback(
        (anchorEl?: HTMLElement | null) => {
            let attempts = 0;

            const tryAdjust = () => {
                attempts += 1;
                const popoverEl = viewRef.current?.querySelector<HTMLElement>('.fc-popover.fc-more-popover');

                if (popoverEl) {
                    positionMorePopover(popoverEl, anchorEl);
                    return;
                }

                if (attempts < 4) {
                    requestAnimationFrame(tryAdjust);
                }
            };

            requestAnimationFrame(tryAdjust);
        },
        [positionMorePopover]
    );

    const externalMoreLinkClick = calendarProps?.moreLinkClick;
    const handleMoreLinkClick = useCallback(
        (arg: MoreLinkArg): MoreLinkSimpleAction | void => {
            let result: MoreLinkSimpleAction | void;

            if (typeof externalMoreLinkClick === 'function') {
                result = externalMoreLinkClick(arg);
            } else {
                result = externalMoreLinkClick as MoreLinkSimpleAction | undefined;
            }

            const shouldOpenPopover = !result || result === 'popover';

            if (shouldOpenPopover) {
                const anchor = (arg.jsEvent?.currentTarget || arg.jsEvent?.target) as HTMLElement | null;
                scheduleMorePopoverAdjust(anchor);
            }

            return result;
        },
        [externalMoreLinkClick, scheduleMorePopoverAdjust]
    );

    const { moreLinkClick: _ignoredMoreLinkClick, ...restCalendarProps } = calendarProps ?? {};

    return (
        <div className={styles.fcViewAnim} ref={viewRef}>
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
                moreLinkClick={handleMoreLinkClick}
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
                {...restCalendarProps}
            />
        </div>
    );
};

export default ScheduleCalendarCalendar;
