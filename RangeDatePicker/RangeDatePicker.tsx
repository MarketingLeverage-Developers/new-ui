// RangeDatePicker.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './RageDatePicker.module.scss';
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { IoIosArrowDown, IoMdWarning } from 'react-icons/io';
import { IoCaretBackSharp, IoCaretForwardSharp } from 'react-icons/io5';

import { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';

type PresetKey =
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

type RangeDatePickerProps = {
    range: DateRange;
    onChange: (r: DateRange | undefined) => void;
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month' | 'numberOfMonths'>;

const YearMenu = ({ years, activeValue }: { years: number[]; activeValue: string }) => {
    const { close } = useDropdown();
    return (
        <div className={styles.SelectMenuInner}>
            {years.map((y) => (
                <Select.Item
                    key={y}
                    value={String(y)}
                    className={`${styles.SelectItem} ${String(y) === activeValue ? styles.SelectItemActive : ''}`}
                    onClick={() => close()}
                    role="menuitem"
                    tabIndex={0}
                >
                    {y}
                </Select.Item>
            ))}
        </div>
    );
};

const MonthMenu = ({ months, activeValue }: { months: number[]; activeValue: string }) => {
    const { close } = useDropdown();
    return (
        <div className={styles.SelectMenuInner}>
            {months.map((m) => (
                <Select.Item
                    key={m}
                    value={String(m)}
                    className={`${styles.SelectItem} ${String(m) === activeValue ? styles.SelectItemActive : ''}`}
                    onClick={() => close()}
                    role="menuitem"
                    tabIndex={0}
                >
                    {m + 1}월
                </Select.Item>
            ))}
        </div>
    );
};

const RangeDatePicker = ({ range, onChange, ...props }: RangeDatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(range?.from ?? new Date());
    const [tempRange, setTempRange] = useState<DateRange | undefined>(range);

    const [fromInput, setFromInput] = useState<string>('');
    const [toInput, setToInput] = useState<string>('');

    const [fromError, setFromError] = useState<boolean>(false);
    const [toError, setToError] = useState<boolean>(false);

    const pad2 = (n: number) => String(n).padStart(2, '0');
    const formatIso = (d?: Date) => (d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : '');

    const weekdayKo = (d: Date) => {
        const map = ['일', '월', '화', '수', '목', '금', '토'] as const;
        return map[d.getDay()];
    };

    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const parseIso = (value: string): Date | undefined => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
        if (!m) return undefined;

        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);

        if (mo < 1 || mo > 12) return undefined;
        if (d < 1 || d > 31) return undefined;

        const dt = new Date(y, mo - 1, d);
        if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return undefined;

        return dt;
    };

    const computeError = (value: string) => {
        if (!value) return false;
        return !parseIso(value);
    };

    const weekdayLabel = (value: string) => {
        const d = parseIso(value);
        if (!d) return '';
        return `(${weekdayKo(d)})`;
    };

    const commitRange = (next: DateRange | undefined) => {
        setTempRange(next);
        onChange(next);
    };

    useEffect(() => {
        setTempRange(range);
        setCurrentMonth(range?.from ?? new Date());

        const nextFrom = formatIso(range?.from);
        const nextTo = formatIso(range?.to);

        setFromInput(nextFrom);
        setToInput(nextTo);

        setFromError(computeError(nextFrom));
        setToError(computeError(nextTo));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range]);

    const handleSelectRange = (r: DateRange | undefined) => {
        commitRange(r);

        const nextFrom = formatIso(r?.from);
        const nextTo = formatIso(r?.to);

        setFromInput(nextFrom);
        setToInput(nextTo);

        setFromError(false);
        setToError(false);

        if (r?.from) setCurrentMonth(r.from);
    };

    const applyInputsIfComplete = (nextFrom: string, nextTo: string) => {
        const from = parseIso(nextFrom);
        const to = parseIso(nextTo);
        if (!from || !to) return;

        const realFrom = from <= to ? from : to;
        const realTo = from <= to ? to : from;

        commitRange({ from: realFrom, to: realTo });
        setCurrentMonth(realFrom);
    };

    const today = useMemo(() => new Date(), []);

    const presetRanges = useMemo((): Record<PresetKey, DateRange> => {
        const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1);
        const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31);

        const addDays = (d: Date, n: number) => {
            const x = new Date(d);
            x.setDate(x.getDate() + n);
            return x;
        };

        const subMonths = (d: Date, n: number) => {
            const x = new Date(d);
            x.setMonth(x.getMonth() - n);
            return x;
        };

        const subYears = (d: Date, n: number) => {
            const x = new Date(d);
            x.setFullYear(x.getFullYear() - n);
            return x;
        };

        const startOfQuarter = (d: Date, quarter: 1 | 2 | 3 | 4) => new Date(d.getFullYear(), (quarter - 1) * 3, 1);
        const endOfQuarter = (d: Date, quarter: 1 | 2 | 3 | 4) => new Date(d.getFullYear(), quarter * 3, 0);

        const y = addDays(today, -1);

        return {
            YESTERDAY: { from: y, to: y },
            TODAY: { from: today, to: today },
            THIS_MONTH: { from: startOfMonth(today), to: endOfMonth(today) },
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
    }, [today]);

    const presets = useMemo(
        () =>
            [
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
            ] as const,
        []
    );

    const isSameDay = (a?: Date, b?: Date) => {
        if (!a || !b) return false;
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    };

    const isSameRange = (a?: DateRange, b?: DateRange) => {
        if (!a?.from && !b?.from) return true;
        if (!a?.from || !b?.from) return false;
        const fromSame = isSameDay(a.from, b.from);
        const toSame = (!a.to && !b.to) || (a.to && b.to ? isSameDay(a.to, b.to) : false);
        return fromSame && toSame;
    };

    const activePreset = useMemo(
        () => (Object.keys(presetRanges) as PresetKey[]).find((k) => isSameRange(tempRange, presetRanges[k])) ?? null,
        [presetRanges, tempRange]
    );

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            const x = new Date(prev);
            x.setMonth(x.getMonth() - 1);
            return x;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            const x = new Date(prev);
            x.setMonth(x.getMonth() + 1);
            return x;
        });
    };

    const handleClickPreset = (key: PresetKey) => {
        const next = presetRanges[key];

        commitRange(next);
        setCurrentMonth(next.from ?? new Date());

        setFromInput(formatIso(next.from));
        setToInput(formatIso(next.to));

        setFromError(false);
        setToError(false);
    };

    const years = useMemo(() => {
        const y = currentMonth.getFullYear();
        return Array.from({ length: 11 }, (_, i) => y - 5 + i);
    }, [currentMonth]);

    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

    const handleYearChange = (y: number) => {
        setCurrentMonth((prev) => new Date(y, prev.getMonth(), 1));
    };

    const handleMonthChange = (m: number) => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), m, 1));
    };

    const sideMonths = useMemo(() => {
        const y = currentMonth.getFullYear();
        return Array.from({ length: 12 }, (_, idx) => 11 - idx).map((m) => {
            const d = new Date(y, m, 1);
            return { key: `${y}.${pad2(m + 1)}`, date: d, label: `${y}.${pad2(m + 1)}` };
        });
    }, [currentMonth]);

    const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

    const handleClickSideMonth = (date: Date) => {
        const from = startOfMonth(date);
        const to = endOfMonth(date);

        commitRange({ from, to });
        setCurrentMonth(from);

        setFromInput(formatIso(from));
        setToInput(formatIso(to));

        setFromError(false);
        setToError(false);
    };

    const yearValue = String(currentMonth.getFullYear());
    const monthValue = String(currentMonth.getMonth());

    const fromWeekday = !fromError ? weekdayLabel(fromInput) : '';
    const toWeekday = !toError ? weekdayLabel(toInput) : '';

    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);

    const yearWrapRef = useRef<HTMLDivElement | null>(null);
    const monthWrapRef = useRef<HTMLDivElement | null>(null);

    // 바깥 클릭 시 닫기
    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node | null;
            if (!t) return;

            if (yearWrapRef.current?.contains(t)) return;
            if (monthWrapRef.current?.contains(t)) return;

            setIsYearOpen(false);
            setIsMonthOpen(false);
        };

        window.addEventListener('pointerdown', onPointerDown, { capture: true });
        return () => window.removeEventListener('pointerdown', onPointerDown, true);
    }, []);

    return (
        <div className={styles.Root}>
            <aside className={styles.LeftPreset}>
                {presets.map((p) => {
                    const isActive = activePreset === (p.key as PresetKey);
                    return (
                        <button
                            key={p.key}
                            type="button"
                            className={`${styles.PresetItem} ${isActive ? styles.PresetItemActive : ''}`}
                            onClick={() => handleClickPreset(p.key as PresetKey)}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </aside>

            <section className={styles.Center}>
                <div className={styles.TopInputs}>
                    <div className={styles.InputBlock}>
                        <div className={styles.InputLabel}>시작일</div>

                        <div className={styles.InputWrap}>
                            <input
                                className={`${styles.InputBox} ${fromError ? styles.InputError : ''}`}
                                type="text"
                                inputMode="numeric"
                                value={fromInput}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setFromInput(v);

                                    const err = computeError(v);
                                    setFromError(err);

                                    if (!err) applyInputsIfComplete(v, toInput);
                                }}
                                onBlur={() => {
                                    const err = computeError(fromInput);
                                    setFromError(err);
                                    if (!err) applyInputsIfComplete(fromInput, toInput);
                                }}
                                placeholder="YYYY-MM-DD"
                            />

                            {!!fromWeekday && (
                                <span className={styles.WeekdaySuffix} aria-hidden="true">
                                    {fromWeekday}
                                </span>
                            )}

                            {fromError && (
                                <span className={styles.WarningIcon} aria-hidden="true">
                                    <IoMdWarning />
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.InputBlock}>
                        <div className={styles.InputLabel}>종료일</div>

                        <div className={styles.InputWrap}>
                            <input
                                className={`${styles.InputBox} ${toError ? styles.InputError : ''}`}
                                type="text"
                                inputMode="numeric"
                                value={toInput}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setToInput(v);

                                    const err = computeError(v);
                                    setToError(err);

                                    if (!err) applyInputsIfComplete(fromInput, v);
                                }}
                                onBlur={() => {
                                    const err = computeError(toInput);
                                    setToError(err);
                                    if (!err) applyInputsIfComplete(fromInput, toInput);
                                }}
                                placeholder="YYYY-MM-DD"
                            />

                            {!!toWeekday && (
                                <span className={styles.WeekdaySuffix} aria-hidden="true">
                                    {toWeekday}
                                </span>
                            )}

                            {toError && (
                                <span className={styles.WarningIcon} aria-hidden="true">
                                    <IoMdWarning />
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.CalendarHeader}>
                    <button type="button" className={styles.NavButton} onClick={handlePrevMonth}>
                        <IoCaretBackSharp className={styles.NavIcon} />
                    </button>

                    <div className={styles.SelectGroup}>
                        {/* Year - 인라인 메뉴(포탈 X) */}
                        <div className={styles.InlineSelectWrap} ref={yearWrapRef}>
                            <button
                                type="button"
                                className={styles.SelectTrigger}
                                onClick={() => {
                                    setIsYearOpen((v) => !v);
                                    setIsMonthOpen(false);
                                }}
                            >
                                <span className={styles.SelectLabel}>{yearValue}</span>
                                <IoIosArrowDown className={styles.Arrow} />
                            </button>

                            {isYearOpen && (
                                <div className={styles.SelectMenuInline} role="menu">
                                    <div className={styles.SelectMenuInner}>
                                        {years.map((y) => (
                                            <button
                                                key={y}
                                                type="button"
                                                className={`${styles.SelectItem} ${
                                                    String(y) === yearValue ? styles.SelectItemActive : ''
                                                }`}
                                                onClick={() => {
                                                    handleYearChange(y);
                                                    setIsYearOpen(false);
                                                }}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Month - 인라인 메뉴(포탈 X) */}
                        <div className={styles.InlineSelectWrap} ref={monthWrapRef}>
                            <button
                                type="button"
                                className={styles.SelectTrigger}
                                onClick={() => {
                                    setIsMonthOpen((v) => !v);
                                    setIsYearOpen(false);
                                }}
                            >
                                <span className={styles.SelectLabel}>{Number(monthValue) + 1}월</span>
                                <IoIosArrowDown className={styles.Arrow} />
                            </button>

                            {isMonthOpen && (
                                <div className={styles.SelectMenuInline} role="menu">
                                    <div className={styles.SelectMenuInner}>
                                        {months.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`${styles.SelectItem} ${
                                                    String(m) === monthValue ? styles.SelectItemActive : ''
                                                }`}
                                                onClick={() => {
                                                    handleMonthChange(m);
                                                    setIsMonthOpen(false);
                                                }}
                                            >
                                                {m + 1}월
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="button" className={styles.NavButton} onClick={handleNextMonth}>
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
                        onSelect={handleSelectRange}
                        {...props}
                    />
                </div>
            </section>

            <aside className={styles.RightMonths}>
                {sideMonths.map((m) => {
                    const active = tempRange?.from
                        ? isSameMonth(tempRange.from, m.date)
                        : isSameMonth(currentMonth, m.date);

                    return (
                        <button
                            key={m.key}
                            type="button"
                            className={`${styles.MonthItem} ${active ? styles.MonthItemActive : ''}`}
                            onClick={() => handleClickSideMonth(m.date)}
                        >
                            {m.label}
                        </button>
                    );
                })}
            </aside>
        </div>
    );
};

export default RangeDatePicker;
