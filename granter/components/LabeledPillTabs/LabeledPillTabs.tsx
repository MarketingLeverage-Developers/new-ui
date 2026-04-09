import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './LabeledPillTabs.module.scss';

export type LabeledPillTabsTone =
    | 'green'
    | 'orange'
    | 'purple'
    | 'teal'
    | 'gray';

export type LabeledPillTabsVariant = 'default' | 'floating';
type LabeledPillTabsCarouselRole = 'current' | 'side' | 'hidden';
type LabeledPillTabsCarouselSide = 'prev' | 'next' | null;

export type LabeledPillTabsItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
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
    variant?: LabeledPillTabsVariant;
    onChange?: (value: T) => void;
    onItemClick?: (value: T) => void;
    itemClassName?: string;
    tabsClassName?: string;
    carousel?: boolean;
    fill?: boolean;
};

const LabeledPillTabs = <T extends string = string>({
    label,
    items,
    value,
    variant = 'default',
    onChange,
    onItemClick,
    className,
    itemClassName,
    tabsClassName,
    carousel = false,
    fill = false,
    ...props
}: LabeledPillTabsProps<T>) => {
    const activeIndex = items.findIndex((item) => item.value === value);
    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    const displayedItems = useMemo(
        () =>
            items.map((item, index) => {
                if (!carousel) {
                    return {
                        item,
                        key: item.value,
                        carouselRole: null as LabeledPillTabsCarouselRole | null,
                        carouselSide: null as LabeledPillTabsCarouselSide,
                    };
                }

                const itemCount = items.length;
                const forward = (index - currentIndex + itemCount) % itemCount;
                const backward = (currentIndex - index + itemCount) % itemCount;
                const relativeOffset = forward === 0 ? 0 : forward <= backward ? forward : -backward;

                const carouselRole: LabeledPillTabsCarouselRole =
                    relativeOffset === 0 ? 'current' : Math.abs(relativeOffset) === 1 ? 'side' : 'hidden';
                const carouselSide: LabeledPillTabsCarouselSide =
                    relativeOffset === -1 ? 'prev' : relativeOffset === 1 ? 'next' : null;

                return {
                    item,
                    key: item.value,
                    carouselRole,
                    carouselSide,
                };
            }),
        [carousel, currentIndex, items]
    );
    const hasPrevVisible = displayedItems.some(
        ({ carouselRole, carouselSide }) => carouselRole === 'side' && carouselSide === 'prev'
    );
    const hasNextVisible = displayedItems.some(
        ({ carouselRole, carouselSide }) => carouselRole === 'side' && carouselSide === 'next'
    );

    const handleItemSelect = useCallback(
        (itemValue: T, isActive: boolean) => {
            onChange?.(itemValue);

            if (!carousel || isActive) {
                onItemClick?.(itemValue);
            }
        },
        [carousel, onChange, onItemClick]
    );

    return (
        <div
            className={classNames(styles.Root, className)}
            data-fill={fill ? 'true' : 'false'}
            data-variant={variant}
            {...props}
        >
            {label ? <span className={styles.Label}>{label}</span> : null}
            <div className={styles.Carousel} data-fill={fill ? 'true' : 'false'}>
                <div
                    className={styles.Viewport}
                    data-carousel={carousel ? 'true' : 'false'}
                    data-fill={fill ? 'true' : 'false'}
                >
                    <div
                        className={classNames(styles.Tabs, tabsClassName)}
                        role="tablist"
                        data-carousel={carousel ? 'true' : 'false'}
                        data-carousel-has-prev={carousel && hasPrevVisible ? 'true' : 'false'}
                        data-carousel-has-next={carousel && hasNextVisible ? 'true' : 'false'}
                        data-fill={fill ? 'true' : 'false'}
                    >
                        {displayedItems.map(({ item, key, carouselRole, carouselSide }, itemIndex) => {
                            const active = item.value === value;
                            const tone = item.tone ?? 'gray';

                            return (
                                <React.Fragment key={key}>
                                    {!carousel && itemIndex > 0 ? (
                                        <span className={styles.Separator} aria-hidden="true" />
                                    ) : null}
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={classNames(styles.Item, itemClassName)}
                                        data-active={active ? 'true' : 'false'}
                                        data-carousel={carousel ? 'true' : undefined}
                                        data-carousel-role={carouselRole ?? undefined}
                                        data-carousel-side={carouselSide ?? undefined}
                                        data-tone={tone}
                                        data-fill={fill ? 'true' : 'false'}
                                        disabled={item.disabled}
                                        onClick={() => {
                                            if (item.disabled) return;
                                            handleItemSelect(item.value, active);
                                        }}
                                    >
                                        {item.icon ? <span className={styles.Icon}>{item.icon}</span> : null}
                                        <span className={styles.ItemLabel}>{item.label}</span>
                                        {item.trailingIcon ? (
                                            <span className={styles.TrailingIcon}>{item.trailingIcon}</span>
                                        ) : null}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabeledPillTabs;
