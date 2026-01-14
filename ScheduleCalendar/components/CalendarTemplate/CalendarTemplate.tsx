import { useState } from 'react';
import Grid from '@/shared/primitives/Grid/Grid';
import Flex from '@/shared/primitives/Flex/Flex';

import type FullCalendar from '@fullcalendar/react';
import type { EventContentArg } from '@fullcalendar/core';

import ScheduleCalendar from '../../ScheduleCalendar';
import type { CalendarEvent, CalendarView } from '@/shared/headless/MLCalendar/MLCalendar';
import type { FilterId } from '../CalendarSidebar/CalendarSidebar';

type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: string;
    badge?: string;
};

/** provider props 묶음 */
type ProviderDeps = {
    initialView?: CalendarView;
    initialDate?: Date;

    // mount 1회 초기값
    initialEvents?: CalendarEvent[];

    // 비동기/리패치 대응: headless에서 useEffect로 events 갱신됨
    externalEvents?: CalendarEvent[];

    onViewChange?: (view: CalendarView) => void;
    onDateChange?: (date: Date) => void;
    onEventSelect?: (event: CalendarEvent | null) => void;
    onEventsChange?: (events: CalendarEvent[]) => void;
};

/** sidebar props 묶음 */
type SidebarDeps = {
    initialValue?: FilterId[];
};

/** calendar props 묶음 */
type CalendarDeps = {
    calendarProps?: Partial<React.ComponentProps<typeof FullCalendar>>;
    renderEventItem?: (arg: EventContentArg) => React.ReactNode;
};

/** modal props 묶음 */
type ModalDeps = {
    enabled?: boolean;
    value?: boolean;
    onChange?: (val: boolean) => void;
    title?: string;

    // Template에서 서비스 호출 안 하려면 여기로 위임
    onSubmit?: (draft: Draft | null) => void;
};

type CalendarTemplateProps = {
    provider?: ProviderDeps;
    sidebar?: SidebarDeps;
    calendar?: CalendarDeps;
    modal?: ModalDeps;
    // CalendarHeader Props 을 따로 빼야할지도
    viewListTab?: React.ReactNode;
};

export const CalendarTemplate = ({ provider, sidebar, calendar, modal, viewListTab }: CalendarTemplateProps) => {
    const [selected, setSelected] = useState<FilterId[]>(sidebar?.initialValue ?? []);
    const [draft, setDraft] = useState<Draft | null>(null);

    return (
        <ScheduleCalendar
            initialView={provider?.initialView}
            initialDate={provider?.initialDate}
            initialEvents={provider?.initialEvents}
            externalEvents={provider?.externalEvents} //
            onViewChange={provider?.onViewChange}
            onDateChange={provider?.onDateChange}
            onEventSelect={provider?.onEventSelect}
            onEventsChange={provider?.onEventsChange}
        >
            <ScheduleCalendar.CalendarHeader viewListTab={viewListTab && viewListTab} />

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
                        <ScheduleCalendar.Sidebar value={selected} onChange={setSelected} />
                    </Flex>
                </Grid.Col>

                <Grid.Col span={13} align="stretch">
                    <ScheduleCalendar.Calendar
                        selected={selected}
                        onRequestCreate={(d) => {
                            setDraft(d);
                            modal?.onChange?.(true);
                        }}
                        renderEventItem={calendar?.renderEventItem}
                        calendarProps={calendar?.calendarProps}
                    />
                </Grid.Col>
            </Grid>

            {modal?.enabled && modal?.onChange && (
                <ScheduleCalendar.CalendarModal
                    open={!!modal.value}
                    onOpenChange={modal.onChange}
                    draft={draft}
                    onChangeTitle={(title) => setDraft((prev) => (prev ? { ...prev, title } : null))}
                    onSubmit={() => {
                        // Template에서 서비스 호출 안 함. 상위로 위임.
                        modal.onSubmit?.(draft);
                    }}
                    title={modal.title}
                />
            )}
        </ScheduleCalendar>
    );
};

export default CalendarTemplate;
