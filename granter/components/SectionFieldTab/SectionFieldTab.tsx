import React from 'react';
import classNames from 'classnames';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SectionFieldTab.module.scss';

const noop = () => undefined;

type SectionFieldTabCssProperties = React.CSSProperties & {
    '--granter-section-field-tab-min-item-width'?: string;
};

export type SectionFieldTabSize = 'default' | 'compact';

export type SectionFieldTabProps<T extends string = string> = {
    children: React.ReactNode;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    full?: boolean;
    wrap?: boolean;
    size?: SectionFieldTabSize;
    minItemWidth?: number | string;
    className?: string;
};

export type SectionFieldTabItemProps<T extends string = string> = {
    value: T;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

export type SectionFieldTabDropdownItemOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};

export type SectionFieldTabDropdownItemProps<T extends string = string> = {
    children: React.ReactNode;
    options: SectionFieldTabDropdownItemOption<T>[];
    disabled?: boolean;
    className?: string;
    menuClassName?: string;
    optionClassName?: string;
    placement?: React.ComponentProps<typeof Dropdown.Content>['placement'];
    dropdownIcon?: React.ReactNode;
};

const SectionFieldTabItem = <T extends string>({
    value,
    children,
    disabled = false,
    className,
}: SectionFieldTabItemProps<T>) => {
    const { selectValue, changeSelectValue } = useSelect();
    const isActive = value === selectValue;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={classNames(styles.Item, className)}
            data-active={isActive ? 'true' : 'false'}
            disabled={disabled}
            onClick={() => {
                if (disabled) return;
                changeSelectValue(value);
            }}
        >
            {children}
        </button>
    );
};

const DropdownTriggerContent = ({
    children,
    dropdownIcon,
}: {
    children: React.ReactNode;
    dropdownIcon?: React.ReactNode;
}) => {
    const { isOpen } = useDropdown();

    return (
        <>
            <span className={styles.DropdownLabel}>{children}</span>
            <span className={styles.DropdownChevron} data-open={isOpen ? 'true' : 'false'}>
                {dropdownIcon ?? <HiOutlineChevronDown size={16} />}
            </span>
        </>
    );
};

const SectionFieldTabDropdownItem = <T extends string>({
    children,
    options,
    disabled = false,
    className,
    menuClassName,
    optionClassName,
    placement = 'bottom-end',
    dropdownIcon,
}: SectionFieldTabDropdownItemProps<T>) => {
    const { selectValue, changeSelectValue } = useSelect();
    const isActive = options.some((option) => option.value === selectValue);

    return (
        <Dropdown>
            <Dropdown.Trigger
                role="tab"
                tabIndex={disabled ? -1 : 0}
                aria-selected={isActive}
                className={classNames(styles.Item, styles.DropdownItem, className)}
                data-active={isActive ? 'true' : 'false'}
                disabled={disabled}
            >
                <DropdownTriggerContent dropdownIcon={dropdownIcon}>{children}</DropdownTriggerContent>
            </Dropdown.Trigger>
            <DropdownMenu
                options={options}
                selectValue={selectValue as T | undefined}
                onSelect={changeSelectValue}
                disabled={disabled}
                menuClassName={menuClassName}
                optionClassName={optionClassName}
                placement={placement}
            />
        </Dropdown>
    );
};

const DropdownMenu = <T extends string>({
    options,
    selectValue,
    onSelect,
    disabled,
    menuClassName,
    optionClassName,
    placement,
}: {
    options: SectionFieldTabDropdownItemOption<T>[];
    selectValue?: T;
    onSelect: (value: T) => void;
    disabled: boolean;
    menuClassName?: string;
    optionClassName?: string;
    placement: React.ComponentProps<typeof Dropdown.Content>['placement'];
}) => {
    const { close } = useDropdown();

    return (
        <Dropdown.Content
            className={classNames(styles.DropdownMenu, menuClassName)}
            placement={placement}
            keepMounted={false}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={classNames(styles.DropdownOption, optionClassName)}
                    data-active={option.value === selectValue ? 'true' : 'false'}
                    disabled={disabled || option.disabled}
                    onClick={() => {
                        if (disabled || option.disabled) return;
                        onSelect(option.value);
                        close();
                    }}
                >
                    {option.label}
                </button>
            ))}
        </Dropdown.Content>
    );
};

type SectionFieldTabComponent = (<T extends string = string>(props: SectionFieldTabProps<T>) => React.ReactElement) & {
    Item: typeof SectionFieldTabItem;
    DropdownItem: typeof SectionFieldTabDropdownItem;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const SectionFieldTab = (<T extends string = string>({
    children,
    value,
    defaultValue,
    onChange = noop,
    full: _full = true,
    wrap: _wrap = false,
    size = 'default',
    minItemWidth,
    className,
}: SectionFieldTabProps<T>) => {
    const cssVariables: SectionFieldTabCssProperties = {
        '--granter-section-field-tab-min-item-width': toCssLength(minItemWidth),
    };

    return (
        <Select
            value={value}
            defaultValue={defaultValue}
            onChange={(nextValue) => onChange(nextValue as T)}
        >
            <div
                role="tablist"
                className={classNames(styles.Root, className)}
                style={cssVariables}
                data-size={size}
                // data-full={full ? 'true' : 'false'}
                // data-wrap={wrap ? 'true' : 'false'}
            >
                {children}
            </div>
        </Select>
    );
}) as SectionFieldTabComponent;

SectionFieldTab.Item = SectionFieldTabItem;
SectionFieldTab.DropdownItem = SectionFieldTabDropdownItem;

export default SectionFieldTab;
