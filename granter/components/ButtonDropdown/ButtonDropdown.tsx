import React from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import HeadlessDropdown, { useDropdown as useHeadlessDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import HeadlessSelect, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './ButtonDropdown.module.scss';

type ButtonDropdownContextType = {
    disabled: boolean;
};

const ButtonDropdownContext = React.createContext<ButtonDropdownContextType | undefined>(undefined);

const useButtonDropdownContext = () => {
    const context = React.useContext(ButtonDropdownContext);
    if (!context) {
        throw new Error('useButtonDropdownContext must be used within ButtonDropdown');
    }
    return context;
};

export type ButtonDropdownWidthPreset = 'fit' | 'download' | 'full';

export type ButtonDropdownProps = {
    children: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onChange?: (next: string) => void;
    widthPreset?: ButtonDropdownWidthPreset;
    disabled?: boolean;
};

export type ButtonDropdownTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'className'> & {
    label: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    dropdownIcon?: React.ReactNode;
    showDropdownIcon?: boolean;
    type?: 'button' | 'submit' | 'reset';
};

export type ButtonDropdownContentProps = Omit<React.ComponentProps<typeof HeadlessDropdown.Content>, 'className'>;

export type ButtonDropdownItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'className'> & {
    value: string;
    children: React.ReactNode;
    onSelect?: () => void;
};

type ButtonDropdownComponent = React.FC<ButtonDropdownProps> & {
    Trigger: React.FC<ButtonDropdownTriggerProps>;
    Content: React.FC<ButtonDropdownContentProps>;
    Item: React.FC<ButtonDropdownItemProps>;
};

const Trigger = ({
    label,
    variant = 'outline',
    size = 'lg',
    leftIcon,
    dropdownIcon,
    showDropdownIcon = true,
    type = 'button',
    onClick,
    ...props
}: ButtonDropdownTriggerProps) => {
    const { disabled } = useButtonDropdownContext();
    const { isOpen } = useHeadlessDropdown();

    return (
        <HeadlessDropdown.Trigger className={styles.TriggerWrap} disabled={disabled}>
            <Button
                {...props}
                type={type}
                variant={variant}
                size={size}
                className={styles.Trigger}
                leftIcon={leftIcon}
                rightIcon={
                    showDropdownIcon ? (
                        <span className={styles.DropdownIcon} data-open={isOpen ? 'true' : 'false'}>
                            {dropdownIcon ?? <HiOutlineChevronDown size={14} />}
                        </span>
                    ) : undefined
                }
                onClick={onClick}
                disabled={disabled}
            >
                {label}
            </Button>
        </HeadlessDropdown.Trigger>
    );
};

const Content = ({ children, keepMounted = false, ...props }: ButtonDropdownContentProps) => (
    <HeadlessDropdown.Content className={styles.Menu} keepMounted={keepMounted} {...props}>
        {children}
    </HeadlessDropdown.Content>
);

const Item = ({ value, children, disabled, onSelect, onClick, ...props }: ButtonDropdownItemProps) => {
    const context = useButtonDropdownContext();
    const { close } = useHeadlessDropdown();
    const { isActive, changeSelectValue } = useSelect();

    const isDisabled = Boolean(context.disabled || disabled);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (isDisabled) return;
        changeSelectValue(value);
        onSelect?.();
        onClick?.(event);
        close();
    };

    return (
        <button
            {...props}
            type="button"
            className={styles.Option}
            data-active={isActive(value) ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};

const ButtonDropdown = (({
    children,
    value,
    defaultValue,
    onChange,
    widthPreset = 'fit',
    disabled = false,
}: ButtonDropdownProps) => (
    <ButtonDropdownContext.Provider value={{ disabled }}>
        <HeadlessSelect value={value} defaultValue={defaultValue} onChange={onChange}>
            <HeadlessDropdown>
                <div className={styles.Root} data-width-preset={widthPreset}>
                    {children}
                </div>
            </HeadlessDropdown>
        </HeadlessSelect>
    </ButtonDropdownContext.Provider>
)) as ButtonDropdownComponent;

ButtonDropdown.Trigger = Trigger;
ButtonDropdown.Content = Content;
ButtonDropdown.Item = Item;

export default ButtonDropdown;
