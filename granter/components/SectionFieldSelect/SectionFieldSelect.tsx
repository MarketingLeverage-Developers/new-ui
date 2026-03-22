import React from 'react';
import classNames from 'classnames';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SectionFieldSelect.module.scss';

const noop = () => undefined;

export type SectionFieldSelectOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};

export type SectionFieldSelectProps<T extends string = string> = {
    options: SectionFieldSelectOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    placeholder?: React.ReactNode;
    className?: string;
    menuClassName?: string;
    menuMaxHeight?: number | string;
    disabled?: boolean;
};

type SectionFieldSelectItemProps<T extends string = string> = {
    option: SectionFieldSelectOption<T>;
    disabled?: boolean;
};

const SectionFieldSelectItem = <T extends string>({
    option,
    disabled = false,
}: SectionFieldSelectItemProps<T>) => {
    const { isActive, changeSelectValue } = useSelect();
    const { close } = useDropdown();
    const isDisabled = Boolean(disabled || option.disabled);

    return (
        <button
            type="button"
            className={styles.Option}
            data-active={isActive(option.value) ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={() => {
                if (isDisabled) return;
                changeSelectValue(option.value);
                close();
            }}
        >
            {option.label}
        </button>
    );
};

type SectionFieldSelectViewProps<T extends string = string> = {
    options: SectionFieldSelectOption<T>[];
    placeholder: React.ReactNode;
    className?: string;
    menuClassName?: string;
    menuMaxHeight: number | string;
    disabled?: boolean;
};

const SectionFieldSelectView = <T extends string>({
    options,
    placeholder,
    className,
    menuClassName,
    menuMaxHeight,
    disabled = false,
}: SectionFieldSelectViewProps<T>) => {
    const { selectValue } = useSelect();
    const { isOpen } = useDropdown();
    const selectedOption = options.find((option) => option.value === selectValue);

    return (
        <div className={classNames(styles.Root, className)}>
            <Dropdown.Trigger className={styles.TriggerWrap} disabled={disabled}>
                <button
                    type="button"
                    className={styles.Trigger}
                    disabled={disabled}
                >
                    <span
                        className={styles.Label}
                        data-placeholder={selectedOption ? 'false' : 'true'}
                    >
                        {selectedOption?.label ?? placeholder}
                    </span>

                    <span className={styles.Icon} data-open={isOpen ? 'true' : 'false'}>
                        <HiOutlineChevronDown size={16} />
                    </span>
                </button>
            </Dropdown.Trigger>

            {options.length > 0 ? (
                <Dropdown.Content
                    className={classNames(styles.Menu, menuClassName)}
                    placement="bottom-start"
                    matchTriggerWidth
                    style={{ maxHeight: menuMaxHeight, overflowY: 'auto' }}
                >
                    {options.map((option) => (
                        <SectionFieldSelectItem
                            key={option.value}
                            option={option}
                            disabled={disabled}
                        />
                    ))}
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const SectionFieldSelect = (<T extends string = string>({
    options,
    value,
    defaultValue,
    onChange = noop,
    placeholder = '선택해주세요.',
    className,
    menuClassName,
    menuMaxHeight = 240,
    disabled = false,
}: SectionFieldSelectProps<T>) => (
    <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onChange(nextValue as T)}
    >
        <Dropdown>
            <SectionFieldSelectView
                options={options}
                placeholder={placeholder}
                className={className}
                menuClassName={menuClassName}
                menuMaxHeight={menuMaxHeight}
                disabled={disabled}
            />
        </Dropdown>
    </Select>
)) as <T extends string = string>(props: SectionFieldSelectProps<T>) => React.ReactElement;

export default SectionFieldSelect;
