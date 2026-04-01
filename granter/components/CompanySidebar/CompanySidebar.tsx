import React from 'react';
import classNames from 'classnames';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { HiStar, HiOutlineStar } from 'react-icons/hi2';
import {
    closestCenter,
    DndContext,
    type DndContextProps,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bellIcon, kakaoIcon, smsIcon, unBellIcon } from '../../assets';
import styles from './CompanySidebar.module.scss';

export type CompanySidebarProps = {
    children: React.ReactNode;
    className?: string;
};

export type CompanySidebarHeaderProps = {
    children: React.ReactNode;
    className?: string;
};

export type CompanySidebarDisplayProps = {
    name: React.ReactNode;
    description?: React.ReactNode;
    profileSrc?: string;
    profileAlt?: string;
    icon?: React.ReactNode;
    trailing?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
};

export type CompanySidebarSearchInputProps = {
    value: string;
    onValueChange: (next: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
};

export type CompanySidebarTotalTextProps = {
    total: React.ReactNode;
    label?: React.ReactNode;
    className?: string;
};

export type CompanySidebarScrollProps = {
    children: React.ReactNode;
    className?: string;
};

export type CompanySidebarListProps = {
    children: React.ReactNode;
    className?: string;
    sortable?: boolean;
    draggingDisabled?: boolean;
    sortableIds?: UniqueIdentifier[];
    dndSensors?: DndContextProps['sensors'];
    onSortEnd?: (event: DragEndEvent) => void;
};

export type CompanySidebarItemModel = {
    key?: React.Key;
    name: React.ReactNode;
    description?: React.ReactNode;
    profileSrc?: string;
    profileAlt?: string;
    icon?: React.ReactNode;
    trailing?: React.ReactNode;
    isFavorite?: boolean;
    notificationOn?: boolean;
    deliveryType?: string;
};

export type CompanySidebarItemProps = {
    item?: CompanySidebarItemModel;
    sortable?: boolean;
    sortableId?: UniqueIdentifier;
    draggingDisabled?: boolean;
    label?: React.ReactNode;
    description?: React.ReactNode;
    profileSrc?: string;
    profileAlt?: string;
    icon?: React.ReactNode;
    trailing?: React.ReactNode;
    isFavorite?: boolean;
    showStatusIcons?: boolean;
    notificationOn?: boolean;
    deliveryType?: string;
    onFavoriteToggle?: () => void;
    favoriteAriaLabel?: string;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
};

const CompanySidebarHeader = ({ children, className }: CompanySidebarHeaderProps) => (
    <div className={classNames(styles.Header, className)}>{children}</div>
);

const CompanySidebarDisplay = ({
    name,
    description,
    profileSrc,
    profileAlt = '업체 프로필',
    icon,
    trailing,
    onClick,
    disabled = false,
    className,
}: CompanySidebarDisplayProps) => (
    <button
        type="button"
        className={classNames(styles.DisplayButton, className)}
        onClick={onClick}
        disabled={disabled}
    >
        <span className={styles.DisplayMeta}>
            {profileSrc ? <img className={styles.DisplayProfile} src={profileSrc} alt={profileAlt} /> : null}
            {icon ? <span className={styles.DisplayIcon}>{icon}</span> : null}
            <span className={styles.DisplayCopy}>
                <span className={styles.DisplayName}>{name}</span>
                {description ? <span className={styles.DisplayDescription}>{description}</span> : null}
            </span>
        </span>
        {trailing ? <span className={styles.DisplayTrailing}>{trailing}</span> : null}
    </button>
);

const CompanySidebarSearchInput = ({
    value,
    onValueChange,
    placeholder = '검색',
    ariaLabel = placeholder,
    className,
}: CompanySidebarSearchInputProps) => (
    <div className={classNames(styles.SearchWrap, className)}>
        <div className={styles.SearchInput}>
            <FiSearch size={14} />
            <input
                type="text"
                className={styles.SearchInputField}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel}
            />
            <button
                type="button"
                className={styles.ClearButton}
                data-empty={value.length === 0 ? 'true' : 'false'}
                onClick={() => onValueChange('')}
                aria-label="검색어 지우기"
            >
                <IoCloseOutline size={14} />
            </button>
        </div>
    </div>
);

const CompanySidebarTotalText = ({
    total,
    label = '총',
    className,
}: CompanySidebarTotalTextProps) => (
    <p className={classNames(styles.TotalText, className)}>
        {label} <strong className={styles.TotalValue}>{total}</strong>개
    </p>
);

const CompanySidebarScroll = ({ children, className }: CompanySidebarScrollProps) => (
    <div className={classNames(styles.Scroll, className)}>{children}</div>
);

type CompanySidebarListContextValue = {
    sortable: boolean;
    draggingDisabled: boolean;
};

const CompanySidebarListContext = React.createContext<CompanySidebarListContextValue>({
    sortable: false,
    draggingDisabled: false,
});

