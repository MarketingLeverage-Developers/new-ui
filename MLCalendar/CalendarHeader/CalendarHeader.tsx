import RoundedTab from '@/shared/primitives/RoundedTab/RoundedTab';
import React from 'react';
import type { ViewType } from '../MLCalendar';
import Flex from '@/shared/primitives/Flex/Flex';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Text from '@/shared/primitives/Text/Text';

type CalendarHeaderProps = {
    title: string; // 'MM월'
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    view: ViewType;
    onChangeView: (v: ViewType) => void;
    weekDates?: Date[]; // 일간뷰일 때만 전달
};

const yoils = ['일', '월', '화', '수', '목', '금', '토'];
const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    title,
    onPrev,
    onNext,
    onToday,
    view,
    onChangeView,
    weekDates = [],
}) => {
    const today = new Date();
    const preventSelect = (e: React.MouseEvent) => e.preventDefault();

    return (
        <Flex align="center" justify="space-between" height={45}>
            <Flex align="center" gap={8}>
                <div
                    onClick={onToday}
                    onMouseDown={preventSelect}
                    style={{
                        background: 'transparent',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        padding: '2px 8px',
                        cursor: 'pointer',
                    }}
                >
                    오늘
                </div>

                <Flex padding={{ x: 8, y: 7 }}>
                    <GrFormPrevious
                        onClick={onPrev}
                        onMouseDown={preventSelect}
                        size={18}
                        color={getThemeColor('Gray1')}
                        style={{ cursor: 'pointer' }}
                    />
                </Flex>
                <Flex padding={{ x: 8, y: 7 }}>
                    <GrFormNext
                        onClick={onNext}
                        onMouseDown={preventSelect}
                        size={18}
                        color={getThemeColor('Gray1')}
                        style={{ cursor: 'pointer' }}
                    />
                </Flex>

                {/* 타이틀 + (일간뷰일 때) 주간 스트립 */}
                <Flex align="center" gap={20}>
                    <Text fontSize={24} fontWeight={600} textColor={getThemeColor('Black1')}>
                        {title}
                    </Text>

                    {view === 'timeGridDay' && weekDates.length === 7 && (
                        <Flex align="center" gap={8}>
                            {weekDates.map((d) => {
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

            <RoundedTab
                value={view}
                onChange={(v) => onChangeView(v as ViewType)}
                aria-label="캘린더 뷰 전환"
                divProps={{ style: { width: 'fit-content' } }}
            >
                <RoundedTab.Item value="dayGridMonth">월</RoundedTab.Item>
                <RoundedTab.Item value="timeGridWeek">주</RoundedTab.Item>
                <RoundedTab.Item value="timeGridDay">일</RoundedTab.Item>
            </RoundedTab>
        </Flex>
    );
};
