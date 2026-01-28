import React from 'react';
import type { DayPickerProps } from 'react-day-picker';

import BaseCalendar, { type BaseCalendarExtraProps } from './components/BaseCalendar/BaseCalendar';
import MiniCalendar, { type MiniCalendarExtraProps } from './components/MiniCalendar/MiniCalendar';

export type CalendarVariant = 'base' | 'mini';

export type CalendarBaseProps = { variant: 'base' } & DayPickerProps & BaseCalendarExtraProps;
export type CalendarMiniProps = { variant: 'mini' } & DayPickerProps & MiniCalendarExtraProps;
export type CalendarProps = CalendarBaseProps | CalendarMiniProps;

const defaultParseServerDateTime = (value: string | null | undefined): Date | undefined => {
    if (!value) return undefined;

    const isoLike = value.includes('T') ? value : value.replace(' ', 'T');
    const d = new Date(isoLike);

    if (Number.isNaN(d.getTime())) return undefined;
    return d;
};

const defaultFormatServerDateTime = (date: Date | undefined): string => {
    if (!date) return '';

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

type CalendarMode = 'single' | 'range';

type CalendarServerStringSingleProps = Omit<
    CalendarBaseProps,
    'selected' | 'onSelect' | 'month' | 'onMonthChange'
> & {
    mode: 'single';

    value?: string;
    onChange?: (next: string) => void;

    monthValue?: string;
    onMonthValueChange?: (next: string) => void;

    fromMonthValue?: string;
    toMonthValue?: string;

    parseValue?: (value: string | null | undefined) => Date | undefined;
    formatValue?: (date: Date | undefined) => string;
};

type CalendarServerStringRangeValue = {
    from?: string;
    to?: string;
};

type CalendarServerStringRangeProps = Omit<
    CalendarBaseProps,
    'selected' | 'onSelect' | 'month' | 'onMonthChange'
> & {
    mode: 'range';

    value?: CalendarServerStringRangeValue;
    onChange?: (next: CalendarServerStringRangeValue) => void;

    monthValue?: string;
    onMonthValueChange?: (next: string) => void;

    fromMonthValue?: string;
    toMonthValue?: string;

    parseValue?: (value: string | null | undefined) => Date | undefined;
    formatValue?: (date: Date | undefined) => string;
};

type CalendarUnionProps = CalendarProps | CalendarServerStringSingleProps | CalendarServerStringRangeProps;

const isServerStringSingleMode = (props: CalendarUnionProps): props is CalendarServerStringSingleProps =>
    'mode' in props && props.mode === 'single' && ('value' in props || 'onChange' in props);

const isServerStringRangeMode = (props: CalendarUnionProps): props is CalendarServerStringRangeProps =>
    'mode' in props && props.mode === 'range' && ('value' in props || 'onChange' in props);

const Calendar: React.FC<CalendarUnionProps> = (props) => {
    const { variant, ...rest } = props;

    if (variant === 'mini') {
        return <MiniCalendar {...(rest as DayPickerProps & MiniCalendarExtraProps)} />;
    }

    if (isServerStringSingleMode(props)) {
        const {
            value,
            onChange,
            monthValue,
            onMonthValueChange,
            fromMonthValue,
            toMonthValue,
            parseValue,
            formatValue,
            ...baseRest
        } = props;

        const parse = parseValue ?? defaultParseServerDateTime;
        const format = formatValue ?? defaultFormatServerDateTime;

        const selected = parse(value);
        const month = parse(monthValue);
        const fromMonth = parse(fromMonthValue);
        const toMonth = parse(toMonthValue);

        return (
            <BaseCalendar
                {...(baseRest as DayPickerProps)}
                mode="single"
                selected={selected}
                onSelect={(d: Date | undefined) => {
                    onChange?.(format(d));
                }}
                month={month}
                onMonthChange={(d: Date) => {
                    onMonthValueChange?.(format(d));
                }}
                fromMonth={fromMonth}
                toMonth={toMonth}
            />
        );
    }

    if (isServerStringRangeMode(props)) {
        const {
            value,
            onChange,
            monthValue,
            onMonthValueChange,
            fromMonthValue,
            toMonthValue,
            parseValue,
            formatValue,
            ...baseRest
        } = props;

        const parse = parseValue ?? defaultParseServerDateTime;
        const format = formatValue ?? defaultFormatServerDateTime;

        const selected = {
            from: parse(value?.from),
            to: parse(value?.to),
        };

        const month = parse(monthValue);
        const fromMonth = parse(fromMonthValue);
        const toMonth = parse(toMonthValue);

        return (
            <BaseCalendar
                {...(baseRest as DayPickerProps)}
                mode="range"
                selected={selected}
                onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                    onChange?.({
                        from: format(range?.from),
                        to: format(range?.to),
                    });
                }}
                month={month}
                onMonthChange={(d: Date) => {
                    onMonthValueChange?.(format(d));
                }}
                fromMonth={fromMonth}
                toMonth={toMonth}
            />
        );
    }

    return <BaseCalendar {...(rest as DayPickerProps)} />;
};

export default Calendar;
