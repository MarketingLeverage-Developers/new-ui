import DoubleDatePicker from '../../../DoubleDatePicker/DoubleDatePicker';
import RoundedSelect from '../../../RoundedSelect/RoundedSelect';
import React, { useEffect, useRef, useState } from 'react';
import Flex from '../../../Flex/Flex';
import { formatDate } from '../../../shared/utils/utils';
import type { DateRange } from 'react-day-picker';
import RangeDatePicker, { type RangeDatePickerPresetKey } from '../../../RangeDatePicker/RangeDatePicker';
import BasicDropDown from '../../../BasicDropDown/BasicDropDown';
import { addMonths, endOfMonth, moveDayRange, moveMonth, startOfMonth } from '../../../shared/utils/dateFilter/dateFilter';
import { BaseTooltip } from '../../../BaseTooltip/BaseTooltip';

const datePeriodMapper: Record<string, string> = {
    '1m': '최근 1개월',
    '3m': '최근 3개월',
    '6m': '최근 6개월',
};

type Props = {
    startDate: string | null;
    endDate: string | null;
    onChange: (range: DateRange | undefined, period?: string) => void;
    type?: 'basic' | 'preset';
};

const presetKeys: RangeDatePickerPresetKey[] = [
    'YESTERDAY',
    'TODAY',
    'THIS_MONTH',
    'LAST_MONTH',
    'LAST_7_DAYS',
    'LAST_3_MONTHS',
    'LAST_6_MONTHS',
    'LAST_12_MONTHS',
    'THIS_YEAR',
    'LAST_YEAR',
    'Q1',
    'Q2',
    'Q3',
    'Q4',
];

const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, diff: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + diff);
    return next;
};

const addYears = (date: Date, diff: number) => addMonths(date, diff * 12);

const getQuarter = (date: Date) => Math.floor(date.getMonth() / 3);

const startOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1);

const endOfYear = (date: Date) => new Date(date.getFullYear(), 11, 31);

const startOfQuarter = (date: Date) => new Date(date.getFullYear(), getQuarter(date) * 3, 1);

const endOfQuarter = (date: Date) => new Date(date.getFullYear(), getQuarter(date) * 3 + 3, 0);

const isSameDay = (a?: Date, b?: Date) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const isSameYear = (a: Date, b: Date) => a.getFullYear() === b.getFullYear();

const isSameQuarter = (a: Date, b: Date) => isSameYear(a, b) && getQuarter(a) === getQuarter(b);

const isAfterDay = (a: Date, b: Date) => normalizeDate(a).getTime() > normalizeDate(b).getTime();

const isAfterMonth = (a: Date, b: Date) =>
    a.getFullYear() > b.getFullYear() || (a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth());

const isAfterYear = (a: Date, b: Date) => a.getFullYear() > b.getFullYear();

const isAfterQuarter = (a: Date, b: Date) =>
    a.getFullYear() > b.getFullYear() || (a.getFullYear() === b.getFullYear() && getQuarter(a) > getQuarter(b));

const isSameRange = (a?: DateRange, b?: DateRange) => {
    if (!a?.from && !b?.from) return true;
    if (!a?.from || !b?.from) return false;

    const fromSame = isSameDay(a.from, b.from);
    const toSame = (!a.to && !b.to) || (a.to && b.to ? isSameDay(a.to, b.to) : false);

    return fromSame && toSame;
};

const resolvePresetRange = (presetKey: RangeDatePickerPresetKey, today: Date): DateRange => {
    const yesterday = addDays(today, -1);
    const startOfCurrentYear = startOfYear(today);
    const endOfCurrentYear = endOfYear(today);
    const currentYear = today.getFullYear();

    switch (presetKey) {
        case 'YESTERDAY':
            return { from: yesterday, to: yesterday };
        case 'TODAY':
            return { from: today, to: today };
        case 'THIS_MONTH':
            return { from: startOfMonth(today), to: today };
        case 'LAST_MONTH': {
            const lastMonth = addMonths(today, -1);
            return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
        }
        case 'LAST_7_DAYS':
            return { from: addDays(today, -6), to: today };
        case 'LAST_3_MONTHS':
            return { from: startOfMonth(addMonths(today, -2)), to: today };
        case 'LAST_6_MONTHS':
            return { from: startOfMonth(addMonths(today, -5)), to: today };
        case 'LAST_12_MONTHS':
            return { from: startOfMonth(addMonths(today, -11)), to: today };
        case 'THIS_YEAR':
            return { from: startOfCurrentYear, to: endOfCurrentYear };
        case 'LAST_YEAR': {
            const lastYear = new Date(currentYear - 1, 0, 1);
            return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
        }
        case 'Q1':
            return { from: new Date(currentYear, 0, 1), to: new Date(currentYear, 3, 0) };
        case 'Q2':
            return { from: new Date(currentYear, 3, 1), to: new Date(currentYear, 6, 0) };
        case 'Q3':
            return { from: new Date(currentYear, 6, 1), to: new Date(currentYear, 9, 0) };
        case 'Q4':
            return { from: new Date(currentYear, 9, 1), to: new Date(currentYear, 12, 0) };
    }
};

