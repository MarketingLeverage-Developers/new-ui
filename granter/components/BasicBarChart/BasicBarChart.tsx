import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './BasicBarChart.module.scss';

export type BasicBarChartDatum = Record<string, string | number | null | undefined>;

export type BasicBarChartSeries = {
    key: string;
    label: React.ReactNode;
    color: string;
    stackId?: string;
    barSize?: number;
};

export type BasicBarChartProps = {
    data: BasicBarChartDatum[];
    xKey: string;
    series: BasicBarChartSeries[];
    width?: number | string;
    height?: number | string;
    margin?: {
        top?: number;
        right?: number;
        left?: number;
        bottom?: number;
    };
    barCategoryGap?: string | number;
    yAxisWidth?: number;
    yTickFormatter?: (value: number) => string;
    yDomain?: Array<number | string | ((value: number) => number)>;
    valueFormatter?: (seriesKey: string, value: number, payloadItem?: unknown) => React.ReactNode;
};

type TooltipPayloadItem = {
    dataKey?: string;
    value?: number | string;
    payload?: unknown;
};

type TooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    series: BasicBarChartSeries[];
    valueFormatter?: BasicBarChartProps['valueFormatter'];
};

const TooltipContent = ({
    active,
    payload,
    label,
    series,
    valueFormatter,
}: TooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className={styles.Tooltip}>
            {label ? <div className={styles.TooltipHeader}>{label}</div> : null}
            <div className={styles.TooltipBody}>
                {series.map((item) => {
                    const matchedPayload = payload.find((payloadItem) => payloadItem.dataKey === item.key);
                    const value = Number(matchedPayload?.value);

                    return (
                        <div key={item.key} className={styles.TooltipRow}>
                            <span className={styles.TooltipDot} style={{ backgroundColor: item.color }} />
                            <span className={styles.TooltipLabel}>{item.label}</span>
                            <span className={styles.TooltipValue}>
                                {!Number.isFinite(value)
                                    ? '-'
                                    : valueFormatter?.(item.key, value, matchedPayload?.payload) ?? value.toLocaleString('ko-KR')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BasicBarChart = ({
    data,
    xKey,
    series,
    width = '100%',
    height = '100%',
    margin = { top: 8, right: 12, left: 0, bottom: 8 },
    barCategoryGap = '30%',
    yAxisWidth = 54,
    yTickFormatter,
    yDomain,
    valueFormatter,
}: BasicBarChartProps) => (
    <BarChart width={width} height={height} data={data} margin={margin} barCategoryGap={barCategoryGap}>
        <CartesianGrid stroke="#EEF2F7" vertical={false} />
        <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            fontSize={12}
            tickMargin={8}
        />
        <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickMargin={6}
            tickFormatter={yTickFormatter}
            domain={yDomain as never}
        />
        <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            content={(props) => (
                <TooltipContent
                    active={Boolean(props.active)}
                    payload={(props.payload ?? []) as TooltipPayloadItem[]}
                    label={props.label ? String(props.label) : ''}
                    series={series}
                    valueFormatter={valueFormatter}
                />
            )}
        />
        {series.map((item) => (
            <Bar
                key={item.key}
                dataKey={item.key}
                name={String(item.label)}
                stackId={item.stackId}
                fill={item.color}
                barSize={item.barSize}
                isAnimationActive
            />
        ))}
    </BarChart>
);

export default BasicBarChart;
