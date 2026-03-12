import React from 'react';
import MetricCard from '../MetricCard/MetricCard';
import Text from '../Text/Text';
import styles from './MetricStatusCard.module.scss';

export type MetricStatusCardProps = {
    label: React.ReactNode;
    count: React.ReactNode;
    action: React.ReactNode;
    onClick?: () => void;
};

const MetricStatusCard = ({ label, count, action, onClick }: MetricStatusCardProps) => (
    <MetricCard variant="narrow" onClick={onClick}>
        <Text size="sm" tone="up" weight="medium">
            {label}
        </Text>
        <Text as="strong" size="xl" weight="bold" className={styles.Count}>
            {count}
        </Text>
        <Text as="em" size="sm" weight="semibold" tone="up" className={styles.Action}>
            {action}
        </Text>
    </MetricCard>
);

export default MetricStatusCard;
