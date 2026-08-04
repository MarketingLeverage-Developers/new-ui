import React from 'react';
import classNames from 'classnames';
import { FiCalendar } from 'react-icons/fi';
import type { DateRange } from 'react-day-picker';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import MonthRangeCalendar from '../MonthRangeCalendar/MonthRangeCalendar';
import styles from '../SectionFieldDateInput/SectionFieldDateInput.module.scss';

const ISO_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

const parseIsoMonth = (value?: string | null): Date | undefined => {
    if (!value) return undefined;

    const matched = ISO_MONTH_PATTERN.exec(value.trim());
    if (!matched) return undefined;

    const year = Number(matched[1]);
    const month = Number(matched[2]);
    if (month < 1 || month > 12) return undefined;

    return new Date(year, month - 1, 1);
};

const formatIsoMonth = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatDisplayMonth = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }

    if (ref) {
        ref.current = value;
    }
};

export type SectionFieldMonthInputProps = {
    value?: string | null;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    allowFutureMonths?: boolean;
    name?: string;
    id?: string;
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
};

type MonthPickerDropdownContentProps = {
    selectedMonth?: Date;
    allowFutureMonths: boolean;
    onSelectMonth: (date: Date) => void;
};

const MonthPickerDropdownContent = ({
    selectedMonth,
    allowFutureMonths,
    onSelectMonth,
}: MonthPickerDropdownContentProps) => {
    const { close } = useDropdown();
    const range = React.useMemo<DateRange>(
        () => {
            const fallbackMonth = selectedMonth ?? new Date();
            return { from: fallbackMonth, to: endOfMonth(fallbackMonth) };
        },
        [selectedMonth]
    );

    return (
        <Dropdown.Content placement="bottom-start" offset={8} keepMounted={false}>
            <MonthRangeCalendar
                range={range}
                selectionMode="single"
                allowFutureDates={allowFutureMonths}
                onChange={(nextRange) => {
                    if (!nextRange?.from) return;
                    onSelectMonth(nextRange.from);
                    close();
                }}
            />
        </Dropdown.Content>
    );
};

const SectionFieldMonthInput = React.forwardRef<HTMLInputElement, SectionFieldMonthInputProps>(
    (
        {
            value,
            onChange,
            onValueChange,
            placeholder = '정산월을 선택하세요.',
            disabled = false,
            allowFutureMonths = false,
            name,
            id,
            required = false,
            className,
            style,
            'aria-label': ariaLabel,
        },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement | null>(null);
        const selectedMonth = React.useMemo(() => parseIsoMonth(value), [value]);
        const displayValue = selectedMonth ? formatDisplayMonth(selectedMonth) : placeholder;

        const handleSelectMonth = React.useCallback(
            (date: Date) => {
                const nextValue = formatIsoMonth(date);

                onValueChange?.(nextValue);

                if (inputRef.current) {
                    inputRef.current.value = nextValue;
                }

                if (onChange) {
                    const target =
                        inputRef.current ??
                        ({
                            value: nextValue,
                            name,
                        } as HTMLInputElement);

                    onChange({
                        target,
                        currentTarget: target,
                    } as React.ChangeEvent<HTMLInputElement>);
                }
            },
            [name, onChange, onValueChange]
        );

        return (
            <Dropdown>
                <input
                    ref={(node) => {
                        inputRef.current = node;
                        assignRef(ref, node);
                    }}
                    type="hidden"
                    name={name}
                    id={id}
                    value={value ?? ''}
                    required={required}
                    disabled={disabled}
                    readOnly
                    aria-hidden="true"
                />

                <Dropdown.Trigger
                    className={classNames(styles.Trigger, className)}
                    style={style}
                    disabled={disabled}
                    tabIndex={disabled ? -1 : 0}
                    aria-label={ariaLabel ?? placeholder}
                >
                    <span className={classNames(styles.Value, !selectedMonth && styles.Placeholder)}>
                        {displayValue}
                    </span>
                    <FiCalendar size={16} className={styles.Icon} aria-hidden="true" />
                </Dropdown.Trigger>

                {!disabled ? (
                    <MonthPickerDropdownContent
                        selectedMonth={selectedMonth}
                        allowFutureMonths={allowFutureMonths}
                        onSelectMonth={handleSelectMonth}
                    />
                ) : null}
            </Dropdown>
        );
    }
);

SectionFieldMonthInput.displayName = 'SectionFieldMonthInput';

export default SectionFieldMonthInput;
