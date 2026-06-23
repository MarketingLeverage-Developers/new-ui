import React from 'react';
import classNames from 'classnames';
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './InlineSingleDateCalendar.module.scss';

export type InlineSingleDateCalendarProps = {
    date?: Date;
    onChangeDate?: (value: Date) => void;
    range?: DateRange;
    onChangeRange?: (value: DateRange | undefined) => void;
    className?: string;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month'>;

const isValidDate = (value: Date | undefined): value is Date =>
    Boolean(value && !Number.isNaN(value.getTime()));

const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getRangeBaseDate = (range?: DateRange) => (isValidDate(range?.from) ? range.from : range?.to);

const normalizeDateRange = (range?: DateRange): DateRange | undefined => {
    if (!isValidDate(range?.from) && !isValidDate(range?.to)) return undefined;

    const from = isValidDate(range?.from) ? range.from : range?.to;
    const to = isValidDate(range?.to) ? range.to : range?.from;
    if (!from || !to) return undefined;

    return from.getTime() <= to.getTime() ? { from, to } : { from: to, to: from };
};

const InlineSingleDateCalendar = ({
    date,
    onChangeDate,
    range,
    onChangeRange,
    className,
    ...props
}: InlineSingleDateCalendarProps) => {
    const normalizedRange = React.useMemo(() => normalizeDateRange(range), [range]);
    const baseDate = getRangeBaseDate(normalizedRange) ?? date;
    const safeDate = React.useMemo(() => (isValidDate(baseDate) ? baseDate : new Date()), [baseDate]);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() => toMonthStart(safeDate));
    const isRangeMode = Boolean(normalizedRange);

    React.useEffect(() => {
        setCurrentMonth((prev) => {
            if (prev.getFullYear() === safeDate.getFullYear() && prev.getMonth() === safeDate.getMonth()) {
                return prev;
            }

            return toMonthStart(safeDate);
        });
    }, [safeDate]);

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const monthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

    return (
        <div className={classNames(styles.Root, className)}>
            <div className={styles.NavRow}>
                <span className={styles.MonthText}>{monthLabel}</span>

                <div className={styles.NavButtons}>
                    <button type="button" className={styles.NavButton} onClick={handlePrevMonth} aria-label="이전 달">
                        <IoIosArrowBack />
                    </button>
                    <button type="button" className={styles.NavButton} onClick={handleNextMonth} aria-label="다음 달">
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>

            {isRangeMode ? (
                <DayPicker
                    locale={ko}
                    mode="range"
                    month={currentMonth}
                    showOutsideDays
                    fixedWeeks
                    selected={normalizedRange}
                    onSelect={(next) => onChangeRange?.(next)}
                    {...props}
                />
            ) : (
                <DayPicker
                    locale={ko}
                    mode="single"
                    month={currentMonth}
                    showOutsideDays
                    fixedWeeks
                    selected={safeDate}
                    onSelect={(next) => {
                        if (!next) return;
                        onChangeDate?.(next);
                    }}
                    required={true as const}
                    {...props}
                />
            )}
        </div>
    );
};

export default InlineSingleDateCalendar;
