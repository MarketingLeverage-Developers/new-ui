import React from 'react';
import classNames from 'classnames';
import styles from './HeaderTabs.module.scss';

export type HeaderTabsItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export type HeaderTabsProps<T extends string = string> = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    items: HeaderTabsItem<T>[];
    value?: T;
    onChange?: (value: T) => void;
    itemClassName?: string;
};

const HeaderTabs = <T extends string = string>({
    items,
    value,
    onChange,
    className,
    itemClassName,
    ...props
}: HeaderTabsProps<T>) => (
    <div className={classNames(styles.Root, className)} role="tablist" {...props}>
        {items.map((item) => {
            const active = item.value === value;

            return (
                <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={classNames(styles.Item, itemClassName)}
                    data-active={active ? 'true' : 'false'}
                    disabled={item.disabled}
                    onClick={() => {
                        if (item.disabled) return;
                        onChange?.(item.value);
                    }}
                >
                    <span className={styles.ItemContent}>
                        {item.icon ? <span className={styles.ItemIcon}>{item.icon}</span> : null}
                        <span className={styles.ItemLabel}>{item.label}</span>
                    </span>
                </button>
            );
        })}
    </div>
);

export default HeaderTabs;
