import { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, DatesSetArg, EventDropArg, EventInput } from '@fullcalendar/core';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import Grid from '@/shared/primitives/Grid/Grid';
import Flex from '@/shared/primitives/Flex/Flex';
import type { FilterId } from './MLCalendarSidebar/MLCalendarSidebar';
import CalendarSidebar from './MLCalendarSidebar/MLCalendarSidebar';
import styles from './MLCalendar.module.scss';
import DayHeader from './DayHeader/DayHeader';
import MLCalendarEventItem from './MLCalendarEventItem/MLCalendarEventItem';
import Modal from '@/shared/headless/Modal/Modal';
import BaseModalLayout from '@/shared/primitives/BaseModalLayout/BaseModalLayout';
import Form from '@/shared/primitives/Form/Form';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Text from '@/shared/primitives/Text/Text';

export type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
const ALL: FilterId[] = [
    'default',
    'mk_meeting',
    'ct_schedule',
    'ct_website',
    'ct_request',
    'dev_website',
    'dev_request',
    'co_birthday',
    'co_holiday',
    'co_company',
    'co_interview',
];
type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: FilterId;
    badge?: string;
};

/**
 * TODO
 * 1. 일정등록 modal
 * 2. 일정 클릭시 상세 popover
 * 3. 더보기 클릭시 상세 popover
 * 4. 일정등록 모달폼 칼럼에 맞게 컴포넌트 수정
 * 5. 코드정리
 */
export const MLCalendar = () => {
    const calRef = useRef<FullCalendar | null>(null);
    const [view, setView] = useState<ViewType>('dayGridMonth');
    const [selected, setSelected] = useState<FilterId[]>(ALL);
    const [monthTitle, setMonthTitle] = useState('');
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [draftEvent, setDraftEvent] = useState<EventInput | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [events, setEvents] = useState<EventInput[]>([]);
    const getApi = () => calRef.current?.getApi();

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

    const filteredEvents = useMemo(
        () =>
            events.filter((e) => {
                const cat = e.extendedProps?.category as FilterId | undefined;
                return !cat || selected.includes(cat);
            }),
        [events, selected]
    );

    // 뷰/날짜 범위 바뀔 때 헤더 타이틀 갱신
    const handleDatesSet = (arg: DatesSetArg) => {
        const v = arg.view.type as ViewType;
        setView(v);

        // FullCalendar 뷰의 기준 날짜
        const current = arg.view.currentStart; // 월/주/일 공통 기준점
        const m = current.getMonth() + 1;
        setMonthTitle(`${String(m).padStart(2, '0')}월`);

        if (v === 'timeGridDay') {
            // 주 시작(일요일 기준)
            const weekStart = new Date(current);
            weekStart.setHours(0, 0, 0, 0);
            weekStart.setDate(current.getDate() - current.getDay()); // Sun start

            const arr = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i);
                return d;
            });
            setWeekDates(arr);
        } else {
            setWeekDates([]); // 월/주에서는 숨김
        }
    };
    const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
        // 기본 1시간 블록(시간 그리드일 때), 월간이면 종일
        const isTimeView = view !== 'dayGridMonth';
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

    // 날짜 선택 → 일정 추가 TODO: 일정추가 모달 연결
    const handleSelect = (info: DateSelectArg) => {
        const isTimeView = view !== 'dayGridMonth';

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

    // 이벤트 드래그앤드롭 TODO: 서버 저장 로직 연결
    const handleEventDrop = (arg: EventDropArg) => {
        setEvents((prev) =>
            prev.map((e) =>
                e.id === arg.event.id
                    ? { ...e, start: arg.event.start ?? undefined, end: arg.event.end ?? undefined }
                    : e
            )
        );
    };

    return (
        <Flex className={styles.container} direction="column" padding={{ r: 60, l: 20 }} gap={10}>
            <CalendarHeader
                title={monthTitle}
                onPrev={() => getApi()?.prev()}
                onNext={() => getApi()?.next()}
                onToday={() => getApi()?.today()}
                onChangeView={(v) => setView(v)}
                view={view}
                weekDates={weekDates}
            />
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
                    <div className={styles.fcViewAnim} key={view}>
                        <FullCalendar
                            ref={calRef}
                            key={view}
                            initialView={view}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={false} // 기본 헤더 끔
                            dateClick={handleDateClick}
                            datesSet={handleDatesSet} // 타이틀 갱신
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
                                const group = cat?.split('_')[0]; // 'mk' | 'ct' | 'dev' | 'co'
                                return group ? [`cat-${group}`] : [];
                            }}
                            eventDrop={handleEventDrop}
                            eventContent={(arg) => <MLCalendarEventItem arg={arg} />}
                            dayMaxEvents={3}
                            dayPopoverFormat={{
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                            }}
                            moreLinkContent={(arg) => ({ html: `${arg.num}개 더보기` })}
                            locale="ko"
                            height="auto"
                            dayHeaderContent={(arg) => <DayHeader arg={arg} />}
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

            <Modal value={modalOpen} onChange={setModalOpen}>
                <Modal.Backdrop />
                <Modal.Content maxHeight={'80%'}>
                    <BaseModalLayout padding={32} width={450} height={'100%'}>
                        <BaseModalLayout.Header title={'일정등록'} direction="row" fontSize={15} />
                        <BaseModalLayout.Content>
                            <BaseModalLayout.ScrollerWrapper>
                                <Form.Label text="일정등록" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="일정을 입력해주세요."
                                    />
                                </Form.Label>
                                <Form.Label text="기간" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="기간을 입력해주세요."
                                    />
                                </Form.Label>
                                <Form.Label text="소속" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="소속을 입력해주세요."
                                    />
                                </Form.Label>
                                <Form.Label text="업무내용" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="업무내용을 입력해주세요."
                                    />
                                </Form.Label>
                                <Form.Label text="장소" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="장소를 입력해주세요."
                                    />
                                </Form.Label>
                                <Form.Label text="참여인원(선택)" marginBottom={40} gap={12}>
                                    <RoundedInput
                                        wrapperStyle={{
                                            flex: 1,
                                            border: 0,
                                            padding: 0,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#A3A3A3',
                                        }}
                                        placeholder="참여인원을 입력해주세요."
                                    />
                                </Form.Label>
                                <Flex justify="end" width={'100%'}>
                                    <BaseButton
                                        padding={{ x: 14, y: 13 }}
                                        radius={8}
                                        bgColor={getThemeColor('Primary2')}
                                        onClick={() => {
                                            if (!draft) return;
                                            if (!draft.title.trim()) return;
                                            setEvents((prev) => [
                                                ...prev,
                                                {
                                                    id: String(Date.now()),
                                                    title: draft.title,
                                                    start: draft.startDate,
                                                    end: draft.allDay ? undefined : draft.endDate,
                                                    allDay: draft.allDay,
                                                    extendedProps: {
                                                        category: draft.category,
                                                        badge: draft.badge,
                                                    },
                                                },
                                            ]);
                                            setModalOpen(false);
                                            setDraft(null);
                                        }}
                                    >
                                        <Text fontSize={15} fontWeight={600} textColor={getThemeColor('Primary1')}>
                                            일정 추가
                                        </Text>
                                    </BaseButton>
                                </Flex>
                            </BaseModalLayout.ScrollerWrapper>
                        </BaseModalLayout.Content>
                    </BaseModalLayout>
                </Modal.Content>
            </Modal>
        </Flex>
    );
};
