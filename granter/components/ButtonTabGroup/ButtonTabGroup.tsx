import React from 'react';
import classNames from 'classnames';
import styles from './ButtonTabGroup.module.scss';

export type ButtonTabGroupItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    tone?: 'default' | 'attention';
};

type ButtonTabGroupCssProperties = React.CSSProperties & {
    '--granter-button-tab-columns'?: string;
};

export type ButtonTabGroupProps<T extends string = string> = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    items: ButtonTabGroupItem<T>[];
    value: T;
    onChange?: (value: T) => void;
    columns?: number;
    itemClassName?: string;
};

const ButtonTabGroup = <T extends string = string>({
    items,
    value,
    onChange,
    columns = 2,
    className,
    itemClassName,
    style,
    ...props
}: ButtonTabGroupProps<T>) => {
    const cssVariables: ButtonTabGroupCssProperties = {
        '--granter-button-tab-columns': String(columns),
        ...style,
    };

    return (
        <div className={classNames(styles.Root, className)} style={cssVariables} role="tablist" {...props}>
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
                        data-tone={item.tone ?? 'default'}
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.disabled) return;
                            onChange?.(item.value);
                        }}
                    >
                        <span className={styles.Label}>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ButtonTabGroup;
