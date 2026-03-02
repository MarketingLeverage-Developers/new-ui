import { extractISO, fmt, isOverlap, sameDay, toDate } from '../../utils/dateFilter/dateFilter';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

type UseDateFilterProps<T extends { period: string }> = {
    item?: T[];
    startDate?: string | null;
    endDate?: string | null;
    resetStart?: () => void;
    resetEnd?: () => void;
};

export const useDateFilter = <T extends { period: string }>({
    item,
    startDate,
    endDate,
    resetStart,
    resetEnd,
}: UseDateFilterProps<T>): T[] | undefined => {
    const filtered = useMemo(() => {
        if (!item) return item;
        if (!startDate || !endDate) return item;

        const selStart = toDate(startDate);
        const selEnd = toDate(endDate);

        return item.filter((it) => {
            const r = extractISO(it.period);
            if (!r) return false;
            const itemStart = toDate(r.startISO);
            const itemEnd = toDate(r.endISO);
            return isOverlap(itemStart, itemEnd, selStart, selEnd);
        });
    }, [item, startDate, endDate]);

    useEffect(
        () => () => {
            resetStart?.();
            resetEnd?.();
        },
        [resetStart, resetEnd]
    );

    return filtered;
};

type useDateSelectProps = {
    startDate?: string;
    endDate?: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    resetStart: () => void;
    resetEnd: () => void;
    defaultValue?: string;
    // range: DateRange | undefined;
    // setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export const useDateSelect = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    resetStart,
    resetEnd,
    defaultValue = '날짜 선택',
}: // range,
// setRange,
useDateSelectProps) => {
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    useEffect(() => {
        if (!startDate || !endDate) return;
        const from = new Date(startDate);
        const to = new Date(endDate);

        const curFromStr = range?.from ? fmt(range.from) : undefined;
        const curToStr = range?.to ? fmt(range.to) : undefined;
        if (!sameDay(curFromStr, startDate) || !sameDay(curToStr, endDate)) {
            setRange({ from, to });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    useEffect(() => {
        if (range?.from && range?.to) {
            const nextStart = fmt(range.from);
            const nextEnd = fmt(range.to);
            if (!sameDay(startDate, nextStart)) setStartDate(nextStart);
            if (!sameDay(endDate, nextEnd)) setEndDate(nextEnd);
        }
    }, [range?.from, range?.to, startDate, endDate, setStartDate, setEndDate]);

    const displayValue = useMemo(() => {
        const from = range?.from ?? (startDate ? new Date(startDate) : undefined);
        const to = range?.to ?? (endDate ? new Date(endDate) : undefined);
        if (from && to) {
            return `${moment(from).format('YYYY.MM.DD (dd)')} ~ ${moment(to).format('YYYY.MM.DD (dd)')}`;
        }
        return defaultValue;
    }, [range?.from, range?.to, startDate, endDate, defaultValue]);

    const rangeProp: DateRange = useMemo(() => range ?? { from: undefined, to: undefined }, [range]);

    useEffect(
        () => () => {
            resetStart();
            resetEnd();
        },
        [resetStart, resetEnd]
    );
    return { displayValue, rangeProp, setRange };
};
