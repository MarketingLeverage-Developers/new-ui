import React from 'react';
import classNames from 'classnames';
import styles from './BookmarkTabs.module.scss';

export type BookmarkTabsItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    background?: string;
    hoverBackground?: string;
    activeBackground?: string;
    color?: string;
    activeColor?: string;
};

export type BookmarkTabsProps<T extends string = string> = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    items: BookmarkTabsItem<T>[];
    value: T;
    onChange?: (value: T) => void;
    attached?: boolean;
    itemClassName?: string;
};

const BookmarkTabs = <T extends string = string>({
    items,
    value,
    onChange,
    attached = false,
    className,
    itemClassName,
    ...props
}: BookmarkTabsProps<T>) => {
    return (
        <div
            className={classNames(styles.Root, className)}
            data-attached={attached ? 'true' : 'false'}
            role="tablist"
            {...props}
        >
            <div className={styles.Rail}>
                {items.map((item, index) => {
                    const isActive = item.value === value;
                    const itemStyle = {
                        zIndex: isActive ? items.length + 1 : items.length - index,
                        '--bookmark-tab-item-bg': item.background,
                        '--bookmark-tab-item-hover-bg': item.hoverBackground,
                        '--bookmark-tab-item-active-bg': item.activeBackground,
                        '--bookmark-tab-item-text-color': item.color,
                        '--bookmark-tab-item-active-text-color': item.activeColor,
                    } as React.CSSProperties;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={classNames(styles.Item, itemClassName)}
                            data-active={isActive ? 'true' : 'false'}
                            style={itemStyle}
                            disabled={item.disabled}
                            onClick={() => {
                                if (item.disabled) return;
                                onChange?.(item.value);
                            }}
                        >
                            <span className={styles.Surface} aria-hidden="true" />
                            <span className={styles.Label}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BookmarkTabs;
