import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './MetricSummaryStrip.module.scss';

export type MetricSummaryStripItem = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
};

export type MetricSummaryStripProps = {
    items: MetricSummaryStripItem[];
    className?: string;
    itemClassName?: string;
};

const MetricSummaryStrip = ({
    items,
    className,
    itemClassName,
}: MetricSummaryStripProps) => (
    <div className={classNames(styles.Strip, className)}>
        {items.map((item) => (
            <div key={item.key} className={classNames(styles.Item, itemClassName)}>
                <Text as="p" size="md" tone="muted" weight="regular" className={styles.Label}>
                    {item.label}
                </Text>
                <Text as="strong" weight="semibold" className={styles.Value}>
                    {item.value}
                </Text>
            </div>
        ))}
    </div>
);

export default MetricSummaryStrip;
