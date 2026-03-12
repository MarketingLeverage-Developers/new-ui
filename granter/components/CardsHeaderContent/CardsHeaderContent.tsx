import React from 'react';
import classNames from 'classnames';
import { FiLoader } from 'react-icons/fi';
import { HiOutlineChevronDown, HiOutlineSparkles } from 'react-icons/hi2';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import type { DateRange } from 'react-day-picker';
import DateRangeCalendar from '../DateRangeCalendar/DateRangeCalendar';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './CardsHeaderContent.module.scss';

const noop = () => undefined;

export type HeaderProps = {
    children: React.ReactNode;
    className?: string;
};

export type HeaderSectionProps = {
    children: React.ReactNode;
    className?: string;
};

export type HeaderBackButtonProps = {
    onClick?: () => void;
    className?: string;
};

export type HeaderBreadcrumbProps = {
    children: React.ReactNode;
    className?: string;
};

export type HeaderDateRangeControlProps = {
    dateLabel: React.ReactNode;
    onPrevDate?: () => void;
    onNextDate?: () => void;
    onDateLabelClick?: () => void;
    value?: HeaderDateRangeValue;
    defaultValue?: HeaderDateRangeValue;
    onValueChange?: (next: HeaderDateRangeValue) => void;
    className?: string;
};

export type HeaderDateRangeValue = {
    from?: string;
    to?: string;
};

export type HeaderRefreshingButtonProps = {
    onClick?: () => void;
    className?: string;
};