const resolvePresetKey = (range: DateRange | undefined, today: Date) =>
    presetKeys.find((presetKey) => isSameRange(range, resolvePresetRange(presetKey, today))) ?? null;

const getMonthNavigationRange = (range: DateRange | undefined, direction: -1 | 1, today: Date) => {
    const base = range?.from ?? today;

    if (direction < 0) return moveMonth(base, -1);

    const nextRange = moveMonth(base, 1);
    if (nextRange?.from && isAfterMonth(nextRange.from, today)) return undefined;

    return nextRange;
};

const buildMonthRange = (targetMonth: Date, today: Date): DateRange => ({
    from: startOfMonth(targetMonth),
    to: isSameMonth(targetMonth, today) ? today : endOfMonth(targetMonth),
});

const buildRollingMonthRange = (targetEndMonth: Date, monthCount: number, today: Date): DateRange => ({
    from: startOfMonth(addMonths(targetEndMonth, -(monthCount - 1))),
    to: isSameMonth(targetEndMonth, today) ? today : endOfMonth(targetEndMonth),
});

const buildYearRange = (targetYear: Date, today: Date): DateRange => ({
    from: startOfYear(targetYear),
    to: isSameYear(targetYear, today) ? today : endOfYear(targetYear),
});

const buildQuarterRange = (targetQuarter: Date, today: Date): DateRange => ({
    from: startOfQuarter(targetQuarter),
    to: isSameQuarter(targetQuarter, today) ? today : endOfQuarter(targetQuarter),
});

const getPresetNavigationRange = (
    presetKey: RangeDatePickerPresetKey,
    range: DateRange | undefined,
    direction: -1 | 1,
    today: Date
) => {
    if (!range?.from || !range?.to) return undefined;

    switch (presetKey) {
        case 'YESTERDAY':
        case 'TODAY': {
            const nextRange = moveDayRange(range, direction);
            if (nextRange?.to && isAfterDay(nextRange.to, today)) return undefined;
            return nextRange;
        }
        case 'LAST_7_DAYS': {
            const nextRange = moveDayRange(range, direction * 7);
            if (nextRange?.to && isAfterDay(nextRange.to, today)) return undefined;
            return nextRange;
        }
        case 'THIS_MONTH':
        case 'LAST_MONTH': {
            const targetMonth = addMonths(startOfMonth(range.from), direction);
            if (direction > 0 && isAfterMonth(targetMonth, today)) return undefined;
            return buildMonthRange(targetMonth, today);
        }
        case 'LAST_3_MONTHS':
        case 'LAST_6_MONTHS':
        case 'LAST_12_MONTHS': {
            const monthCount = presetKey === 'LAST_3_MONTHS' ? 3 : presetKey === 'LAST_6_MONTHS' ? 6 : 12;
            const targetEndMonth = addMonths(startOfMonth(range.to), direction * monthCount);

            if (direction > 0 && isAfterMonth(targetEndMonth, today)) return undefined;

            return buildRollingMonthRange(targetEndMonth, monthCount, today);
        }
        case 'THIS_YEAR':
        case 'LAST_YEAR': {
            const targetYear = addYears(startOfYear(range.from), direction);
            if (direction > 0 && isAfterYear(targetYear, today)) return undefined;
            return buildYearRange(targetYear, today);
        }
        case 'Q1':
        case 'Q2':
        case 'Q3':
        case 'Q4': {
            const targetQuarter = addMonths(startOfQuarter(range.from), direction * 3);
            if (direction > 0 && isAfterQuarter(targetQuarter, today)) return undefined;
            return buildQuarterRange(targetQuarter, today);
        }
    }
};

