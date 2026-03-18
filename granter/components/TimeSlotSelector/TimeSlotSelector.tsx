import React from 'react';
import classNames from 'classnames';
import styles from './TimeSlotSelector.module.scss';

type TimeSlotSelectorCssProperties = React.CSSProperties & {
    '--granter-time-slot-min-width'?: string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type TimeSlotSelectorOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};

export type TimeSlotSelectorProps<T extends string = string> = {
    options: TimeSlotSelectorOption<T>[];
    selectedValues: T[];
    onToggle: (value: T) => void;
    guide?: React.ReactNode;
    summary?: React.ReactNode;
    className?: string;
    minItemWidth?: number | string;
};

const TimeSlotSelector = <T extends string = string>({
    options,
    selectedValues,
    onToggle,
    guide,
    summary,
    className,
    minItemWidth = 52,
}: TimeSlotSelectorProps<T>) => {
    const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
    const cssVariables: TimeSlotSelectorCssProperties = {
        '--granter-time-slot-min-width': toCssLength(minItemWidth),
    };

    return (
        <div className={classNames(styles.Root, className)} style={cssVariables}>
            {guide ? <p className={styles.Guide}>{guide}</p> : null}

            <div className={styles.List}>
                {options.map((option) => {
                    const isActive = selectedSet.has(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={styles.Item}
                            data-active={isActive ? 'true' : 'false'}
                            aria-pressed={isActive}
                            disabled={option.disabled}
                            onClick={() => {
                                if (option.disabled) return;
                                onToggle(option.value);
                            }}
                        >
                            <span className={styles.ItemLabel}>{option.label}</span>
                        </button>
                    );
                })}
            </div>

            {summary ? <p className={styles.Summary}>{summary}</p> : null}
        </div>
    );
};

export default TimeSlotSelector;
