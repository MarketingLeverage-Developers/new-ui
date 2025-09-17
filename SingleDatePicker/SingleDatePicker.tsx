import React, { useState } from 'react';
import styles from './SingleDatePicker.module.scss';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type SingleDatePickerProps = {
    date: Date;
    onChangeDate: (value: Date) => void;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month'>;

const SingleDatePicker = ({ date, onChangeDate, ...props }: SingleDatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const getMonthYear = (monthOffset: number) => {
        const date = new Date(currentMonth);
        date.setMonth(currentMonth.getMonth() + monthOffset);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };
    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    return (
        <div className={styles.SingleDatePickerWrapper}>
            <div className={styles.NavWrapper}>
                <span className={styles.MonthText}>{getMonthYear(0)}</span>
                <div>
                    <button className={styles.NavButton} onClick={handlePrevMonth}>
                        <IoIosArrowBack className={styles.Icon} />
                    </button>
                    <button className={styles.NavButton} onClick={handleNextMonth}>
                        <IoIosArrowForward className={styles.Icon} />
                    </button>
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

            <div className={styles.Legend}>
                <div className={styles.Item}>
                    <span className={styles.DotToday}></span>
                    <span>오늘 날짜</span>
                </div>
                <div className={styles.Item}>
                    <span className={styles.DotSelected}></span>
                    <span>선택한 날짜</span>
                </div>
            </div>
        </div>
    );
};

export default SingleDatePicker;
