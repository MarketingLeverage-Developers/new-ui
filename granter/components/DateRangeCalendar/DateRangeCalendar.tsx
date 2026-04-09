import React from 'react';
import classNames from 'classnames';
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowDown } from 'react-icons/io';
import { IoCaretBackSharp, IoCaretForwardSharp } from 'react-icons/io5';
import styles from './DateRangeCalendar.module.scss';

export type DateRangeCalendarPresetKey =
    | 'YESTERDAY'
    | 'TODAY'
    | 'THIS_MONTH'
    | 'LAST_MONTH'
    | 'LAST_7_DAYS'
    | 'LAST_3_MONTHS'
    | 'LAST_6_MONTHS'
    | 'LAST_12_MONTHS'
    | 'THIS_YEAR'
    | 'LAST_YEAR'
    | 'Q1'
    | 'Q2'
    | 'Q3'
    | 'Q4';

type PresetKey = DateRangeCalendarPresetKey;

export type DateRangeCalendarProps = {
    range: DateRange;
    onChange: (next: DateRange | undefined) => void;
    onPresetSelect?: (key: PresetKey) => void;
    className?: string;
    allowFutureDates?: boolean;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month' | 'numberOfMonths'>;

const PRESETS: { key: PresetKey; label: string }[] = [
    { key: 'YESTERDAY', label: '어제' },
    { key: 'TODAY', label: '오늘' },
    { key: 'THIS_MONTH', label: '이번 달' },
    { key: 'LAST_MONTH', label: '지난 달' },
    { key: 'LAST_7_DAYS', label: '지난 7일' },
    { key: 'LAST_3_MONTHS', label: '지난 3개월' },
    { key: 'LAST_6_MONTHS', label: '지난 6개월' },
    { key: 'LAST_12_MONTHS', label: '지난 12개월' },
    { key: 'THIS_YEAR', label: '이번 연도' },
    { key: 'LAST_YEAR', label: '지난 연도' },
    { key: 'Q1', label: '1분기' },
    { key: 'Q2', label: '2분기' },
    { key: 'Q3', label: '3분기' },
    { key: 'Q4', label: '4분기' },
];

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const pad2 = (value: number) => String(value).padStart(2, '0');
const formatIso = (date?: Date) => (date ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` : '');
const formatInputDate = (date?: Date) =>
    date ? `${formatIso(date)} (${WEEKDAY_LABELS[date.getDay()]})` : '';
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isAfterDay = (a: Date, b: Date) => startOfDay(a).getTime() > startOfDay(b).getTime();
const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const getRangeBounds = (value: DateRange | undefined) => {
    const from = value?.from ?? value?.to;
    const to = value?.to ?? value?.from;

    if (!from || !to) return undefined;

    const normalizedFrom = startOfDay(from);
    const normalizedTo = startOfDay(to);
    return normalizedFrom <= normalizedTo
        ? { from: normalizedFrom, to: normalizedTo }
        : { from: normalizedTo, to: normalizedFrom };
};
const getSelectedDayCount = (value: DateRange | undefined) => {
    const bounds = getRangeBounds(value);
    if (!bounds) return undefined;

    const dayMillis = 24 * 60 * 60 * 1000;
    return Math.max(1, Math.round((bounds.to.getTime() - bounds.from.getTime()) / dayMillis) + 1);
};
const shiftRangeBySelection = (value: DateRange | undefined, diff: number): DateRange | undefined => {
    const bounds = getRangeBounds(value);
    if (!bounds) return undefined;

    const dayOffset = (getSelectedDayCount(value) ?? 1) * diff;
    return {
        from: addDays(bounds.from, dayOffset),
        to: addDays(bounds.to, dayOffset),
    };
};
const parseIso = (value: string): Date | undefined => {
    const matched = /^(\d{4})-(\d{2})-(\d{2})(?:\s*\([일월화수목금토]\))?$/.exec(value.trim());
    if (!matched) return undefined;

    const year = Number(matched[1]);
    const month = Number(matched[2]);
    const day = Number(matched[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined;

    return date;
};

const DateRangeCalendar = ({
    range,
    onChange,
    onPresetSelect,
    className,
    allowFutureDates = false,
    ...props
}: DateRangeCalendarProps) => {
    const today = React.useMemo(() => new Date(), []);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(range?.from ?? today);
    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(range);
    const [hoveredDay, setHoveredDay] = React.useState<Date | undefined>(undefined);
    const [fromInput, setFromInput] = React.useState('');
    const [toInput, setToInput] = React.useState('');
    const [fromError, setFromError] = React.useState(false);
    const [toError, setToError] = React.useState(false);
    const [isYearOpen, setIsYearOpen] = React.useState(false);
    const [isMonthOpen, setIsMonthOpen] = React.useState(false);

    const yearWrapRef = React.useRef<HTMLDivElement | null>(null);
    const monthWrapRef = React.useRef<HTMLDivElement | null>(null);

    const presetRanges = React.useMemo((): Record<PresetKey, DateRange> => {
        const startOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1);
        const endOfYear = (date: Date) => new Date(date.getFullYear(), 11, 31);
        const addDays = (date: Date, days: number) => {
            const next = new Date(date);
            next.setDate(next.getDate() + days);
            return next;
        };
        const subMonths = (date: Date, months: number) => {
            const next = new Date(date);
            const day = next.getDate();
            next.setDate(1);
            next.setMonth(next.getMonth() - months);
            const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
            next.setDate(Math.min(day, lastDay));
            return next;
        };
        const subYears = (date: Date, years: number) => {
            const next = new Date(date);
            next.setFullYear(next.getFullYear() - years);
            return next;
        };
        const startOfQuarter = (date: Date, quarter: 1 | 2 | 3 | 4) => new Date(date.getFullYear(), (quarter - 1) * 3, 1);
        const endOfQuarter = (date: Date, quarter: 1 | 2 | 3 | 4) => new Date(date.getFullYear(), quarter * 3, 0);

        const yesterday = addDays(today, -1);
        const thisMonthEnd = allowFutureDates ? endOfMonth(today) : today;

        return {
            YESTERDAY: { from: yesterday, to: yesterday },
            TODAY: { from: today, to: today },
            THIS_MONTH: { from: startOfMonth(today), to: thisMonthEnd },
            LAST_MONTH: { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) },
            LAST_7_DAYS: { from: addDays(today, -6), to: today },
            LAST_3_MONTHS: { from: startOfMonth(subMonths(today, 2)), to: today },
            LAST_6_MONTHS: { from: startOfMonth(subMonths(today, 5)), to: today },
            LAST_12_MONTHS: { from: startOfMonth(subMonths(today, 11)), to: today },
            THIS_YEAR: { from: startOfYear(today), to: endOfYear(today) },
            LAST_YEAR: { from: startOfYear(subYears(today, 1)), to: endOfYear(subYears(today, 1)) },
            Q1: { from: startOfQuarter(today, 1), to: endOfQuarter(today, 1) },
            Q2: { from: startOfQuarter(today, 2), to: endOfQuarter(today, 2) },
            Q3: { from: startOfQuarter(today, 3), to: endOfQuarter(today, 3) },
            Q4: { from: startOfQuarter(today, 4), to: endOfQuarter(today, 4) },
        };
    }, [allowFutureDates, today]);

    const years = React.useMemo(() => {
        const year = currentMonth.getFullYear();
        return Array.from({ length: 11 }, (_, index) => year - 5 + index);
    }, [currentMonth]);

    const months = React.useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);

    const rightMonths = React.useMemo(
        () =>
            Array.from({ length: 12 }, (_, index) => {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - index, 1);
                return {
                    key: `${date.getFullYear()}-${date.getMonth() + 1}`,
                    date,
                    label: `${date.getFullYear()}.${pad2(date.getMonth() + 1)}`,
                };
            }),
        [currentMonth]
    );

    const commitRange = React.useCallback(
        (nextRange: DateRange | undefined) => {
            setTempRange(nextRange);
            onChange(nextRange);
        },
        [onChange]
    );

    React.useEffect(() => {
        setTempRange(range);
        setHoveredDay(undefined);
        setCurrentMonth(range?.from ?? range?.to ?? today);
        setFromInput(formatInputDate(range?.from));
        setToInput(formatInputDate(range?.to));
        setFromError(false);
        setToError(false);
    }, [range, today]);

    React.useEffect(() => {
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            if (yearWrapRef.current?.contains(target) || monthWrapRef.current?.contains(target)) return;

            setIsYearOpen(false);
            setIsMonthOpen(false);
        };

        window.addEventListener('pointerdown', onPointerDown, { capture: true });
        return () => window.removeEventListener('pointerdown', onPointerDown, true);
    }, []);

    const applyInputsIfComplete = (fromValue: string, toValue: string) => {
        const from = parseIso(fromValue);
        const to = parseIso(toValue);
        if (!from || !to) return;

        const normalizedFrom = from <= to ? from : to;
        const normalizedTo = from <= to ? to : from;

        commitRange({ from: normalizedFrom, to: normalizedTo });
        setHoveredDay(undefined);
        setCurrentMonth(normalizedFrom);
    };

    const handleRangeSelect = (nextRange: DateRange | undefined, selectedDay?: Date) => {
        commitRange(nextRange);
        setHoveredDay(undefined);
        setFromInput(formatInputDate(nextRange?.from));
        setToInput(formatInputDate(nextRange?.to));
        setFromError(false);
        setToError(false);

        const monthAnchor = selectedDay ?? nextRange?.to ?? nextRange?.from;
        if (monthAnchor) setCurrentMonth(monthAnchor);
    };

    const handlePresetClick = (key: PresetKey) => {
        const nextRange = presetRanges[key];
        onPresetSelect?.(key);
        commitRange(nextRange);
        setHoveredDay(undefined);
        setCurrentMonth(nextRange.from ?? today);
        setFromInput(formatInputDate(nextRange.from));
        setToInput(formatInputDate(nextRange.to));
        setFromError(false);
        setToError(false);
    };

    const handlePrevMonth = () => {
        const nextRange = shiftRangeBySelection(tempRange ?? range, -1);
        if (!nextRange) return;

        commitRange(nextRange);
        setHoveredDay(undefined);
        setCurrentMonth(nextRange.from ?? today);
        setFromInput(formatInputDate(nextRange.from));
        setToInput(formatInputDate(nextRange.to));
        setFromError(false);
        setToError(false);
    };

    const handleNextMonth = () => {
        const nextRange = shiftRangeBySelection(tempRange ?? range, 1);
        if (!nextRange?.to || (!allowFutureDates && isAfterDay(nextRange.to, today))) return;

        commitRange(nextRange);
        setHoveredDay(undefined);
        setCurrentMonth(nextRange.from ?? today);
        setFromInput(formatInputDate(nextRange.from));
        setToInput(formatInputDate(nextRange.to));
        setFromError(false);
        setToError(false);
    };

    const nextRange = React.useMemo(() => shiftRangeBySelection(tempRange ?? range, 1), [range, tempRange]);
    const isNextDisabled = !nextRange?.to || (!allowFutureDates && isAfterDay(nextRange.to, today));

    const activePreset = React.useMemo(() => {
        const isSameDay = (a?: Date, b?: Date) =>
            !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

        const isSameRange = (a?: DateRange, b?: DateRange) => {
            if (!a?.from && !b?.from) return true;
            if (!a?.from || !b?.from) return false;
            const fromSame = isSameDay(a.from, b.from);
            const toSame = (!a.to && !b.to) || (a.to && b.to ? isSameDay(a.to, b.to) : false);
            return fromSame && toSame;
        };

        return (Object.keys(presetRanges) as PresetKey[]).find((key) => isSameRange(tempRange, presetRanges[key])) ?? null;
    }, [presetRanges, tempRange]);

    const yearValue = String(currentMonth.getFullYear());
    const monthValue = String(currentMonth.getMonth());
    const isSelectingRangeEnd = Boolean(
        tempRange?.from &&
            (!tempRange?.to || (tempRange.to && isSameDay(tempRange.from, tempRange.to)))
    );

    const previewRange = React.useMemo((): DateRange | undefined => {
        if (!isSelectingRangeEnd || !tempRange?.from || !hoveredDay) return undefined;
        if (isSameDay(tempRange.from, hoveredDay)) return undefined;

        const anchor = startOfDay(tempRange.from);
        const hover = startOfDay(hoveredDay);
        return anchor <= hover ? { from: anchor, to: hover } : { from: hover, to: anchor };
    }, [hoveredDay, isSelectingRangeEnd, tempRange?.from]);

    const isRangeStartDate = React.useCallback(
        (date: Date) => {
            if (!tempRange?.from) return false;
            return isSameDay(date, tempRange.from);
        },
        [tempRange?.from]
    );

    const isRangeEndDate = React.useCallback(
        (date: Date) => {
            if (!tempRange?.from || !tempRange?.to) return false;
            if (isSameDay(tempRange.from, tempRange.to)) return false;
            return isSameDay(date, tempRange.to);
        },
        [tempRange?.from, tempRange?.to]
    );

    const isDateInRange = React.useCallback(
        (date: Date) => {
            if (!tempRange?.from) return false;

            const target = startOfDay(date).getTime();
            const from = startOfDay(tempRange.from).getTime();
            const to = startOfDay(tempRange.to ?? tempRange.from).getTime();

            return target >= Math.min(from, to) && target <= Math.max(from, to);
        },
        [tempRange]
    );

    const isDateInPreviewRange = React.useCallback(
        (date: Date) => {
            if (!previewRange?.from || !previewRange?.to || !tempRange?.from) return false;

            const target = startOfDay(date).getTime();
            const from = startOfDay(previewRange.from).getTime();
            const to = startOfDay(previewRange.to).getTime();
            const anchor = startOfDay(tempRange.from).getTime();

            if (target === anchor) return false;
            return target >= Math.min(from, to) && target <= Math.max(from, to);
        },
        [previewRange, tempRange?.from]
    );

    const isRowRangeStart = React.useCallback(
        (date: Date) => {
            if (!isDateInRange(date)) return false;
            return date.getDay() === 0 || !isDateInRange(addDays(date, -1));
        },
        [isDateInRange]
    );

    const isRowRangeEnd = React.useCallback(
        (date: Date) => {
            if (!isDateInRange(date)) return false;
            return date.getDay() === 6 || !isDateInRange(addDays(date, 1));
        },
        [isDateInRange]
    );

    const isPreviewRowStart = React.useCallback(
        (date: Date) => {
            if (!isDateInPreviewRange(date)) return false;
            return date.getDay() === 0 || !isDateInPreviewRange(addDays(date, -1));
        },
        [isDateInPreviewRange]
    );

    const isPreviewRowEnd = React.useCallback(
        (date: Date) => {
            if (!isDateInPreviewRange(date)) return false;
            return date.getDay() === 6 || !isDateInPreviewRange(addDays(date, 1));
        },
        [isDateInPreviewRange]
    );

    return (
        <div className={classNames(styles.Root, className)}>
            <aside className={styles.LeftPreset}>
                {PRESETS.map((preset) => (
                    <button
                        key={preset.key}
                        type="button"
                        className={classNames(styles.PresetItem, activePreset === preset.key && styles.PresetItemActive)}
                        onClick={() => handlePresetClick(preset.key)}
                    >
                        {preset.label}
                    </button>
                ))}
            </aside>

            <section className={styles.Center}>
                <div className={styles.TopInputs}>
                    <div className={styles.InputBlock}>
                        <div className={styles.InputLabel}>시작일</div>
                        <div className={styles.InputWrap}>
                            <input
                                type="text"
                                className={classNames(styles.InputBox, fromError && styles.InputError)}
                                inputMode="numeric"
                                value={fromInput}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setFromInput(nextValue);
                                    const hasError = !nextValue ? false : !parseIso(nextValue);
                                    setFromError(hasError);
                                    if (!hasError) applyInputsIfComplete(nextValue, toInput);
                                }}
                                onBlur={() => {
                                    const hasError = !fromInput ? false : !parseIso(fromInput);
                                    setFromError(hasError);
                                    if (!hasError) {
                                        const parsed = parseIso(fromInput);
                                        setFromInput(parsed ? formatInputDate(parsed) : fromInput);
                                        applyInputsIfComplete(fromInput, toInput);
                                    }
                                }}
                                placeholder="YYYY-MM-DD (요일)"
                            />
                        </div>
                    </div>

                    <div className={styles.InputBlock}>
                        <div className={styles.InputLabel}>종료일</div>
                        <div className={styles.InputWrap}>
                            <input
                                type="text"
                                className={classNames(styles.InputBox, toError && styles.InputError)}
                                inputMode="numeric"
                                value={toInput}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setToInput(nextValue);
                                    const hasError = !nextValue ? false : !parseIso(nextValue);
                                    setToError(hasError);
                                    if (!hasError) applyInputsIfComplete(fromInput, nextValue);
                                }}
                                onBlur={() => {
                                    const hasError = !toInput ? false : !parseIso(toInput);
                                    setToError(hasError);
                                    if (!hasError) {
                                        const parsed = parseIso(toInput);
                                        setToInput(parsed ? formatInputDate(parsed) : toInput);
                                        applyInputsIfComplete(fromInput, toInput);
                                    }
                                }}
                                placeholder="YYYY-MM-DD (요일)"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.CalendarHeader}>
                    <button type="button" className={styles.NavButton} onClick={handlePrevMonth} aria-label="이전 기간">
                        <IoCaretBackSharp className={styles.NavIcon} />
                    </button>

                    <div className={styles.SelectGroup}>
                        <div className={styles.InlineSelectWrap} ref={monthWrapRef}>
                            <button
                                type="button"
                                className={styles.SelectTrigger}
                                onClick={() => {
                                    setIsMonthOpen((open) => !open);
                                    setIsYearOpen(false);
                                }}
                            >
                                <span className={styles.SelectLabel}>{Number(monthValue) + 1}월</span>
                                <IoIosArrowDown className={styles.Arrow} />
                            </button>

                            {isMonthOpen ? (
                                <div className={styles.SelectMenuInline}>
                                    <div className={styles.SelectMenuInner}>
                                        {months.map((month) => (
                                            <button
                                                key={month}
                                                type="button"
                                                className={classNames(
                                                    styles.SelectItem,
                                                    String(month) === monthValue && styles.SelectItemActive
                                                )}
                                                onClick={() => {
                                                    setCurrentMonth((prev) => new Date(prev.getFullYear(), month, 1));
                                                    setIsMonthOpen(false);
                                                }}
                                            >
                                                {month + 1}월
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className={styles.InlineSelectWrap} ref={yearWrapRef}>
                            <button
                                type="button"
                                className={styles.SelectTrigger}
                                onClick={() => {
                                    setIsYearOpen((open) => !open);
                                    setIsMonthOpen(false);
                                }}
                            >
                                <span className={styles.SelectLabel}>{yearValue}</span>
                                <IoIosArrowDown className={styles.Arrow} />
                            </button>

                            {isYearOpen ? (
                                <div className={styles.SelectMenuInline}>
                                    <div className={styles.SelectMenuInner}>
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                type="button"
                                                className={classNames(styles.SelectItem, String(year) === yearValue && styles.SelectItemActive)}
                                                onClick={() => {
                                                    setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1));
                                                    setIsYearOpen(false);
                                                }}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.NavButton}
                        onClick={handleNextMonth}
                        disabled={isNextDisabled}
                        aria-label="다음 기간"
                    >
                        <IoCaretForwardSharp className={styles.NavIcon} />
                    </button>
                </div>

                <div className={styles.CalendarBody}>
                    <DayPicker
                        locale={ko}
                        mode="range"
                        month={currentMonth}
                        numberOfMonths={1}
                        showOutsideDays
                        fixedWeeks
                        selected={tempRange}
                        onSelect={(nextRange, selectedDay) => handleRangeSelect(nextRange, selectedDay)}
                        onDayMouseEnter={(day, modifiers) => {
                            if (!isSelectingRangeEnd || modifiers.disabled) return;
                            setHoveredDay(day);
                        }}
                        onDayMouseLeave={() => {
                            if (!isSelectingRangeEnd) return;
                            setHoveredDay(undefined);
                        }}
                        onDayFocus={(day, modifiers) => {
                            if (!isSelectingRangeEnd || modifiers.disabled) return;
                            setHoveredDay(day);
                        }}
                        disabled={allowFutureDates ? undefined : { after: today }}
                        toMonth={allowFutureDates ? undefined : today}
                        modifiers={{
                            rowRangeStart: isRowRangeStart,
                            rowRangeEnd: isRowRangeEnd,
                            rowRangeSingle: (date) => isRowRangeStart(date) && isRowRangeEnd(date),
                            previewRange: isDateInPreviewRange,
                            previewRangeStart: isPreviewRowStart,
                            previewRangeEnd: isPreviewRowEnd,
                            previewRangeSingle: (date) => isPreviewRowStart(date) && isPreviewRowEnd(date),
                            rangeStartDate: isRangeStartDate,
                            rangeEndDate: isRangeEndDate,
                        }}
                        modifiersClassNames={{
                            rowRangeStart: styles.RowRangeStart,
                            rowRangeEnd: styles.RowRangeEnd,
                            rowRangeSingle: styles.RowRangeSingle,
                            previewRange: styles.PreviewRange,
                            previewRangeStart: styles.PreviewRangeStart,
                            previewRangeEnd: styles.PreviewRangeEnd,
                            previewRangeSingle: styles.PreviewRangeSingle,
                            rangeStartDate: styles.RangeStartDate,
                            rangeEndDate: styles.RangeEndDate,
                        }}
                        {...props}
                    />
                </div>
            </section>

            <aside className={styles.RightMonths}>
                {rightMonths.map((month) => {
                    const active = tempRange?.from ? isSameMonth(tempRange.from, month.date) : isSameMonth(currentMonth, month.date);
                    return (
                        <button
                            key={month.key}
                            type="button"
                            className={classNames(styles.MonthItem, active && styles.MonthItemActive)}
                            onClick={() => {
                                const from = startOfMonth(month.date);
                                const to = endOfMonth(month.date);
                                commitRange({ from, to });
                                setCurrentMonth(from);
                                setFromInput(formatInputDate(from));
                                setToInput(formatInputDate(to));
                                setFromError(false);
                                setToError(false);
                            }}
                        >
                            {month.label}
                        </button>
                    );
                })}
            </aside>
        </div>
    );
};

export default DateRangeCalendar;
