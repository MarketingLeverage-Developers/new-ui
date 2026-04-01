import React from 'react';
import classNames from 'classnames';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './ButtonSelect.module.scss';

const noop = () => undefined;

export type ButtonSelectVariant = 'black' | 'white';
export type ButtonSelectWidthPreset = 'fit' | 'full';

export type ButtonSelectOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
};

export type ButtonSelectProps<T extends string = string> = {
    label: React.ReactNode;
    children?: React.ReactNode;
    variant?: ButtonSelectVariant;
    widthPreset?: ButtonSelectWidthPreset;
    className?: string;
    mainButtonClassName?: string;
    toggleButtonClassName?: string;
    menuClassName?: string;
    toggleAriaLabel?: string;
    dropdownIcon?: React.ReactNode;
    value?: T;
    defaultValue?: T;
    onValueChange?: (value: T) => void;
    onMainClick?: () => void;
    onToggleClick?: () => void;
    openOnMainClick?: boolean;
    disabled?: boolean;
};

export type ButtonSelectItemProps<T extends string = string> = {
    value: T;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onSelect?: () => void;
};

const ButtonSelectItem = <T extends string>({
    value,
    children,
    disabled,
    className,
    onSelect = noop,
}: ButtonSelectItemProps<T>) => {
    const { isActive, changeSelectValue } = useSelect();
    const { close } = useDropdown();

    const handleClick = () => {
        if (disabled) return;
        changeSelectValue(value);
        onSelect();
        close();
    };

    return (
        <button
            type="button"
            className={classNames(styles.Item, className)}
            data-active={isActive(value) ? 'true' : 'false'}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

type ButtonSelectViewProps = {
    label: React.ReactNode;
    children?: React.ReactNode;
    variant: ButtonSelectVariant;
    widthPreset: ButtonSelectWidthPreset;
    className?: string;
    mainButtonClassName?: string;
    toggleButtonClassName?: string;
    menuClassName?: string;
    toggleAriaLabel: string;
    dropdownIcon?: React.ReactNode;
    onMainClick: () => void;
    onToggleClick: () => void;
    openOnMainClick: boolean;
    disabled: boolean;
};

const ButtonSelectView = ({
    label,
    children,
    variant,
    widthPreset,
    className,
    mainButtonClassName,
    toggleButtonClassName,
    menuClassName,
    toggleAriaLabel,
    dropdownIcon,
    onMainClick,
    onToggleClick,
    openOnMainClick,
    disabled,
}: ButtonSelectViewProps) => {
    const { isOpen, toggle, anchorRef, setLastFocusedEl } = useDropdown();
    const hasMenuItems = React.Children.count(children) > 0;

    const handleToggleClick = () => {
        onToggleClick();
        if (disabled) return;
        if (!hasMenuItems) return;
        if (!isOpen) {
            setLastFocusedEl(document.activeElement as HTMLElement | null);
        }
        toggle();
    };

    const handleMainClick = () => {
        onMainClick();
        if (disabled) return;
        if (!hasMenuItems) return;
        if (!openOnMainClick) return;
        if (!isOpen) {
            setLastFocusedEl(document.activeElement as HTMLElement | null);
        }
        toggle();
    };

    return (
        <div className={classNames(styles.Root, className)} data-width-preset={widthPreset}>
            <div ref={anchorRef} className={classNames(styles.Wrap, styles[`Variant-${variant}`])}>
                <button
                    type="button"
                    className={classNames(styles.MainButton, mainButtonClassName)}
                    onClick={handleMainClick}
                    disabled={disabled}
                >
                    {label}
                </button>

                <button
                    type="button"
                    className={classNames(styles.ToggleButton, toggleButtonClassName)}
                    aria-label={toggleAriaLabel}
                    aria-haspopup={hasMenuItems ? 'menu' : undefined}
                    aria-expanded={hasMenuItems ? isOpen : undefined}
                    onClick={handleToggleClick}
                    disabled={disabled}
                >
                    <span className={styles.ToggleIcon} data-open={hasMenuItems && isOpen ? 'true' : 'false'}>
                        {dropdownIcon ?? <HiOutlineChevronDown size={14} />}
                    </span>
                </button>
            </div>

            {hasMenuItems ? (
                <Dropdown.Content
                    className={classNames(styles.Menu, menuClassName)}
                    placement="bottom-end"
                    keepMounted={false}
                >
                    {children}
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

type ButtonSelectComponent = (<T extends string = string>(props: ButtonSelectProps<T>) => React.ReactElement) & {
    Item: typeof ButtonSelectItem;
};

const ButtonSelect = (<T extends string = string>({
    label,
    children,
    variant = 'black',
    widthPreset = 'fit',
    className,
    mainButtonClassName,
    toggleButtonClassName,
    menuClassName,
    toggleAriaLabel = '더보기',
    dropdownIcon,
    value,
    defaultValue,
    onValueChange,
    onMainClick = noop,
    onToggleClick = noop,
    openOnMainClick = false,
    disabled = false,
}: ButtonSelectProps<T>) => (
    <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onValueChange?.(nextValue as T)}
    >
        <Dropdown>
            <ButtonSelectView
                label={label}
                children={children}
                variant={variant}
                widthPreset={widthPreset}
                className={className}
                mainButtonClassName={mainButtonClassName}
                toggleButtonClassName={toggleButtonClassName}
                menuClassName={menuClassName}
                toggleAriaLabel={toggleAriaLabel}
                dropdownIcon={dropdownIcon}
                onMainClick={onMainClick}
                onToggleClick={onToggleClick}
                openOnMainClick={openOnMainClick}
                disabled={disabled}
            />
        </Dropdown>
    </Select>
)) as ButtonSelectComponent;

export default ButtonSelect;

ButtonSelect.Item = ButtonSelectItem;