export type HeaderSupportButtonProps = {
    label?: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

export type HeaderAskButtonProps = {
    label?: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

const HeaderLeft = ({ children, className }: HeaderSectionProps) => (
    <div className={classNames(styles.Left, className)}>{children}</div>
);

const HeaderCenter = ({ children, className }: HeaderSectionProps) => (
    <div className={classNames(styles.Center, className)}>{children}</div>
);

const HeaderRight = ({ children, className }: HeaderSectionProps) => (
    <div className={classNames(styles.Right, className)}>{children}</div>
);

const HeaderBackButton = ({ onClick = noop, className }: HeaderBackButtonProps) => (
    <button
        type="button"
        className={classNames(styles.BackButton, className)}
        aria-label="뒤로가기"
        onClick={onClick}
    >
        <IoIosArrowBack size={16} />
    </button>
);

const HeaderBreadcrumb = ({ children, className }: HeaderBreadcrumbProps) => (
    <div className={classNames(styles.Breadcrumb, className)}>{children}</div>
);

const DATE_RANGE_PATTERN = /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/;

const parseIsoDate = (value?: string): Date | undefined => {
    if (!value) return undefined;

    const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!matched) return undefined;

    const year = Number(matched[1]);
    const month = Number(matched[2]);
    const day = Number(matched[3]);

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined;

    return date;
};

const formatIsoDate = (date?: Date) => {
    if (!date) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const parseDateRangeLabel = (label: React.ReactNode): DateRange | undefined => {
    if (typeof label !== 'string') return undefined;

    const matched = DATE_RANGE_PATTERN.exec(label);
    if (!matched) return undefined;

    const from = parseIsoDate(matched[1]);
    const to = parseIsoDate(matched[2]);

    if (!from || !to) return undefined;

    return { from, to };
};

const toDateRange = (value?: HeaderDateRangeValue): DateRange | undefined => {
    const from = parseIsoDate(value?.from);
    const to = parseIsoDate(value?.to);

    if (!from && !to) return undefined;
    return { from, to };
};

const toDateRangeValue = (value?: DateRange): HeaderDateRangeValue => ({
    from: formatIsoDate(value?.from),
    to: formatIsoDate(value?.to),
});

const formatDateRangeLabel = (value?: DateRange) => {
    const from = formatIsoDate(value?.from);
    const to = formatIsoDate(value?.to);

    if (!from || !to) return undefined;
    return `${from} ~ ${to}`;
};

const buildFallbackRange = (): DateRange => {
    const today = new Date();
    return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
};

const HeaderDateRangeTrigger = ({
    label,
    onClick,
}: {
    label: React.ReactNode;
    onClick?: () => void;
}) => {
    const { isOpen } = useDropdown();

    return (
        <Dropdown.Trigger className={styles.DateLabelTrigger} onClick={onClick}>
            <button
                type="button"
                className={styles.DateLabelButton}
                data-open={isOpen ? 'true' : 'false'}
                aria-label={typeof label === 'string' ? label : undefined}
            >
                <span className={styles.DateLabel}>{label}</span>
            </button>
        </Dropdown.Trigger>
    );
};

const HeaderDateRangeControl = ({
    dateLabel,
    onPrevDate = noop,
    onNextDate = noop,
    onDateLabelClick,
    value,
    defaultValue,
    onValueChange,
    className,
}: HeaderDateRangeControlProps) => {
    const initialRange =
        toDateRange(defaultValue) ??
        toDateRange(value) ??
        parseDateRangeLabel(dateLabel) ??
        buildFallbackRange();

    const [innerRange, setInnerRange] = React.useState<DateRange | undefined>(initialRange);
    const controlledRange = toDateRange(value);
    const selectedRange = controlledRange ?? innerRange ?? buildFallbackRange();

    React.useEffect(() => {
        if (value || defaultValue) return;

        const parsed = parseDateRangeLabel(dateLabel);
        if (!parsed) return;

        setInnerRange(parsed);
    }, [dateLabel, defaultValue, value]);

    const displayLabel = formatDateRangeLabel(selectedRange) ?? dateLabel;

    const handleRangeChange = (nextRange: DateRange | undefined) => {
        if (!value) setInnerRange(nextRange);
        onValueChange?.(toDateRangeValue(nextRange));
    };

    return (
        <Dropdown>
            <div className={classNames(styles.DateRangeControl, className)}>
                <button type="button" className={styles.DateEdgeButton} aria-label="이전 기간" onClick={onPrevDate}>
                    <IoIosArrowBack size={14} />
                </button>

                <HeaderDateRangeTrigger label={displayLabel} onClick={onDateLabelClick} />

                <button type="button" className={styles.DateEdgeButton} aria-label="다음 기간" onClick={onNextDate}>
                    <IoIosArrowForward size={14} />
                </button>
            </div>

            <Dropdown.Content className={styles.DateDropdownContent} placement="bottom-center" offset={8}>
                <div className={styles.DateRangePanel}>
                    <DateRangeCalendar range={selectedRange} onChange={handleRangeChange} />
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
};

const HeaderRefreshingButton = ({
    onClick = noop,
    className,
}: HeaderRefreshingButtonProps) => (
    <button
        type="button"
        className={classNames(styles.RefreshingButton, className)}
        aria-label="동기화 상태"
        onClick={onClick}
    >
        <FiLoader size={17} />
    </button>
);

const HeaderSupportButton = ({
    label = '고객지원',
    onClick = noop,
    className,
}: HeaderSupportButtonProps) => (
    <button type="button" className={classNames(styles.SupportButton, className)} onClick={onClick}>
        <span>{label}</span>
        <HiOutlineChevronDown size={14} />
    </button>
);

const HeaderAskButton = ({
    label = 'AI에 질문',
    onClick = noop,
    className,
}: HeaderAskButtonProps) => (
    <button type="button" className={classNames(styles.AskButton, className)} onClick={onClick}>
        <HiOutlineSparkles size={14} />
        <span>{label}</span>
    </button>
);

type HeaderComponent = ((props: HeaderProps) => React.ReactElement) & {
    Left: typeof HeaderLeft;
    Center: typeof HeaderCenter;
    Right: typeof HeaderRight;
    BackButton: typeof HeaderBackButton;
    Breadcrumb: typeof HeaderBreadcrumb;
    DateRangeControl: typeof HeaderDateRangeControl;
    RefreshingButton: typeof HeaderRefreshingButton;
    SupportButton: typeof HeaderSupportButton;
    AskButton: typeof HeaderAskButton;
};

const Header = (({ children, className }: HeaderProps) => (
    <div className={classNames(styles.CardsHeaderContent, className)}>{children}</div>
)) as HeaderComponent;

export default Header;

Header.Left = HeaderLeft;
Header.Center = HeaderCenter;
Header.Right = HeaderRight;
Header.BackButton = HeaderBackButton;
Header.Breadcrumb = HeaderBreadcrumb;
Header.DateRangeControl = HeaderDateRangeControl;
Header.RefreshingButton = HeaderRefreshingButton;
Header.SupportButton = HeaderSupportButton;
Header.AskButton = HeaderAskButton;
