import { useState } from 'react';
import styles from './DoubleDatePicker.module.scss';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type DoubleDatePickerProps = {
    range: DateRange;
    onChange: (r: DateRange | undefined) => void;
};

const DoubleDatePicker = ({ range, onChange }: DoubleDatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const formattingDate = (d?: Date) =>
        d
            ? `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(
                  2,
                  '0'
              )}`
            : '';

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
        <div className={styles.DoubleDatePickerWrapper}>
            <div className={styles.DatePickerContent}>
                <div className={styles.NavWrapper}>
                    <button type="button" className={styles.NavButton} onClick={handlePrevMonth}>
                        <IoIosArrowBack className={styles.Icon} />
                    </button>
                    <div className={styles.MonthTextWrapper}>
                        <span className={styles.MonthText}>{getMonthYear(0)}</span>

                        <span className={styles.MonthText}>{getMonthYear(1)}</span>
                    </div>
                    <button type="button" className={styles.NavButton} onClick={handleNextMonth}>
                        <IoIosArrowForward className={styles.Icon} />
                    </button>
                </div>
                <DayPicker
                    locale={ko}
                    mode="range"
                    month={currentMonth}
                    numberOfMonths={2}
                    showOutsideDays
                    selected={range}
                    onSelect={onChange}
                />
            </div>

            <div className={styles.Legend}>
                <div className={styles.RangeText}>
                    {range?.from && range?.to && `${formattingDate(range.from)} - ${formattingDate(range.to)}`}
                </div>
                <div className={styles.Buttons}>
                    <button className={styles.CancelButton}>취소</button>
                    <button className={styles.ConfirmButton}>적용</button>
                </div>
            </div>
        </div>
    );
};

export default DoubleDatePicker;