export const DateSelect = ({ startDate, endDate, onChange, type = 'basic' }: Props) => {
    const [period, setPeriod] = useState('1m');
    const preservePresetSyncRef = useRef(false);

    const dateRange: DateRange | undefined =
        startDate && endDate
            ? {
                  from: new Date(startDate),
                  to: new Date(endDate),
              }
            : undefined;

    const today = normalizeDate(new Date());

    const [navigationPreset, setNavigationPreset] = useState<RangeDatePickerPresetKey | null>(() =>
        type === 'preset' ? resolvePresetKey(dateRange, today) : null
    );

    useEffect(() => {
        if (type !== 'preset') {
            preservePresetSyncRef.current = false;
            setNavigationPreset(null);
            return;
        }

        if (preservePresetSyncRef.current) {
            preservePresetSyncRef.current = false;
            return;
        }

        const nextDateRange =
            startDate && endDate
                ? {
                      from: new Date(startDate),
                      to: new Date(endDate),
                  }
                : undefined;

        setNavigationPreset(resolvePresetKey(nextDateRange, normalizeDate(new Date())));
    }, [endDate, startDate, type]);

    const selectHandler = (val: string) => {
        const today = new Date();
        let from: Date | undefined;

        if (val === '7d') {
            from = new Date(today);
            from.setDate(today.getDate() - 6);
        } else if (val.endsWith('m')) {
            const months = parseInt(val);
            from = new Date(today);
            from.setMonth(today.getMonth() - months);
        }

        const newRange = from ? { from, to: today } : undefined;
        onChange(newRange, val);
        if (val) setPeriod(val);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (type === 'preset') {
            setNavigationPreset(resolvePresetKey(range, today));
        }
        onChange(range, 'custom');
        setPeriod('custom');
    };

    const getNavigatedRange = (direction: -1 | 1) => {
        if (type !== 'preset') return getMonthNavigationRange(dateRange, direction, today);
        if (!navigationPreset) return getMonthNavigationRange(dateRange, direction, today);
        return getPresetNavigationRange(navigationPreset, dateRange, direction, today);
    };

    const prevRange = getNavigatedRange(-1);
    const nextRange = getNavigatedRange(1);

    const handleMoveRange = (nextRangeToApply: DateRange | undefined) => {
        if (!nextRangeToApply) return;

        if (type === 'preset' && navigationPreset) {
            preservePresetSyncRef.current = true;
        }

        onChange(nextRangeToApply, 'custom');
        setPeriod('custom');
    };

    // 초기설정: URL에 날짜가 없으면 1개월로 설정
    // useEffect(() => {
    //     if (!startDate || !endDate) {
    //         selectHandler('1m');
    //     }
    // }, []);

    return (
        <>
            {type === 'basic' && (
                <RoundedSelect defaultValue={period} onChange={selectHandler}>
                    <RoundedSelect.Display render={() => <>{datePeriodMapper[period] ?? '직접 선택'}</>} />
                    <RoundedSelect.Content>
                        <RoundedSelect.Item value="1m">최근 1개월</RoundedSelect.Item>
                        <RoundedSelect.Item value="3m">최근 3개월</RoundedSelect.Item>
                        <RoundedSelect.Item value="6m">최근 6개월</RoundedSelect.Item>
                    </RoundedSelect.Content>
                </RoundedSelect>
            )}
            <BasicDropDown>
                <BaseTooltip label="날짜 선택" side="bottom">
                    <BasicDropDown.Trigger
                        onPrev={() => handleMoveRange(prevRange)}
                        onNext={() => handleMoveRange(nextRange)}
                        disabledPrev={!prevRange}
                        disabledNext={!nextRange}
                    >
                        <Flex align="center" gap={4}>
                            {/* <MdCalendarToday /> */}
                            <span>
                                {`${formatDate(dateRange?.from, 'yyyy.mm.dd (dow)')} - ${formatDate(
                                    dateRange?.to,
                                    'yyyy.mm.dd (dow)'
                                )}`}
                            </span>
                        </Flex>
                    </BasicDropDown.Trigger>
                </BaseTooltip>

                <BasicDropDown.Content placement="bottom-center">
                    {type === 'basic' ? (
                        <DoubleDatePicker
                            range={dateRange ?? { from: new Date(), to: new Date() }}
                            onChange={handleDateRangeChange}
                        />
                    ) : (
                        <RangeDatePicker
                            range={dateRange ?? { from: new Date(), to: new Date() }}
                            onChange={handleDateRangeChange}
                            onPresetSelect={setNavigationPreset}
                        />
                    )}
                </BasicDropDown.Content>
            </BasicDropDown>
        </>
    );
};
