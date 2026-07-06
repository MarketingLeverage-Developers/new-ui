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

type SearchableButtonDropdownContentProps = ButtonDropdownContentProps & {
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    menuMaxHeight?: number | string;
};

export type ButtonDropdownItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'className'> & {
    value: string;
    children: React.ReactNode;
    searchText?: string;
    onSelect?: () => void;
};

type ButtonDropdownComponent = React.FC<ButtonDropdownProps> & {
    Trigger: React.FC<ButtonDropdownTriggerProps>;
    Content: React.FC<SearchableButtonDropdownContentProps>;
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

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

const getNodeSearchText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(getNodeSearchText).join(' ');
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return getNodeSearchText(node.props.children);
    }

    return '';
};

const Content = ({
    children,
    keepMounted = false,
    searchable = false,
    searchPlaceholder = '검색어를 입력해주세요.',
    searchEmptyText = '검색 결과가 없습니다.',
    menuMaxHeight,
    style,
    ...props
}: SearchableButtonDropdownContentProps) => {
    const { isOpen } = useHeadlessDropdown();
    const [searchQuery, setSearchQuery] = React.useState('');
    const normalizedSearchQuery = normalizeSearchText(searchQuery);

    React.useEffect(() => {
        if (isOpen) return;
        setSearchQuery('');
    }, [isOpen]);

    const filteredChildren = React.useMemo(() => {
        const childItems = React.Children.toArray(children);
        if (!searchable || !normalizedSearchQuery) return childItems;

        return childItems.filter((child) => {
            if (!React.isValidElement<ButtonDropdownItemProps>(child)) return true;

            const searchableText = normalizeSearchText(
                [child.props.searchText, child.props.value, getNodeSearchText(child.props.children)]
                    .filter(Boolean)
                    .join(' ')
            );

            return searchableText.includes(normalizedSearchQuery);
        });
    }, [children, normalizedSearchQuery, searchable]);

    return (
        <HeadlessDropdown.Content
            className={styles.Menu}
            keepMounted={keepMounted}
            style={{ maxHeight: menuMaxHeight, ...style }}
            {...props}
        >
            {searchable ? (
                <div className={styles.SearchWrap}>
                    <input
                        type="text"
                        value={searchQuery}
                        className={styles.SearchInput}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                </div>
            ) : null}

            <div className={styles.OptionsViewport}>
                {filteredChildren.length > 0 ? filteredChildren : <div className={styles.Empty}>{searchEmptyText}</div>}
            </div>
        </HeadlessDropdown.Content>
    );
};

const Item = ({ value, children, disabled, searchText: _searchText, onSelect, onClick, ...props }: ButtonDropdownItemProps) => {
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