const CompanySidebarList = ({
    children,
    className,
    sortable = false,
    draggingDisabled = false,
    sortableIds,
    dndSensors,
    onSortEnd,
}: CompanySidebarListProps) => {
    const content = (
        <CompanySidebarListContext.Provider
            value={{
                sortable,
                draggingDisabled,
            }}
        >
            <div className={classNames(styles.List, className)}>{children}</div>
        </CompanySidebarListContext.Provider>
    );

    if (!sortable || !onSortEnd || !sortableIds || sortableIds.length === 0) {
        return content;
    }

    return (
        <DndContext
            sensors={dndSensors}
            collisionDetection={closestCenter}
            onDragEnd={onSortEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {content}
            </SortableContext>
        </DndContext>
    );
};

const CompanySidebarItem = ({
    item,
    sortable,
    sortableId,
    draggingDisabled,
    label,
    description,
    profileSrc,
    profileAlt = '업체 프로필',
    icon,
    trailing,
    isFavorite = false,
    showStatusIcons = false,
    notificationOn = false,
    deliveryType,
    onFavoriteToggle,
    favoriteAriaLabel,
    isActive = false,
    disabled = false,
    onClick,
    className,
}: CompanySidebarItemProps) => {
    const listContext = React.useContext(CompanySidebarListContext);
    const resolvedLabel = item?.name ?? label;
    const resolvedDescription = item?.description ?? description;
    const resolvedProfileSrc = item?.profileSrc ?? profileSrc;
    const resolvedProfileAlt = item?.profileAlt ?? profileAlt;
    const resolvedIcon = item?.icon ?? icon;
    const resolvedTrailing = item?.trailing ?? trailing;
    const resolvedIsFavorite = item?.isFavorite ?? isFavorite;
    const resolvedNotificationOn = item?.notificationOn ?? notificationOn;
    const resolvedDeliveryType = item?.deliveryType ?? deliveryType;
    const resolvedDeliveryIcon = resolvedDeliveryType === 'KAKAO' ? kakaoIcon : smsIcon;
    const resolvedNotificationIcon = resolvedNotificationOn ? bellIcon : unBellIcon;
    const resolvedSortable = sortable ?? listContext.sortable;
    const resolvedDraggingDisabled = draggingDisabled ?? listContext.draggingDisabled;
    const fallbackSortableId = React.useId();
    const resolvedSortableId = sortableId ?? item?.key ?? fallbackSortableId;
    const sortableDisabled = disabled || resolvedDraggingDisabled || !resolvedSortable;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: resolvedSortableId,
        disabled: sortableDisabled,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(sortableDisabled ? {} : attributes)}
            {...(sortableDisabled ? {} : listeners)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            className={classNames(styles.Item, className)}
            data-active={isActive ? 'true' : 'false'}
            data-disabled={disabled ? 'true' : 'false'}
            onClick={(event) => {
                if (disabled) return;
                onClick?.(event);
            }}
            onKeyDown={(event) => {
                if (disabled) return;
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.currentTarget.click();
            }}
        >
            <span className={styles.ItemMeta}>
                {resolvedProfileSrc ? (
                    <img className={styles.ItemProfile} src={resolvedProfileSrc} alt={resolvedProfileAlt} />
                ) : null}
                {resolvedIcon ? <span className={styles.ItemIcon}>{resolvedIcon}</span> : null}
                <span className={styles.ItemCopy}>
                    <span className={styles.ItemLabel}>{resolvedLabel}</span>
                    {resolvedDescription ? (
                        <span className={styles.ItemDescription}>{resolvedDescription}</span>
                    ) : null}
                </span>
            </span>

            {showStatusIcons ? (
                <span className={styles.StatusIcons}>
                    <img className={styles.StatusIconImage} src={resolvedNotificationIcon} alt="알림" />
                    <img className={styles.StatusIconImage} src={resolvedDeliveryIcon} alt="발송 타입" />
                </span>
            ) : null}
            {resolvedTrailing ? <span className={styles.ItemTrailing}>{resolvedTrailing}</span> : null}
            {onFavoriteToggle ? (
                <button
                    type="button"
                    className={styles.FavoriteButton}
                    data-active={resolvedIsFavorite ? 'true' : 'false'}
                    aria-label={favoriteAriaLabel ?? (resolvedIsFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가')}
                    onPointerDown={(event) => {
                        event.stopPropagation();
                    }}
                    onClick={(event) => {
                        if (disabled) return;
                        event.stopPropagation();
                        onFavoriteToggle();
                    }}
                    disabled={disabled}
                >
                    <span className={styles.FavoriteIcon}>
                        {resolvedIsFavorite ? <HiStar size={16} /> : <HiOutlineStar size={16} />}
                    </span>
                </button>
            ) : null}
        </div>
    );
};

type CompanySidebarComponent = ((props: CompanySidebarProps) => React.ReactElement) & {
    Header: typeof CompanySidebarHeader;
    Display: typeof CompanySidebarDisplay;
    SearchInput: typeof CompanySidebarSearchInput;
    TotalText: typeof CompanySidebarTotalText;
    Scroll: typeof CompanySidebarScroll;
    List: typeof CompanySidebarList;
    Item: typeof CompanySidebarItem;
};

const CompanySidebar = (({ children, className }: CompanySidebarProps) => (
    <aside className={classNames(styles.CompanySidebar, className)}>{children}</aside>
)) as CompanySidebarComponent;

export default CompanySidebar;

CompanySidebar.Header = CompanySidebarHeader;
CompanySidebar.Display = CompanySidebarDisplay;
CompanySidebar.SearchInput = CompanySidebarSearchInput;
CompanySidebar.TotalText = CompanySidebarTotalText;
CompanySidebar.Scroll = CompanySidebarScroll;
CompanySidebar.List = CompanySidebarList;
CompanySidebar.Item = CompanySidebarItem;
