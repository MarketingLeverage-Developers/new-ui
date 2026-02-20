import React from 'react';
import styles from './InflowMetricItem.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

export type InflowMetricItemProps = {
    value: number;
    label: string;
    max?: number;
    colorA: HexColor | ThemeColorVar;
    colorB?: HexColor | ThemeColorVar;
    logo?: string;
    percent: number;
    totalLabel?: string;
    percentLabel?: string;
};

const clampPercent = (value: number) => {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, value));
};

const InflowMetricItem = ({
    value,
    label,
    colorA,
    logo,
    percent,
    totalLabel = 'Total',
    percentLabel = 'Per',
}: InflowMetricItemProps) => {
    const safePercent = clampPercent(percent);

    return (
        <div className={styles.Item}>
            <div className={styles.Header}>
                {logo ? <img src={logo} alt={label} width={20} height={20} className={styles.Logo} /> : null}
                <span className={styles.Label}>{label}</span>
            </div>

            <div className={styles.Metrics}>
                <div className={styles.MetricColumn}>
                    <div className={styles.MetricHeader}>
                        <span className={styles.MetricTitle}>{totalLabel}</span>
                        <span className={styles.MetricValue}>{value}</span>
                    </div>
                </div>

                <div className={styles.MetricColumn}>
                    <div className={styles.MetricHeader}>
                        <span className={styles.MetricTitle}>{percentLabel}</span>
                        <span className={styles.MetricValue}>{`${percent}%`}</span>
                    </div>
                </div>
            </div>

            <div className={styles.ProgressWrap}>
                <div className={styles.ProgressTrack}>
                    <div className={styles.ProgressFill} style={{ width: `${safePercent}%`, backgroundColor: colorA as string }} />
                </div>
            </div>
        </div>
    );
};

export default InflowMetricItem;
