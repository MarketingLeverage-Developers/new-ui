import React from 'react';
import classNames from 'classnames';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './DateRangePickerPanel.module.scss';

export type DateRangePickerPanelPreset<T extends string = string> = {
    key: T;
    label: React.ReactNode;
    range: DateRange;
};

export type DateRangePickerPanelProps<T extends string = string> = {
    range: DateRange | undefined;
    onChange: (next: DateRange | undefined) => void;
    presets?: DateRangePickerPanelPreset<T>[];
    selectedPresetKey?: T | null;
    maxDate?: Date;
    className?: string;
    fromLabel?: React.ReactNode;
    toLabel?: React.ReactNode;
    emptyText?: React.ReactNode;
    hintText?: React.ReactNode;
};

const WEEKDAY_KO_SHORT = ['일', '월', '화', '수', '목', '금', '토'] as const;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, diff: number) => new Date(date.getFullYear(), date.getMonth() + diff, 1);
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const formatSummaryDate = (date?: Date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day} (${WEEKDAY_KO_SHORT[date.getDay()]})`;
};

const DateRangePickerPanel = <T extends string = string>({
    range,
    onChange,
    presets = [],
    selectedPresetKey = null,
    maxDate,
    className,
    fromLabel = '시작일',
    toLabel = '종료일',
    emptyText = '날짜를 선택해주세요.',
    hintText = '기간은 오늘까지 선택할 수 있습니다.',
}: DateRangePickerPanelProps<T>) => {
    const today = React.useMemo(() => startOfDay(maxDate ?? new Date()), [maxDate]);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(range?.from ?? range?.to ?? today);

    React.useEffect(() => {
        setCurrentMonth(range?.from ?? range?.to ?? today);
    }, [range?.from, range?.to, today]);

    const monthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;
    const prevMonth = React.useMemo(() => addMonths(currentMonth, -1), [currentMonth]);
    const nextMonth = React.useMemo(() => addMonths(currentMonth, 1), [currentMonth]);
    const isNextDisabled = isSameMonth(currentMonth, today) || nextMonth > startOfMonth(today);

    return (
        <div className={classNames(styles.Root, className)}>
            <div className={styles.SummaryGrid}>
                <div className={styles.SummaryCard}>
                    <div className={styles.SummaryLabel}>{fromLabel}</div>
                    <div className={styles.SummaryValue}>{formatSummaryDate(range?.from) ?? emptyText}</div>
                </div>
                <div className={styles.SummaryCard}>
                    <div className={styles.SummaryLabel}>{toLabel}</div>
                    <div className={styles.SummaryValue}>{formatSummaryDate(range?.to) ?? emptyText}</div>
                </div>
            </div>

            {presets.length > 0 ? (
                <div className={styles.PresetRail}>
                    {presets.map((preset) => (
                        <button
                            key={preset.key}
                            type="button"
                            className={styles.PresetButton}
                            data-active={selectedPresetKey === preset.key ? 'true' : 'false'}
                            onClick={() => {
                                onChange(preset.range);
                                setCurrentMonth(preset.range.from ?? today);
                            }}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className={styles.CalendarCard}>
                <div className={styles.CalendarHeader}>
                    <button
                        type="button"
                        className={styles.NavButton}
                        aria-label="이전 달"
                        onClick={() => setCurrentMonth(prevMonth)}
                    >
                        <FiChevronLeft size={16} />
                    </button>

                    <div className={styles.MonthLabel}>{monthLabel}</div>

                    <button
                        type="button"
                        className={styles.NavButton}
                        aria-label="다음 달"
                        onClick={() => setCurrentMonth(nextMonth)}
                        disabled={isNextDisabled}
                    >
                        <FiChevronRight size={16} />
                    </button>
                </div>

                <div className={styles.Calendar}>
                    <DayPicker
                        locale={ko}
                        mode="range"
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        selected={range}
                        onSelect={onChange}
                        showOutsideDays
                        disabled={{ after: today }}
                        captionLayout="dropdown"
                    />
                </div>
            </div>

            <div className={styles.Hint}>{hintText}</div>
        </div>
    );
};

export default DateRangePickerPanel;
