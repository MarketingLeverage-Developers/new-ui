import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { DayPicker, type DayPickerProps, type MonthCaptionProps } from 'react-day-picker';
import 'react-day-picker/style.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import styles from './MiniCalendar.module.scss';

export type MiniCalendarExtraProps = {
    className?: string;
};

export type MiniCalendarProps = DayPickerProps & MiniCalendarExtraProps;

const WEEKDAY_KO_SHORT = ['일', '월', '화', '수', '목', '금', '토'] as const;

const formatMonthLabelParts = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    return { y, m };
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const addMonths = (d: Date, diff: number) => {
    const next = new Date(d);
    next.setMonth(next.getMonth() + diff);
    return startOfMonth(next);
};

const clampMonthByRange = (target: Date, fromMonth?: Date, toMonth?: Date) => {
    const t = startOfMonth(target);
    const from = fromMonth ? startOfMonth(fromMonth) : undefined;
    const to = toMonth ? startOfMonth(toMonth) : undefined;

    if (from && t < from) return from;
    if (to && t > to) return to;
    return t;
};

const getMonthCaptionDate = (props: MonthCaptionProps): Date => {
    const cm = (props as unknown as { calendarMonth?: { date?: Date } }).calendarMonth;
    return cm?.date ?? new Date();
};

const MiniCalendar: React.FC<MiniCalendarProps> = (props) => {
    const { className, month, onMonthChange, fromMonth, toMonth, ...rest } = props;

    const rootClassName = classNames(styles.MiniCalendar, className);

    const isControlled = month !== undefined;
    const [innerMonth, setInnerMonth] = useState<Date>(() => startOfMonth(new Date()));

    const currentMonth = useMemo(() => {
        const base = (isControlled ? (month as Date) : innerMonth) ?? new Date();
        return clampMonthByRange(base, fromMonth, toMonth);
    }, [fromMonth, innerMonth, isControlled, month, toMonth]);

    const commitMonth = useCallback(
        (next: Date) => {
            const clamped = clampMonthByRange(next, fromMonth, toMonth);
            if (!isControlled) setInnerMonth(clamped);
            onMonthChange?.(clamped);
        },
        [fromMonth, isControlled, onMonthChange, toMonth]
    );

    const canPrev = useMemo(() => {
        if (!fromMonth) return true;
        return addMonths(currentMonth, -1) >= startOfMonth(fromMonth);
    }, [currentMonth, fromMonth]);

    const canNext = useMemo(() => {
        if (!toMonth) return true;
        return addMonths(currentMonth, 1) <= startOfMonth(toMonth);
    }, [currentMonth, toMonth]);

    const handlePrev = useCallback(() => {
        if (!canPrev) return;
        commitMonth(addMonths(currentMonth, -1));
    }, [canPrev, commitMonth, currentMonth]);

    const handleNext = useCallback(() => {
        if (!canNext) return;
        commitMonth(addMonths(currentMonth, 1));
    }, [canNext, commitMonth, currentMonth]);

    const MonthCaption = (captionProps: MonthCaptionProps): React.ReactElement => {
        const monthDate = getMonthCaptionDate(captionProps);
        const { y, m } = formatMonthLabelParts(monthDate);

        return (
            <div className={styles.CaptionRow}>
                <div className={styles.CaptionLabel}>
                    <span>{y}년</span>
                    <span className={styles.MonthNumber}>{m}</span>
                    <span>월</span>
                </div>
                <div className={styles.NavGroup}>
                    <button
                        type="button"
                        className={styles.NavButton}
                        onClick={handlePrev}
                        disabled={!canPrev}
                        aria-label="이전 달"
                    >
                        <MdKeyboardArrowLeft className={styles.NavIcon} aria-hidden />
                    </button>
                    <button
                        type="button"
                        className={styles.NavButton}
                        onClick={handleNext}
                        disabled={!canNext}
                        aria-label="다음 달"
                    >
                        <MdKeyboardArrowRight className={styles.NavIcon} aria-hidden />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={rootClassName}>
            <DayPicker
                showOutsideDays
                fixedWeeks
                weekStartsOn={0}
                month={currentMonth}
                onMonthChange={(next) => commitMonth(next)}
                fromMonth={fromMonth}
                toMonth={toMonth}
                formatters={{
                    formatWeekdayName: (date) => WEEKDAY_KO_SHORT[date.getDay()],
                }}
                classNames={{
                    root: styles.RdpRoot,
                    months: styles.Months,
                    month: styles.Month,
                    month_caption: styles.Caption,
                    caption_label: styles.CaptionLabel,
                    nav: styles.NavHidden,
                    weekdays: styles.Weekdays,
                    weekday: styles.Weekday,
                    weeks: styles.Weeks,
                    week: styles.Week,
                    day: styles.Day,
                    day_button: styles.DayButton,
                    month_grid: styles.MonthGrid,
                    selected: styles.DaySelected,
                    range_start: styles.DaySelected,
                    range_middle: styles.DaySelected,
                    range_end: styles.DaySelected,
                    outside: styles.DayOutside,
                    disabled: styles.DayDisabled,
                    today: styles.DayToday,
                }}
                components={{
                    MonthCaption,
                }}
                {...rest}
            />
        </div>
    );
};

export default MiniCalendar;
