import React from 'react';
import MetricCard from '../MetricCard/MetricCard';
import Text from '../Text/Text';
import styles from './MetricValueCard.module.scss';

export type MetricValueCardVariant = 'compact' | 'standard';
export type MetricValueTone = 'default' | 'up' | 'down';

export type MetricValueCardProps = {
    title: React.ReactNode;
    value: React.ReactNode;
    sub?: React.ReactNode;
    valueTone?: MetricValueTone;
    variant?: MetricValueCardVariant;
    onClick?: () => void;
};

const variantMap: Record<MetricValueCardVariant, 'compact' | 'standard'> = {
    compact: 'compact',
    standard: 'standard',
};

const MetricValueCard = ({
    title,
    value,
    sub,
    valueTone = 'default',
    variant = 'compact',
    onClick,
}: MetricValueCardProps) => (
    <MetricCard variant={variantMap[variant]} onClick={onClick}>
        <Text tone="muted" className={styles.Label}>
            {title}
        </Text>
        <Text as="strong" size="xl" weight="semibold" tone={valueTone} className={styles.Value}>
            {value}
        </Text>
        {sub ? (
            <Text tone="subtle" className={styles.Sub}>
                {sub}
            </Text>
        ) : null}
    </MetricCard>
);

export default MetricValueCard;
