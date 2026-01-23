import type React from 'react';
import RoundedTab from '@/shared/primitives/RoundedTab/RoundedTab';
import Flex from '@/shared/primitives/Flex/Flex';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Text from '@/shared/primitives/Text/Text';
import { useMLCalendar, type CalendarView } from '@/shared/headless/MLCalendar/MLCalendar';

type CalendarHeaderProps = {
    title?: string;
    onPrev?: () => void;
    onNext?: () => void;
    onToday?: () => void;
    view?: CalendarView;
    onChangeView?: (v: CalendarView) => void;
    weekDates?: Date[];
    viewListTab?: React.ReactNode;
};

const yoils = ['일', '월', '화', '수', '목', '금', '토'];

const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const getMonthTitle = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}월`;

const getWeekDates = (base: Date) => {
    const start = new Date(base);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const nd = new Date(start);
        nd.setDate(start.getDate() + i);
        return nd;
    });
};

export const CalendarHeader = ({
    title,
    onPrev,
    onNext,
    onToday,
    view,
    onChangeView,
    weekDates,
    viewListTab,
}: CalendarHeaderProps) => {
    const ctx = useMLCalendar();

    const currentView = view ?? ctx.view;
    const currentTitle = title ?? getMonthTitle(ctx.currentDate);
    const currentWeekDates = weekDates ?? (currentView === 'timeGridDay' ? getWeekDates(ctx.currentDate) : []);

    const handlePrev = onPrev ?? ctx.goToPrev;
    const handleNext = onNext ?? ctx.goToNext;
    const handleToday = onToday ?? ctx.goToToday;
    const handleChangeView = onChangeView ?? ctx.setView;

    const today = new Date();
    const preventSelect = (e: React.MouseEvent) => e.preventDefault();

    return (
        <Flex align="center" justify="space-between" height={45}>
            <Flex align="center" gap={8}>
                {/* <div
                    onClick={handleToday}
                    onMouseDown={preventSelect}
                    style={{
                        background: getThemeColor('Gray6'),
                        // border: '1px solid #ddd',
                        borderRadius: 6,
                        padding: '7px 12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '700',
                        
                    }}
                >
                    이번달
                </div> */}

                <Flex padding={{ x: 8, y: 7 }}>
                    <GrFormPrevious
                        onClick={handlePrev}
                        onMouseDown={preventSelect}
                        size={18}
                        color={getThemeColor('Gray1')}
                        style={{ cursor: 'pointer' }}
                    />
                </Flex>
                <Flex padding={{ x: 8, y: 7 }}>
                    <GrFormNext
                        onClick={handleNext}
                        onMouseDown={preventSelect}
                        size={18}
                        color={getThemeColor('Gray1')}
                        style={{ cursor: 'pointer' }}
                    />
                </Flex>

                <Flex align="center" gap={20}>
                    <Text fontSize={24} fontWeight={600} textColor={getThemeColor('Black1')}>
                        {currentTitle}
                    </Text>

                    {currentView === 'timeGridDay' && currentWeekDates.length === 7 && (
                        <Flex align="center" gap={8}>
                            {currentWeekDates.map((d) => {
                                const isToday = isSameDate(d, today);
                                const dow = d.getDay();
                                return (
                                    <Flex
                                        key={d.toISOString()}
                                        padding={{ x: 10, y: 6 }}
                                        direction="column"
                                        align="center"
                                        justify="center"
                                        gap={2}
                                        style={{
                                            borderRadius: isToday ? '6px' : 0,
                                            border: isToday ? '1px solid var(--Gray5)' : 'none',
                                            background: isToday ? '#F8F8F8' : 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Text
                                            fontSize={12}
                                            textColor={isToday ? getThemeColor('Black1') : getThemeColor('Gray2')}
                                            fontWeight={isToday ? 600 : 400}
                                        >
                                            {yoils[dow]}
                                        </Text>
                                        <Text
                                            fontSize={14}
                                            textColor={isToday ? getThemeColor('Black1') : getThemeColor('Gray1')}
                                            fontWeight={isToday ? 600 : 400}
                                        >
                                            {d.getDate()}
                                        </Text>
                                    </Flex>
                                );
                            })}
                        </Flex>
                    )}
                </Flex>
            </Flex>

            <Flex align="center" gap={36}>
                {viewListTab && viewListTab}
                <RoundedTab
                    value={currentView}
                    onChange={(v) => handleChangeView(v as CalendarView)}
                    aria-label="캘린더 뷰 전환"
                    divProps={{ style: { width: 'fit-content' } }}
                >
                    <RoundedTab.Item value="dayGridMonth">월</RoundedTab.Item>
                    <RoundedTab.Item value="timeGridWeek">주</RoundedTab.Item>
                    <RoundedTab.Item value="timeGridDay">일</RoundedTab.Item>
                </RoundedTab>
            </Flex>
        </Flex>
    );
};
