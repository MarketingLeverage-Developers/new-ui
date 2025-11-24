import React, { useEffect, useState } from 'react';
import styles from './CalendarDatePicker.module.scss';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type CalendarDatePickerProps = {
    /** 선택된 날짜 */
    date: Date;
    /** 날짜 변경 콜백 */
    onChangeDate: (value: Date) => void;
    width?: string | number;
    height?: string | number;
    maxWidth?: CSSLength;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month'>;

const CalendarDatePicker = ({
    date,
    onChangeDate,
    maxWidth,
    width = '100%',
    height = '100%',
    ...props
}: CalendarDatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(date ?? new Date());

    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--max-width': toCssUnit(maxWidth),
    };

    // 외부에서 date가 바뀌면 month도 같이 맞춰줌
    useEffect(() => {
        if (!date) return;
        setCurrentMonth((prev) => {
            if (prev.getFullYear() === date.getFullYear() && prev.getMonth() === date.getMonth()) {
                return prev;
            }
            return new Date(date.getFullYear(), date.getMonth(), 1);
        });
    }, [date]);

    const getMonthLabel = () => {
        const month = currentMonth.getMonth() + 1;
        return `${month.toString().padStart(2, '0')}월`;
    };

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + 1);
            return newMonth;
        });
    };

    return (
        <div className={styles.CalendarDatePickerWrapper} style={{ ...cssVariables }}>
            <div className={styles.Header}>
                <div className={styles.MonthNav}>
                    <button type="button" className={styles.NavButton} onClick={handlePrevMonth}>
                        <IoIosArrowBack className={styles.Icon} />
                    </button>
                    <span className={styles.MonthText}>{getMonthLabel()}</span>
                    <button type="button" className={styles.NavButton} onClick={handleNextMonth}>
                        <IoIosArrowForward className={styles.Icon} />
                    </button>
                </div>

                <div className={styles.Legend}>
                    <div className={styles.Item}>
                        <span className={styles.DotToday} />
                        <span>오늘 날짜</span>
                    </div>
                    <div className={styles.Item}>
                        <span className={styles.DotSelected} />
                        <span>선택한 날짜</span>
                    </div>
                </div>
            </div>

            <DayPicker
                locale={ko}
                mode="single"
                month={currentMonth}
                showOutsideDays
                selected={date}
                onSelect={(d?: Date) => d && onChangeDate(d)}
                required={true as const}
                {...props}
            />
        </div>
    );
};

export default CalendarDatePicker;
