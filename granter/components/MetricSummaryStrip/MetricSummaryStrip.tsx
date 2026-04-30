import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './MetricSummaryStrip.module.scss';

export type MetricSummaryStripItem = {
    key: string;
    label: React.ReactNode;
    topValue?: React.ReactNode;
    value?: React.ReactNode;
    subValue?: React.ReactNode;
    splitMetrics?: {
        left: {
            icon?: React.ReactNode;
            main: React.ReactNode;
            sub?: React.ReactNode;
            tone?: 'default' | 'positive';
            color?: string;
        };
        right: {
            icon?: React.ReactNode;
            main: React.ReactNode;
            sub?: React.ReactNode;
            tone?: 'default' | 'positive';
            color?: string;
        };
    };
    onClick?: () => void;
    ariaLabel?: string;
    isSelected?: boolean;
};

export type MetricSummaryStripProps = {
    items: MetricSummaryStripItem[];
    className?: string;
    itemClassName?: string;
    layoutKey?: string;
};

const MetricSummaryStrip = React.memo(({
    items,
    className,
    itemClassName,
    layoutKey,
}: MetricSummaryStripProps) => (
    <div className={classNames(styles.Strip, className)}>
        {items.map((item) => {
            const content = item.splitMetrics ? (
                <>
                    <Text as="p" size="md" tone="muted" weight="regular" className={styles.Label}>
                        {item.label}
                    </Text>
                    <div key={layoutKey != null ? `${item.key}-${layoutKey}` : undefined} className={styles.SplitMetrics}>
                        <div className={styles.SplitColumn} data-tone={item.splitMetrics.left.tone ?? 'default'} style={item.splitMetrics.left.color ? { '--split-main-color': item.splitMetrics.left.color, '--split-sub-color': item.splitMetrics.left.color } as React.CSSProperties : undefined}>
                            <div className={styles.SplitMainRow}>
                                {item.splitMetrics.left.icon ? (
                                    <span className={styles.SplitIcon}>{item.splitMetrics.left.icon}</span>
                                ) : null}
                                <Text as="p" className={styles.SplitMainValue} tone="inherit">
                                    {item.splitMetrics.left.main}
                                </Text>
                            </div>
                            {item.splitMetrics.left.sub != null ? (
                                <Text as="p" className={styles.SplitSubValueBelow} tone="inherit">
                                    {item.splitMetrics.left.sub}
                                </Text>
                            ) : null}
                        </div>
                        <div className={styles.SplitColumn} data-tone={item.splitMetrics.right.tone ?? 'positive'} style={item.splitMetrics.right.color ? { '--split-main-color': item.splitMetrics.right.color, '--split-sub-color': item.splitMetrics.right.color } as React.CSSProperties : undefined}>
                            <div className={styles.SplitMainRow}>
                                {item.splitMetrics.right.icon ? (
                                    <span className={styles.SplitIcon}>{item.splitMetrics.right.icon}</span>
                                ) : null}
                                <Text as="p" className={styles.SplitMainValue} tone="inherit">
                                    {item.splitMetrics.right.main}
                                </Text>
                                {item.splitMetrics.right.sub != null ? (
                                    <Text as="p" className={styles.SplitSubValue} tone="inherit">
                                        {item.splitMetrics.right.sub}
                                    </Text>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Text as="p" size="md" tone="muted" weight="regular" className={styles.Label}>
                        {item.label}
                    </Text>
                    {item.topValue != null ? (
                        <Text as="p" size="sm" tone="muted" weight="regular" className={styles.TopValue}>
                            {item.topValue}
                        </Text>
                    ) : null}
                    {item.value != null ? (
                        <Text as="strong" weight="semibold" className={styles.Value}>
                            {item.value}
                        </Text>
                    ) : null}
                    {item.subValue != null ? (
                        <Text as="p" size="sm" tone="muted" weight="regular" className={styles.SubValue}>
                            {item.subValue}
                        </Text>
                    ) : null}
                </>
            );

            if (item.onClick) {
                return (
                    <button
                        key={item.key}
                        type="button"
                        onClick={item.onClick}
                        aria-label={item.ariaLabel}
                        className={classNames(styles.Item, itemClassName)}
                        data-clickable="true"
                        data-selected={item.isSelected ? 'true' : 'false'}
                        data-layout={item.splitMetrics ? 'split' : 'default'}
                    >
                        {content}
                    </button>
                );
            }

            return (
                <div
                    key={item.key}
                    className={classNames(styles.Item, itemClassName)}
                    data-selected={item.isSelected ? 'true' : 'false'}
                    data-layout={item.splitMetrics ? 'split' : 'default'}
                >
                    {content}
                </div>
            );
        })}
    </div>
));

MetricSummaryStrip.displayName = 'MetricSummaryStrip';

export default MetricSummaryStrip;
