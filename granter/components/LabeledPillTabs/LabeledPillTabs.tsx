import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './LabeledPillTabs.module.scss';

export type LabeledPillTabsTone =
    | 'green'
    | 'orange'
    | 'purple'
    | 'teal'
    | 'gray';

export type LabeledPillTabsItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    icon?: React.ReactNode;
    tone?: LabeledPillTabsTone;
    disabled?: boolean;
};

export type LabeledPillTabsProps<T extends string = string> = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    label?: React.ReactNode;
    items: LabeledPillTabsItem<T>[];
    value?: T;
    onChange?: (value: T) => void;
    itemClassName?: string;
    tabsClassName?: string;
    carousel?: boolean;
    fill?: boolean;
};

const LabeledPillTabs = <T extends string = string>({
    label,
    items,
    value,
    onChange,
    className,
    itemClassName,
    tabsClassName,
    carousel = false,
    fill = false,
    ...props
}: LabeledPillTabsProps<T>) => {
    const activeIndex = items.findIndex((item) => item.value === value);
    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    const displayedItems = useMemo(() => {
        if (!carousel) return items;

        const currentItem = items[currentIndex];
        return currentItem ? [currentItem] : [];
    }, [carousel, currentIndex, items]);
    const hasCarouselNavigation = carousel && items.length > 1;

    const moveCarousel = useCallback(
        (direction: 'prev' | 'next') => {
            if (items.length === 0) return;

            const nextIndex =
                direction === 'next'
                    ? (currentIndex + 1) % items.length
                    : (currentIndex - 1 + items.length) % items.length;
            const nextItem = items[nextIndex];

            if (!nextItem) return;

            onChange?.(nextItem.value);
        },
        [currentIndex, items, onChange]
    );

    return (
        <div className={classNames(styles.Root, className)} data-fill={fill ? 'true' : 'false'} {...props}>
            {label ? <span className={styles.Label}>{label}</span> : null}
            <div className={styles.Carousel} data-fill={fill ? 'true' : 'false'}>
                {hasCarouselNavigation ? (
                    <button
                        type="button"
                        className={styles.NavButton}
                        aria-label="이전 항목"
                        onClick={() => moveCarousel('prev')}
                    >
                        <FiChevronLeft size={14} />
                    </button>
                ) : null}
                <div
                    className={styles.Viewport}
                    data-carousel={carousel ? 'true' : 'false'}
                    data-fill={fill ? 'true' : 'false'}
                >
                    <div
                        className={classNames(styles.Tabs, tabsClassName)}
                        role="tablist"
                        data-carousel={carousel ? 'true' : 'false'}
                        data-fill={fill ? 'true' : 'false'}
                    >
                        {displayedItems.map((item, itemIndex) => {
                            const active = item.value === value;
                            const tone = item.tone ?? 'gray';

                            return (
                                <React.Fragment key={item.value}>
                                    {itemIndex > 0 ? <span className={styles.Separator} aria-hidden="true" /> : null}
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={classNames(styles.Item, itemClassName)}
                                        data-active={active ? 'true' : 'false'}
                                        data-tone={tone}
                                        data-fill={fill ? 'true' : 'false'}
                                        disabled={item.disabled}
                                        onClick={() => {
                                            if (item.disabled) return;
                                            onChange?.(item.value);
                                        }}
                                    >
                                        {item.icon ? <span className={styles.Icon}>{item.icon}</span> : null}
                                        <span className={styles.ItemLabel}>{item.label}</span>
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                {hasCarouselNavigation ? (
                    <button
                        type="button"
                        className={styles.NavButton}
                        aria-label="다음 항목"
                        onClick={() => moveCarousel('next')}
                    >
                        <FiChevronRight size={14} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default LabeledPillTabs;
