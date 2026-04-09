import React from 'react';
import classNames from 'classnames';
import { FiCalendar } from 'react-icons/fi';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import SingleDatePicker from '../SingleDatePicker/SingleDatePicker';
import styles from './SectionFieldDateInput.module.scss';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseIsoDate = (value?: string | null): Date | undefined => {
    if (!value) return undefined;

    const matched = ISO_DATE_PATTERN.exec(value.trim());
    if (!matched) return undefined;

    const year = Number(matched[1]);
    const month = Number(matched[2]);
    const day = Number(matched[3]);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return undefined;
    }

    return date;
};

const formatIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }

    if (ref) {
        ref.current = value;
    }
};

export type SectionFieldDateInputProps = {
    value?: string | null;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    name?: string;
    id?: string;
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
};

type DatePickerDropdownContentProps = {
    selectedDate?: Date;
    onSelectDate: (date: Date) => void;
};

const DatePickerDropdownContent = ({ selectedDate, onSelectDate }: DatePickerDropdownContentProps) => {
    const { close } = useDropdown();

    return (
        <Dropdown.Content placement="bottom-start" offset={8}>
            <SingleDatePicker
                date={selectedDate ?? new Date()}
                onChangeDate={(nextDate) => {
                    onSelectDate(nextDate);
                    close();
                }}
            />
        </Dropdown.Content>
    );
};

const SectionFieldDateInput = React.forwardRef<HTMLInputElement, SectionFieldDateInputProps>(
    (
        {
            value,
            onChange,
            onValueChange,
            placeholder = '날짜를 선택하세요.',
            disabled = false,
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
        const selectedDate = React.useMemo(() => parseIsoDate(value), [value]);
        const displayValue = selectedDate ? formatDisplayDate(selectedDate) : placeholder;

        const handleSelectDate = React.useCallback(
            (date: Date) => {
                const nextValue = formatIsoDate(date);

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
                    <span className={classNames(styles.Value, !selectedDate && styles.Placeholder)}>
                        {displayValue}
                    </span>
                    <FiCalendar size={16} className={styles.Icon} aria-hidden="true" />
                </Dropdown.Trigger>

                {!disabled ? (
                    <DatePickerDropdownContent selectedDate={selectedDate} onSelectDate={handleSelectDate} />
                ) : null}
            </Dropdown>
        );
    }
);

SectionFieldDateInput.displayName = 'SectionFieldDateInput';

export default SectionFieldDateInput;
