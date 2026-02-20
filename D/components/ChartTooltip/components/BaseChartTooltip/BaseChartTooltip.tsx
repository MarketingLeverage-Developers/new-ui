import React from 'react';
import styles from './BaseChartTooltip.module.scss';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { HexColor } from '@/shared/types/css/HexColor';

const numberFmt = (value?: number | string) => {
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string' && value.length > 0) return value;
    return '-';
};

export type ChartTooltipSeries = {
    key: string;
    label: string;
    color: HexColor | ThemeColorVar;
};

export type ChartTooltipPayloadItem = {
    dataKey?: string | number;
    value?: number | string;
};

export type BaseChartTooltipProps = {
    payload?: ChartTooltipPayloadItem[];
    label?: string;
    series?: ChartTooltipSeries[];
};

const BaseChartTooltip: React.FC<BaseChartTooltipProps> = ({ payload, label, series }) => {
    if (!payload || payload.length === 0) return null;

    return (
        <div className={styles.TooltipWrapper}>
            {label ? <div className={styles.TooltipHeader}>{label}</div> : null}

            <div className={styles.TooltipContents}>
                {series?.map((item) => {
                    const matched = payload.find((entry) => entry.dataKey === item.key);

                    return (
                        <div key={item.key} className={styles.TooltipItem}>
                            <span className={styles.TooltipDot} style={{ backgroundColor: item.color as string }} />
                            <span className={styles.TooltipLabel}>{item.label}</span>
                            <span className={styles.TooltipValue}>{numberFmt(matched?.value)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BaseChartTooltip;
