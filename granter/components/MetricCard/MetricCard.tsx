import React from 'react';
import classNames from 'classnames';
import PlainButton from '../Button/PlainButton';
import Divider from '../Divider/Divider';
import Text from '../Text/Text';
import styles from './MetricCard.module.scss';

export type MetricCardVariant = 'compact' | 'standard' | 'narrow' | 'detail';

export type MetricCardDetailRow = {
    label: React.ReactNode;
    value: React.ReactNode;
    tone?: 'danger' | 'up' | 'down';
};

export type MetricCardProps = {
    children?: React.ReactNode;
    variant?: MetricCardVariant;
    onClick?: () => void;
    title?: React.ReactNode;
    rows?: MetricCardDetailRow[];
    total?: React.ReactNode;
};

const variantClassName: Record<MetricCardVariant, string> = {
    compact: styles.Compact,
    standard: styles.Standard,
    narrow: styles.Narrow,
    detail: styles.Detail,
};

const MetricCard = ({
    children,
    variant = 'compact',
    onClick,
    title,
    rows = [],
    total,
}: MetricCardProps) => {
    const useDetailLayout = variant === 'detail' && title !== undefined && total !== undefined;

    return (
        <PlainButton className={classNames(styles.Base, variantClassName[variant])} onClick={onClick}>
            {useDetailLayout ? (
                <>
                    <Text tone="muted">{title}</Text>

                    <div className={styles.DetailBody}>
                        <div className={styles.DetailRows}>
                            {rows.map((row) => (
                                <div key={String(row.label)} className={styles.DetailRow} data-tone={row.tone ?? 'normal'}>
                                    <Text tone="inherit" className={styles.DetailRowLabel}>
                                        {row.label}
                                    </Text>
                                    <Text as="strong" tone="inherit" weight="regular" className={styles.DetailRowValue}>
                                        {row.value}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <Divider color="var(--granter-gray-200)" marginY={8} />
                        <div className={styles.DetailTotalWrap}>
                            <Text as="strong" size="xl" weight="regular" className={styles.DetailTotal}>
                                {total}
                            </Text>
                        </div>
                    </div>
                </>
            ) : (
                children
            )}
        </PlainButton>
    );
};

export default MetricCard;
