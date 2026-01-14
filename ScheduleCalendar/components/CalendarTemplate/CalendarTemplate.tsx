import { useState } from 'react';
import Grid from '@/shared/primitives/Grid/Grid';
import Flex from '@/shared/primitives/Flex/Flex';

import type { EventContentArg } from '@fullcalendar/core';

import ScheduleCalendar from '../../ScheduleCalendar';
import { type FilterId } from '../CalendarSidebar/CalendarSidebar';
import type FullCalendar from '@fullcalendar/react';

type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: string;
    badge?: string;
};

type CalendarTemplateProps = {
    sidebarProps?: {
        initialValue?: FilterId[];
    };
    calendarProps?: {
        calendarProps?: Partial<React.ComponentProps<typeof FullCalendar>>;
        renderEventItem?: (arg: EventContentArg) => React.ReactNode;
    };
    isModal?: boolean;
    modalvalue?: boolean;
    setModalValue?: (val: boolean) => void;
    modalTitle?: string;
};

export const CalendarTemplate = ({
    sidebarProps,
    calendarProps,
    isModal = false,
    modalvalue,
    setModalValue,
    modalTitle,
}: CalendarTemplateProps) => {
    const [selected, setSelected] = useState<FilterId[]>(sidebarProps?.initialValue ?? []);
    const [draft, setDraft] = useState<Draft | null>(null);

    return (
        <ScheduleCalendar>
            <ScheduleCalendar.CalendarHeader />

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
                            setModalValue?.(true);
                        }}
                        renderEventItem={calendarProps?.renderEventItem}
                        calendarProps={calendarProps?.calendarProps}
                    />
                </Grid.Col>
            </Grid>

            {isModal && setModalValue && (
                <ScheduleCalendar.CalendarModal
                    open={!!modalvalue}
                    onOpenChange={setModalValue}
                    draft={draft}
                    onChangeTitle={(title) => setDraft((prev) => (prev ? { ...prev, title } : null))}
                    onSubmit={() => {
                        // addEvent는 여기서 useMLCalendar로 처리하면 됨
                    }}
                    title={modalTitle}
                />
            )}
        </ScheduleCalendar>
    );
};

export default CalendarTemplate;
