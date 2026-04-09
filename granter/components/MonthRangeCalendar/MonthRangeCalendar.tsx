import React from 'react';
import classNames from 'classnames';
import { type DateRange } from 'react-day-picker';
import { IoIosArrowDown } from 'react-icons/io';
import { IoCaretBackSharp, IoCaretForwardSharp } from 'react-icons/io5';
import styles from './MonthRangeCalendar.module.scss';

export type MonthRangeCalendarPresetKey =
    | 'THIS_MONTH'
    | 'LAST_MONTH'
    | 'LAST_3_MONTHS'
    | 'LAST_6_MONTHS'
    | 'LAST_12_MONTHS'
    | 'THIS_YEAR'
    | 'LAST_YEAR'
    | 'Q1'
    | 'Q2'
    | 'Q3'
    | 'Q4';

type PresetKey = MonthRangeCalendarPresetKey;

export type MonthRangeCalendarProps = {
    range: DateRange;
    onChange: (next: DateRange | undefined) => void;
    onPresetSelect?: (key: PresetKey) => void;
    className?: string;
    allowFutureDates?: boolean;
};

const PRESETS: { key: PresetKey; label: string }[] = [
    { key: 'THIS_MONTH', label: '이번 달' },
    { key: 'LAST_MONTH', label: '지난 달' },
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

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) => `${index + 1}월`);

