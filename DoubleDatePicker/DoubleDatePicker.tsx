import { useEffect, useState } from 'react';
import styles from './DoubleDatePicker.module.scss';
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type DoubleDatePickerProps = {
    range: DateRange; // 확정된 범위(부모에서 관리)
    onChange: (r: DateRange | undefined) => void; // "적용" 시에만 호출
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month'>;

const DoubleDatePicker = ({ range, onChange, ...props }: DoubleDatePickerProps) => {
    // 캘린더 좌측 기준 월
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    // 사용자가 캘린더에서 고르는 임시 범위 (적용 누르기 전까지 부모에 반영 X)
    const [tempRange, setTempRange] = useState<DateRange | undefined>(range);

    // 외부 range가 바뀌면 임시 범위도 동기화
    useEffect(() => {
        setTempRange(range);
    }, [range]);

    // yyyy. mm. dd 포맷
    const formattingDate = (d?: Date) =>
        d
            ? `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(
                  2,
                  '0'
              )}`
            : '';

    // 상단 네비게이션용 월/연 텍스트
    const getMonthYear = (monthOffset: number) => {
        const date = new Date(currentMonth);
        date.setMonth(currentMonth.getMonth() + monthOffset);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    // 이전/다음 달 이동
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

    // 적용: 임시 범위를 부모에 확정 반영
    const handleApply = () => {
        onChange(tempRange);
    };

    // 취소: 임시 선택을 확정값으로 롤백
    const handleCancel = () => {
        setTempRange(range);
    };

    const isApplyDisabled = !(tempRange?.from && tempRange?.to);

    return (
        <div className={styles.DoubleDatePickerWrapper}>
            <div className={styles.DatePickerContent}>
                {/* 외부 네비게이션 (캡션 제거 스타일) */}
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

                {/* 날짜 선택은 임시 상태(tempRange)만 변경 */}
                <DayPicker
                    locale={ko}
                    mode="range"
                    month={currentMonth}
                    numberOfMonths={2}
                    showOutsideDays
                    selected={tempRange}
                    onSelect={setTempRange} // 여기서 바로 부모 onChange 호출하지 않음
                    {...props}
                />
            </div>

            <div className={styles.Legend}>
                <div className={styles.RangeText}>
                    {tempRange?.from &&
                        tempRange?.to &&
                        `${formattingDate(tempRange.from)} - ${formattingDate(tempRange.to)}`}
                </div>
                <div className={styles.Buttons}>
                    <button type="button" className={styles.CancelButton} onClick={handleCancel}>
                        취소
                    </button>
                    <button
                        type="button"
                        className={styles.ConfirmButton}
                        onClick={handleApply}
                        disabled={isApplyDisabled}
                        aria-disabled={isApplyDisabled}
                        title={isApplyDisabled ? '시작일과 종료일을 모두 선택하세요' : '선택한 기간 적용'}
                    >
                        적용
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoubleDatePicker;
