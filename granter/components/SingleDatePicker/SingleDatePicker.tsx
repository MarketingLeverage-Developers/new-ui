import React from 'react';
import classNames from 'classnames';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './SingleDatePicker.module.scss';

export type SingleDatePickerProps = {
    date: Date;
    onChangeDate: (value: Date) => void;
    className?: string;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month'>;

const isValidDate = (value: Date | undefined): value is Date =>
    Boolean(value && !Number.isNaN(value.getTime()));

const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const SingleDatePicker = ({ date, onChangeDate, className, ...props }: SingleDatePickerProps) => {
    const safeDate = React.useMemo(() => (isValidDate(date) ? date : new Date()), [date]);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() => toMonthStart(safeDate));

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

            <DayPicker
                locale={ko}
                mode="single"
                month={currentMonth}
                showOutsideDays
                selected={safeDate}
                onSelect={(next) => {
                    if (!next) return;
                    onChangeDate(next);
                }}
                required={true as const}
                {...props}
            />

            <div className={styles.Legend}>
                <span className={styles.LegendItem}>
                    <span className={classNames(styles.LegendDot, styles.LegendDotToday)} />
                    오늘 날짜
                </span>
                <span className={styles.LegendItem}>
                    <span className={classNames(styles.LegendDot, styles.LegendDotSelected)} />
                    선택한 날짜
                </span>
            </div>
        </div>
    );
};

export default SingleDatePicker;