const pad2 = (value: number) => String(value).padStart(2, '0');
const formatMonthValue = (date?: Date) => (date ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}` : '');
const formatRecentMonthLabel = (date: Date) => `${date.getFullYear()}.${pad2(date.getMonth() + 1)}`;
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

const isSameMonth = (a?: Date, b?: Date) =>
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();

const isAfterMonth = (a: Date, b: Date) =>
    a.getFullYear() > b.getFullYear() || (a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth());

const isMonthWithin = (target: Date, from?: Date, to?: Date) => {
    if (!from || !to) return false;
    const start = startOfMonth(from).getTime();
    const end = startOfMonth(to).getTime();
    const current = startOfMonth(target).getTime();
    return current >= Math.min(start, end) && current <= Math.max(start, end);
};

const parseMonthValue = (value: string): Date | undefined => {
    const matched = /^(\d{4})-(\d{2})$/.exec(value.trim());
    if (!matched) return undefined;

    const year = Number(matched[1]);
    const month = Number(matched[2]);
    if (month < 1 || month > 12) return undefined;

    return new Date(year, month - 1, 1);
};

const isSameRange = (a?: DateRange, b?: DateRange) => {
    const aFrom = a?.from ? startOfMonth(a.from).getTime() : null;
    const aTo = a?.to ? endOfMonth(a.to).getTime() : null;
    const bFrom = b?.from ? startOfMonth(b.from).getTime() : null;
    const bTo = b?.to ? endOfMonth(b.to).getTime() : null;
    return aFrom === bFrom && aTo === bTo;
};

const normalizeMonthRange = (from: Date, to: Date): DateRange => {
    const start = isAfterMonth(from, to) ? to : from;
    const end = isAfterMonth(from, to) ? from : to;
    return {
        from: startOfMonth(start),
        to: endOfMonth(end),
    };
};

const MonthRangeCalendar = ({
    range,
    onChange,
    onPresetSelect,
    className,
    allowFutureDates = false,
}: MonthRangeCalendarProps) => {
    const today = React.useMemo(() => new Date(), []);
    const [currentYear, setCurrentYear] = React.useState<number>((range?.from ?? today).getFullYear());
    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(range);
    const [pendingStartMonth, setPendingStartMonth] = React.useState<Date | undefined>(undefined);
    const [hoveredMonth, setHoveredMonth] = React.useState<Date | undefined>(undefined);
    const [fromInput, setFromInput] = React.useState('');
    const [toInput, setToInput] = React.useState('');
    const [fromError, setFromError] = React.useState(false);
    const [toError, setToError] = React.useState(false);
    const [isYearOpen, setIsYearOpen] = React.useState(false);

    const yearWrapRef = React.useRef<HTMLDivElement | null>(null);

    const presetRanges = React.useMemo((): Record<PresetKey, DateRange> => {
        const currentMonth = startOfMonth(today);
        const previousMonth = addMonths(currentMonth, -1);
        const currentYear = today.getFullYear();

        return {
            THIS_MONTH: { from: startOfMonth(currentMonth), to: endOfMonth(currentMonth) },
            LAST_MONTH: { from: startOfMonth(previousMonth), to: endOfMonth(previousMonth) },
            LAST_3_MONTHS: normalizeMonthRange(addMonths(currentMonth, -2), currentMonth),
            LAST_6_MONTHS: normalizeMonthRange(addMonths(currentMonth, -5), currentMonth),
            LAST_12_MONTHS: normalizeMonthRange(addMonths(currentMonth, -11), currentMonth),
            THIS_YEAR: {
                from: new Date(currentYear, 0, 1),
                to: new Date(currentYear, 11, 31),
            },
            LAST_YEAR: {
                from: new Date(currentYear - 1, 0, 1),
                to: new Date(currentYear - 1, 11, 31),
            },
            Q1: { from: new Date(currentYear, 0, 1), to: new Date(currentYear, 2, 31) },
            Q2: { from: new Date(currentYear, 3, 1), to: new Date(currentYear, 5, 30) },
            Q3: { from: new Date(currentYear, 6, 1), to: new Date(currentYear, 8, 30) },
            Q4: { from: new Date(currentYear, 9, 1), to: new Date(currentYear, 11, 31) },
        };
    }, [today]);

    const years = React.useMemo(
        () => Array.from({ length: 11 }, (_, index) => currentYear - 5 + index),
        [currentYear]
    );

    const recentMonths = React.useMemo(
        () =>
            Array.from({ length: 12 }, (_, index) => {
                const date = addMonths(startOfMonth(today), -index);
                return {
                    key: `${date.getFullYear()}-${date.getMonth() + 1}`,
                    date,
                    label: formatRecentMonthLabel(date),
                };
            }),
        [today]
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
        setPendingStartMonth((prev) => {
            const fromMonth = range?.from ? startOfMonth(range.from) : undefined;
            const toMonth = range?.to ? startOfMonth(range.to) : fromMonth;

            if (!fromMonth || !toMonth) return undefined;
            if (!isSameMonth(fromMonth, toMonth)) return undefined;
            if (prev && isSameMonth(prev, fromMonth)) return prev;

            return undefined;
        });
        setHoveredMonth(undefined);
        setCurrentYear((range?.from ?? today).getFullYear());
        setFromInput(formatMonthValue(range?.from));
        setToInput(formatMonthValue(range?.to));
        setFromError(false);
        setToError(false);
    }, [range, today]);

    React.useEffect(() => {
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            if (yearWrapRef.current?.contains(target)) return;
            setIsYearOpen(false);
        };

        window.addEventListener('pointerdown', onPointerDown, { capture: true });
        return () => window.removeEventListener('pointerdown', onPointerDown, true);
    }, []);

    const applyInputsIfComplete = (fromValue: string, toValue: string) => {
        const fromMonth = parseMonthValue(fromValue);
        const toMonth = parseMonthValue(toValue);
        if (!fromMonth || !toMonth) return;

        const nextRange = normalizeMonthRange(fromMonth, toMonth);
        commitRange(nextRange);
        setPendingStartMonth(undefined);
        setHoveredMonth(undefined);
        setCurrentYear((nextRange.from ?? fromMonth).getFullYear());
    };

    const handlePresetClick = (key: PresetKey) => {
        const nextRange = presetRanges[key];
        onPresetSelect?.(key);
        commitRange(nextRange);
        setPendingStartMonth(undefined);
        setHoveredMonth(undefined);
        setCurrentYear((nextRange.from ?? today).getFullYear());
        setFromInput(formatMonthValue(nextRange.from));
        setToInput(formatMonthValue(nextRange.to));
        setFromError(false);
        setToError(false);
    };

    const handleMonthClick = (date: Date) => {
        if (!allowFutureDates && isAfterMonth(date, today)) return;

        if (pendingStartMonth && !isSameMonth(pendingStartMonth, date)) {
            const nextRange = normalizeMonthRange(pendingStartMonth, date);
            commitRange(nextRange);
            setPendingStartMonth(undefined);
            setHoveredMonth(undefined);
            setFromInput(formatMonthValue(nextRange.from));
            setToInput(formatMonthValue(nextRange.to));
        } else {
            const nextRange = {
                from: startOfMonth(date),
                to: endOfMonth(date),
            };
            commitRange(nextRange);
            setPendingStartMonth(date);
            setHoveredMonth(undefined);
            setFromInput(formatMonthValue(nextRange.from));
            setToInput(formatMonthValue(nextRange.to));
        }

        setCurrentYear(date.getFullYear());
        setFromError(false);
        setToError(false);
    };

    const previewRange = React.useMemo(() => {
        if (!pendingStartMonth || !hoveredMonth || isSameMonth(pendingStartMonth, hoveredMonth)) return undefined;
        return normalizeMonthRange(pendingStartMonth, hoveredMonth);
    }, [hoveredMonth, pendingStartMonth]);

    const activePreset = React.useMemo(
        () => (Object.keys(presetRanges) as PresetKey[]).find((key) => isSameRange(tempRange, presetRanges[key])) ?? null,
        [presetRanges, tempRange]
    );

    const isNextDisabled = !allowFutureDates && currentYear >= today.getFullYear();
    const selectedFromMonth = tempRange?.from ? startOfMonth(tempRange.from) : undefined;
    const selectedToMonth = tempRange?.to ? startOfMonth(tempRange.to) : selectedFromMonth;
    const previewFromMonth = previewRange?.from ? startOfMonth(previewRange.from) : undefined;
    const previewToMonth = previewRange?.to ? startOfMonth(previewRange.to) : undefined;
    const yearValue = String(currentYear);

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
                        <div className={styles.InputLabel}>시작월</div>
                        <div className={styles.InputWrap}>
                            <input
                                type="text"
                                className={classNames(styles.InputBox, fromError && styles.InputError)}
                                inputMode="numeric"
                                value={fromInput}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setFromInput(nextValue);
                                    const hasError = !nextValue ? false : !parseMonthValue(nextValue);
                                    setFromError(hasError);
                                    if (!hasError) applyInputsIfComplete(nextValue, toInput);
                                }}
                                onBlur={() => {
                                    const hasError = !fromInput ? false : !parseMonthValue(fromInput);
                                    setFromError(hasError);
                                    if (!hasError) applyInputsIfComplete(fromInput, toInput);
                                }}
                                placeholder="YYYY-MM"
                            />
                        </div>
                    </div>

                    <div className={styles.InputBlock}>
                        <div className={styles.InputLabel}>종료월</div>
                        <div className={styles.InputWrap}>
                            <input
                                type="text"
                                className={classNames(styles.InputBox, toError && styles.InputError)}
                                inputMode="numeric"
                                value={toInput}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setToInput(nextValue);
                                    const hasError = !nextValue ? false : !parseMonthValue(nextValue);
                                    setToError(hasError);
                                    if (!hasError) applyInputsIfComplete(fromInput, nextValue);
                                }}
                                onBlur={() => {
                                    const hasError = !toInput ? false : !parseMonthValue(toInput);
                                    setToError(hasError);
                                    if (!hasError) applyInputsIfComplete(fromInput, toInput);
                                }}
                                placeholder="YYYY-MM"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.CalendarHeader}>
                    <button type="button" className={styles.NavButton} onClick={() => setCurrentYear((prev) => prev - 1)} aria-label="이전 연도">
                        <IoCaretBackSharp className={styles.NavIcon} />
                    </button>

                    <div className={styles.SelectGroup}>
                        <div className={styles.InlineSelectWrap} ref={yearWrapRef}>
                            <button
                                type="button"
                                className={styles.SelectTrigger}
                                onClick={() => setIsYearOpen((open) => !open)}
                            >
                                <span className={styles.SelectLabel}>{yearValue}년</span>
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
                                                    setCurrentYear(year);
                                                    setIsYearOpen(false);
                                                }}
                                            >
                                                {year}년
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
                        onClick={() => setCurrentYear((prev) => prev + 1)}
                        disabled={isNextDisabled}
                        aria-label="다음 연도"
                    >
                        <IoCaretForwardSharp className={styles.NavIcon} />
                    </button>
                </div>

                <div className={styles.MonthGridWrap}>
                    <div className={styles.MonthGrid}>
                        {MONTH_LABELS.map((label, monthIndex) => {
                            const monthDate = new Date(currentYear, monthIndex, 1);
                            const disabled = !allowFutureDates && isAfterMonth(monthDate, today);
                            const isInSelectedRange = isMonthWithin(monthDate, selectedFromMonth, selectedToMonth);
                            const isRangeStart = isSameMonth(monthDate, selectedFromMonth);
                            const isRangeEnd = isSameMonth(monthDate, selectedToMonth);
                            const isRangeSingle = isRangeStart && isRangeEnd;
                            const isInPreviewRange = isMonthWithin(monthDate, previewFromMonth, previewToMonth);
                            const isPreviewStart = isSameMonth(monthDate, previewFromMonth);
                            const isPreviewEnd = isSameMonth(monthDate, previewToMonth);
                            const isPreviewSingle = isPreviewStart && isPreviewEnd;

                            return (
                                <button
                                    key={`${currentYear}-${monthIndex}`}
                                    type="button"
                                    className={classNames(
                                        styles.MonthButton,
                                        disabled && styles.MonthButtonDisabled,
                                        isInSelectedRange && styles.MonthButtonInRange,
                                        !isRangeSingle && isRangeStart && styles.MonthButtonRangeStart,
                                        !isRangeSingle && isRangeEnd && styles.MonthButtonRangeEnd,
                                        isRangeSingle && styles.MonthButtonRangeSingle,
                                        !isRangeSingle && !isInSelectedRange && isInPreviewRange && styles.MonthButtonPreview,
                                        !isRangeSingle && isInPreviewRange && isPreviewStart && styles.MonthButtonPreviewStart,
                                        !isRangeSingle && isInPreviewRange && isPreviewEnd && styles.MonthButtonPreviewEnd,
                                        isPreviewSingle && styles.MonthButtonPreviewSingle
                                    )
                                    }
                                    disabled={disabled}
                                    onClick={() => handleMonthClick(monthDate)}
                                    onMouseEnter={() => {
                                        if (!pendingStartMonth || disabled) return;
                                        setHoveredMonth(monthDate);
                                    }}
                                    onMouseLeave={() => {
                                        if (!pendingStartMonth) return;
                                        setHoveredMonth(undefined);
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <aside className={styles.RightMonths}>
                {recentMonths.map((month) => (
                    <button
                        key={month.key}
                        type="button"
                        className={classNames(
                            styles.MonthItem,
                            isMonthWithin(month.date, selectedFromMonth, selectedToMonth) && styles.MonthItemActive
                        )}
                        onClick={() => handleMonthClick(month.date)}
                    >
                        {month.label}
                    </button>
                ))}
            </aside>
        </div>
    );
};

export default MonthRangeCalendar;
