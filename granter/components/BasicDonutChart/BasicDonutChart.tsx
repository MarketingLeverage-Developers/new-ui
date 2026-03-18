import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import styles from './BasicDonutChart.module.scss';

export type BasicDonutChartDatum = {
    key: string;
    label: string;
    value: number;
    color: string;
};

export type BasicDonutChartProps = {
    data: BasicDonutChartDatum[];
    width?: number | string;
    height?: number | string;
    margin?: {
        top?: number;
        right?: number;
        left?: number;
        bottom?: number;
    };
    innerRadius?: string | number;
    outerRadius?: string | number;
    paddingAngle?: number;
    cornerRadius?: number;
    innerValueThreshold?: number;
    valueFormatter?: (value: number, item: BasicDonutChartDatum) => React.ReactNode;
    innerValueFormatter?: (value: number, item: BasicDonutChartDatum) => React.ReactNode;
};

type TooltipContentProps = {
    active?: boolean;
    payload?: Array<{
        payload?: BasicDonutChartDatum;
    }>;
    valueFormatter?: BasicDonutChartProps['valueFormatter'];
};

type PieLabelRenderProps = {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    midAngle?: number;
    percent?: number;
    value?: number;
    payload?: BasicDonutChartDatum;
};

const RADIAN = Math.PI / 180;

const TooltipContent = ({ active, payload, valueFormatter }: TooltipContentProps) => {
    const item = payload?.[0]?.payload;

    if (!active || !item) return null;

    return (
        <div className={styles.Tooltip}>
            <div className={styles.TooltipHeader}>{item.label}</div>
            <div className={styles.TooltipBody}>
                <div className={styles.TooltipRow}>
                    <span className={styles.TooltipDot} style={{ backgroundColor: item.color }} />
                    <span className={styles.TooltipLabel}>값</span>
                    <span className={styles.TooltipValue}>
                        {valueFormatter?.(item.value, item) ?? item.value.toLocaleString('ko-KR')}
                    </span>
                </div>
            </div>
        </div>
    );
};

const createPieLabelRenderer = (
    innerValueThreshold: number,
    innerValueFormatter?: BasicDonutChartProps['innerValueFormatter']
) =>
    ({
        cx = 0,
        cy = 0,
        innerRadius = 0,
        outerRadius = 0,
        midAngle = 0,
        percent = 0,
        value = 0,
        payload,
    }: PieLabelRenderProps) => {
        if (!payload || value <= 0) return null;

        const angle = -midAngle * RADIAN;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const lineStartRadius = outerRadius + 4;
        const lineBendRadius = outerRadius + 18;
        const lineEndOffset = 22;
        const valueRadius = innerRadius + (outerRadius - innerRadius) * 0.58;

        const startX = cx + lineStartRadius * cos;
        const startY = cy + lineStartRadius * sin;
        const bendX = cx + lineBendRadius * cos;
        const bendY = cy + lineBendRadius * sin;
        const endX = bendX + (cos >= 0 ? lineEndOffset : -lineEndOffset);
        const endY = bendY;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        const textX = endX + (cos >= 0 ? 4 : -4);
        const valueX = cx + valueRadius * cos;
        const valueY = cy + valueRadius * sin;
        const showInnerValue = percent >= innerValueThreshold;

        return (
            <g>
                <polyline
                    points={`${startX},${startY} ${bendX},${bendY} ${endX},${endY}`}
                    fill="none"
                    stroke={payload.color}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text
                    x={textX}
                    y={endY}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    className={styles.PieLabelName}
                >
                    {payload.label}
                </text>
                {showInnerValue ? (
                    <text
                        x={valueX}
                        y={valueY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.PieInnerValue}
                    >
                        {innerValueFormatter?.(value, payload) ?? value.toLocaleString('ko-KR')}
                    </text>
                ) : null}
            </g>
        );
    };

const BasicDonutChart = ({
    data,
    width = '100%',
    height = '100%',
    margin = { top: 20, right: 36, left: 36, bottom: 20 },
    innerRadius = '46%',
    outerRadius = '82%',
    paddingAngle = data.length > 1 ? 3 : 0,
    cornerRadius = 8,
    innerValueThreshold = 0.07,
    valueFormatter,
    innerValueFormatter,
}: BasicDonutChartProps) => (
    <PieChart width={width} height={height} margin={margin}>
        <Tooltip
            content={(props) => (
                <TooltipContent
                    active={Boolean(props.active)}
                    payload={props.payload as TooltipContentProps['payload']}
                    valueFormatter={valueFormatter}
                />
            )}
        />
        <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
            stroke="#FFFFFF"
            strokeWidth={2}
            labelLine={false}
            label={createPieLabelRenderer(innerValueThreshold, innerValueFormatter)}
            isAnimationActive
        >
            {data.map((item) => (
                <Cell key={item.key} fill={item.color} />
            ))}
        </Pie>
    </PieChart>
);

export default BasicDonutChart;
