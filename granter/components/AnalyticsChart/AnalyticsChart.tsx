import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './AnalyticsChart.module.scss';

export type AnalyticsChartBarMode = 'amount' | 'statusRatio' | 'statusAmount' | 'inboundStatusCount';
export type AnalyticsChartType = 'BAR' | 'LINE' | 'PIE';
export type AnalyticsChartPreset = 'default' | 'dashboardMetric';

export type AnalyticsChartPeriodItem = {
    periodLabel: string;
    totalAmount: number;
    liveAmount: number;
    pendingAmount: number;
    stoppedAmount: number;
    stopByClientAmount?: number;
    stopByPerformanceAmount?: number;
};

export type AnalyticsChartLineSeries = {
    id: string;
    name: string;
    totalAmount: number;
    values: number[];
    profileImageUrl?: string;
    profileSrc?: string;
};

export type AnalyticsChartLineData = {
    periodLabels: string[];
    series: AnalyticsChartLineSeries[];
};

export type AnalyticsChartDatum = {
    periodLabel: string;
} & Record<string, string | number>;

export type AnalyticsChartGroupedStackSeries = {
    key: string;
    label: string;
    color: string;
    stackId: string;
    avatarName?: string;
    avatarSrc?: string;
};

export type AnalyticsChartGroupedStackData = {
    data: AnalyticsChartDatum[];
    series: AnalyticsChartGroupedStackSeries[];
};

export type AnalyticsChartProps = {
    periods?: AnalyticsChartPeriodItem[];
    lineData?: AnalyticsChartLineData;
    groupedStackData?: AnalyticsChartGroupedStackData;
    chartType?: AnalyticsChartType;
    barMode?: AnalyticsChartBarMode;
    preset?: AnalyticsChartPreset;
    goalMarkerBySeriesId?: Record<string, number>;
    isLoading?: boolean;
    title?: string;
    showTitle?: boolean;
    showLegend?: boolean;
};

type BarMode = AnalyticsChartBarMode;

type LineSeriesMeta = {
    key: string;
    label: string;
    color: string;
    profileSrc?: string;
};

type LineChartDatum = AnalyticsChartDatum;
type GroupedStackSeriesMeta = AnalyticsChartGroupedStackSeries;

type TooltipPayloadItem = {
    dataKey?: string | number;
    value?: string | number;
    payload?: LineChartDatum;
};

type LineTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: LineSeriesMeta[];
};

type BarTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: { key: string; label: string; color: string }[];
    valueFormatter: (value: number) => string;
};

type GroupedStackTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: GroupedStackSeriesMeta[];
    valueFormatter: (value: number) => string;
};

type AmountShareTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: LineSeriesMeta[];
};

type AxisTickProps = {
    x?: number;
    y?: number;
    payload?: {
        value?: number | string;
    };
};

type BarLabelProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    value?: number | string;
    payload?: LineChartDatum;
};

const AMOUNT_SERIES = [{ key: 'totalAmount', label: '소진액', color: '#3B82F6' }] as const;

const STATUS_COLORS = {
    live: '#EF4444',
    waiting: '#F59E0B',
    stopped: '#3B82F6',
    stopByClient: '#3B82F6',
    stopByPerformance: '#8B5CF6',
    contracted: '#22A06B',
} as const;

const STATUS_RATIO_SERIES = [
    { key: 'pendingAmount', label: '운영대기중', color: STATUS_COLORS.waiting },
    { key: 'liveAmount', label: '라이브중', color: STATUS_COLORS.live },
    { key: 'stopByClientAmount', label: '중단-광고주요청', color: STATUS_COLORS.stopByClient },
    { key: 'stopByPerformanceAmount', label: '중단-성과저하', color: STATUS_COLORS.stopByPerformance },
] as const;

const INBOUND_STATUS_SERIES = [
    { key: 'liveAmount', label: '관리', color: STATUS_COLORS.live },
    { key: 'pendingAmount', label: '가망', color: STATUS_COLORS.waiting },
    { key: 'stoppedAmount', label: '실패', color: STATUS_COLORS.stopped },
    { key: 'totalAmount', label: '계약', color: STATUS_COLORS.contracted },
] as const;

const LINE_COLORS = ['#3A7BFF', '#10B981', '#F97316', '#A855F7', '#EF4444', '#0EA5E9', '#EAB308', '#22C55E'];

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
};

const chartAreaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
};

const legendStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
};

const legendItemStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--granter-gray-600)',
};

const tooltipStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 180,
    padding: 12,
    border: '1px solid var(--granter-gray-200)',
    borderRadius: 12,
    background: 'var(--granter-white)',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
};

const tooltipItemStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '20px 1fr auto',
    alignItems: 'center',
    gap: 8,
};

const legendDotStyle = (color: string): React.CSSProperties => ({
    display: 'inline-flex',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: color,
    flexShrink: 0,
});

const formatCompactAmount = (value: number) => Math.round(value).toLocaleString('ko-KR');

const formatCurrency = (value: number) => `${value.toLocaleString('ko-KR')}원`;
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatCount = (value: number) => `${value.toLocaleString('ko-KR')}건`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const DEFAULT_BAR_PLOT_WIDTH = 940;
const MIN_BAR_PLOT_WIDTH = 320;
const DEFAULT_GROUP_BAR_GAP = 4;

const getDashboardCategoryWidth = (periodCount: number, plotWidth: number) => {
    if (periodCount <= 0) return Math.max(plotWidth, DEFAULT_BAR_PLOT_WIDTH);
    return Math.max(plotWidth, DEFAULT_BAR_PLOT_WIDTH) / periodCount;
};

const getDashboardBarCategoryGap = (
    periodCount: number,
    plotWidth: number,
    groupCount: number
) => {
    if (periodCount <= 1) return 0;

    const categoryWidth = getDashboardCategoryWidth(periodCount, plotWidth);
    const baseRatio = groupCount > 1 ? 0.09 : 0.075;
    const periodRatio = periodCount >= 7 ? 0.02 : periodCount >= 4 ? 0.01 : 0;
    const gapPx = categoryWidth * (baseRatio + periodRatio);

    return Math.round(clamp(gapPx, groupCount > 1 ? 20 : 16, groupCount > 1 ? 56 : 48));
};

const getDashboardBarGap = (periodCount: number, plotWidth: number, groupCount: number) => {
    if (groupCount <= 1) return 0;

    const categoryWidth = getDashboardCategoryWidth(periodCount, plotWidth);
    return Math.round(clamp(categoryWidth * 0.015, DEFAULT_GROUP_BAR_GAP, 10));
};

const getDashboardBarSize = (
    periodCount: number,
    groupCount: number,
    plotWidth: number
) => {
    if (periodCount <= 0 || groupCount <= 0) return undefined;

    const categoryWidth = getDashboardCategoryWidth(periodCount, plotWidth);
    const categoryGap = getDashboardBarCategoryGap(periodCount, plotWidth, groupCount);
    const barGap = getDashboardBarGap(periodCount, plotWidth, groupCount);
    const usableCategoryWidth = Math.max(categoryWidth - categoryGap, 24);

    if (groupCount <= 1) {
        return Math.round(Math.max(24, usableCategoryWidth));
    }

    const totalInnerGap = barGap * Math.max(groupCount - 1, 0);
    return Math.round(Math.max(20, (usableCategoryWidth - totalInnerGap) / groupCount));
};

const toNiceDomainValue = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return 1;

    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;

    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
};

const toTightCountDomainValue = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return 1;

    if (value <= 5) return Math.ceil(value);
    if (value <= 10) return Math.ceil(value / 2) * 2;
    if (value <= 50) return Math.ceil(value / 5) * 5;
    if (value <= 100) return Math.ceil(value / 10) * 10;
    if (value <= 300) return Math.ceil(value / 25) * 25;
    if (value <= 600) return Math.ceil(value / 50) * 50;
    if (value <= 1200) return Math.ceil(value / 100) * 100;
    if (value <= 3000) return Math.ceil(value / 250) * 250;

    return toNiceDomainValue(value);
};

const toTightAmountDomainValue = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return 1;

    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    const steps = [1, 1.2, 1.5, 1.8, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 9, 10];
    const nextStep = steps.find((step) => normalized <= step) ?? 10;

    return nextStep * magnitude;
};

const getDivergingBarDomain = (
    data: LineChartDatum[],
    barMode: BarMode
): [number, number] | undefined => {
    if (barMode !== 'statusRatio' && barMode !== 'statusAmount' && barMode !== 'inboundStatusCount') {
        return undefined;
    }

    const maxAbsStack = data.reduce((acc, item) => {
        if (barMode === 'inboundStatusCount') {
            const managed = Number(item.liveAmount ?? 0);
            const prospect = Number(item.pendingAmount ?? 0);
            const contracted = Number(item.totalAmount ?? 0);
            const failed = Math.abs(Number(item.stoppedAmount ?? 0));
            const positiveTotal = managed + prospect + contracted;

            return Math.max(acc, positiveTotal, failed);
        }

        const live = Number(item.liveAmount ?? 0);
        const pending = Number(item.pendingAmount ?? 0);
        const stopByClient = Math.abs(Number(item.stopByClientAmount ?? 0));
        const stopByPerformance = Math.abs(Number(item.stopByPerformanceAmount ?? 0));
        const positiveTotal = live + pending;
        const negativeTotal = stopByClient + stopByPerformance;

        return Math.max(acc, positiveTotal, negativeTotal);
    }, 0);

    if (barMode === 'statusRatio') {
        const padded = Math.min(100, Math.max(10, Math.ceil((maxAbsStack * 1.1) / 10) * 10));
        return [-padded, padded];
    }

    if (barMode === 'inboundStatusCount') {
        const padded = Math.max(1, toTightCountDomainValue(maxAbsStack * 1.08));
        return [-padded, padded];
    }

    const padded = toNiceDomainValue(maxAbsStack * 1.1);
    return [-padded, padded];
};

const getPositiveBarDomain = (
    data: LineChartDatum[],
    seriesKeys: string[],
    barMode: BarMode,
    stacked = false,
    tight = false
): [number, number] | undefined => {
    if (barMode !== 'amount') {
        return undefined;
    }

    const maxValue = data.reduce((acc, item) => {
        const nextValue = seriesKeys.reduce((seriesAcc, key) => {
            const value = Number(item[key] ?? 0);
            if (!Number.isFinite(value)) return seriesAcc;
            return stacked ? seriesAcc + Math.max(value, 0) : Math.max(seriesAcc, value);
        }, 0);

        return Math.max(acc, nextValue);
    }, 0);

    const padded = Math.max(
        1,
        tight ? toTightAmountDomainValue(maxValue * 1.04) : toNiceDomainValue(maxValue * 1.08)
    );
    return [0, padded];
};

const getBarSeries = (barMode: BarMode) => {
    if (barMode === 'statusRatio' || barMode === 'statusAmount') return [...STATUS_RATIO_SERIES];
    if (barMode === 'inboundStatusCount') return [...INBOUND_STATUS_SERIES];
    return [...AMOUNT_SERIES];
};

const getBarTickFormatter = (barMode: BarMode) => {
    if (barMode === 'statusRatio') return (value: number) => `${Math.round(value)}%`;
    if (barMode === 'inboundStatusCount') return (value: number) => value.toLocaleString('ko-KR');
    return (value: number) => formatCompactAmount(value);
};

const getTooltipValueFormatter = (barMode: BarMode) => {
    if (barMode === 'statusRatio') return formatPercent;
    if (barMode === 'inboundStatusCount') return formatCount;
    return formatCurrency;
};

const parseGroupedSeriesKey = (value?: string | number) => {
    const normalized = String(value ?? '').trim();
    const separatorIndex = normalized.indexOf('__');

    if (separatorIndex <= 0 || separatorIndex >= normalized.length - 2) {
        return null;
    }

    return {
        stackId: normalized.slice(0, separatorIndex),
        statusKey: normalized.slice(separatorIndex + 2),
    };
};

const LineTooltipContent = ({
    active,
    payload,
    label,
    seriesMeta,
}: LineTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const valueByKey = new Map<string, number>();

    payload.forEach((item: TooltipPayloadItem) => {
        const key = String(item.dataKey ?? '').trim();
        const value = Number(item.value);
        if (key.length > 0 && Number.isFinite(value)) {
            valueByKey.set(key, value);
        }
    });

    const sortedItems = seriesMeta
        .map((item) => ({ ...item, value: valueByKey.get(item.key) ?? 0 }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'ko-KR'));

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size="sm" weight="semibold">
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sortedItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <MemberProfileAvatar name={item.label} src={item.profileSrc} size={20} fontSize={11} />
                        <Text size="sm" style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.label}
                        </Text>
                        <Text size="sm" weight="medium">
                            {formatCurrency(item.value)}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarTooltipContent = ({
    active,
    payload,
    label,
    seriesMeta,
    valueFormatter,
}: BarTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const valueByKey = new Map<string, number>();

    payload.forEach((item: TooltipPayloadItem) => {
        const key = String(item.dataKey ?? '').trim();
        const value = Number(item.value);
        if (key.length > 0 && Number.isFinite(value)) {
            valueByKey.set(key, value);
        }
    });

    const sortedItems = seriesMeta
        .map((item) => ({ ...item, value: valueByKey.get(item.key) ?? 0 }))
        .filter((item) => Math.abs(item.value) > 0)
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || a.label.localeCompare(b.label, 'ko-KR'));

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size="sm" weight="semibold">
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sortedItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <span style={legendDotStyle(item.color)} />
                        <Text size="sm" style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.label}
                        </Text>
                        <Text size="sm" weight="medium">
                            {valueFormatter(Math.abs(item.value))}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GroupedStackTooltipContent = ({
    active,
    payload,
    label,
    seriesMeta,
    valueFormatter,
}: GroupedStackTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const activeSeriesKey = payload
        .map((item) => String(item.dataKey ?? '').trim())
        .find((item) => parseGroupedSeriesKey(item) !== null);

    const groupedInfo = parseGroupedSeriesKey(activeSeriesKey);
    if (!groupedInfo) return null;

    const activeDatum = payload.find((item) => String(item.dataKey ?? '').trim() === activeSeriesKey)?.payload;
    if (!activeDatum) return null;

    const marketerSeriesItems = seriesMeta
        .filter((item) => item.stackId === groupedInfo.stackId)
        .map((item) => ({
            ...item,
            marketerName: item.label.split(' · ')[0] ?? item.label,
            statusLabel: item.label.split(' · ')[1] ?? item.label,
            value: Number(activeDatum[item.key] ?? 0),
        }))
        .filter((item) => Number.isFinite(item.value) && Math.abs(item.value) > 0)
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || a.statusLabel.localeCompare(b.statusLabel, 'ko-KR'));

    if (marketerSeriesItems.length === 0) return null;

    const marketerName = marketerSeriesItems[0]?.marketerName ?? '';

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size="sm" weight="semibold">
                    {label}
                </Text>
            ) : null}
            {marketerName ? (
                <Text size="sm" tone="muted">
                    {marketerName}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {marketerSeriesItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <span style={legendDotStyle(item.color)} />
                        <Text size="sm" style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.statusLabel}
                        </Text>
                        <Text size="sm" weight="medium">
                            {valueFormatter(Math.abs(item.value))}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AmountShareTooltipContent = ({
    active,
    payload,
    label,
    seriesMeta,
}: AmountShareTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const valueByKey = new Map<string, number>();

    payload.forEach((item: TooltipPayloadItem) => {
        const key = String(item.dataKey ?? '').trim();
        const value = Number(item.value);
        if (key.length > 0 && Number.isFinite(value)) {
            valueByKey.set(key, value);
        }
    });

    const total = Array.from(valueByKey.values()).reduce((acc, value) => acc + Math.max(value, 0), 0);

    const items = seriesMeta
        .map((item) => {
            const raw = valueByKey.get(item.key) ?? 0;
            const ratio = total > 0 ? (raw / total) * 100 : 0;
            return { ...item, ratio, raw };
        })
        .filter((item) => Number.isFinite(item.raw) && item.raw > 0)
        .sort((a, b) => b.raw - a.raw || a.label.localeCompare(b.label, 'ko-KR'));

    if (items.length === 0) return null;

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size="sm" weight="semibold">
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <MemberProfileAvatar name={item.label} src={item.profileSrc} size={20} fontSize={11} />
                        <Text size="sm" style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {`${item.label} · ${Math.round(item.ratio)}%`}
                        </Text>
                        <Text size="sm" weight="medium">
                            {formatCurrency(item.raw)}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DivergingYAxisTick = ({
    y,
    payload,
    formatter,
}: AxisTickProps & {
    formatter: (value: number) => string;
}) => {
    const value = Number(payload?.value ?? 0);
    const safeY = typeof y === 'number' ? y : 0;

    return (
        <text
            x={4}
            y={safeY}
            dy={4}
            textAnchor="start"
            fill="#6B7280"
            fontSize={12}
        >
            {formatter(value)}
        </text>
    );
};

const DivergingXAxisTick = ({
    x,
    y,
    payload,
}: AxisTickProps) => {
    const safeX = typeof x === 'number' ? x : 0;
    const safeY = typeof y === 'number' ? y : 0;
    const label = String(payload?.value ?? '');

    return (
        <g transform={`translate(${safeX}, ${safeY})`}>
            <rect x={-0.5} y={4} width={1} height={8} rx={0.5} fill="#CBD5E1" />
            <text
                x={0}
                y={24}
                textAnchor="middle"
                fill="#6B7280"
                fontSize={12}
            >
                {label}
            </text>
        </g>
    );
};

const GroupedStackAvatarLabel = ({
    x,
    y,
    width,
    index,
    dataKey,
    data,
    seriesMetaByKey,
    enabled,
}: BarLabelProps & {
    dataKey: string;
    data: LineChartDatum[];
    seriesMetaByKey: Map<string, GroupedStackSeriesMeta>;
    enabled: boolean;
}) => {
    if (!enabled) return null;

    const groupedInfo = parseGroupedSeriesKey(dataKey);
    if (!groupedInfo) return null;

    if (groupedInfo.statusKey !== 'live' && groupedInfo.statusKey !== 'waiting') {
        return null;
    }

    const seriesMeta = seriesMetaByKey.get(dataKey);
    if (!seriesMeta) return null;

    const datum = typeof index === 'number' ? data[index] : undefined;
    if (!datum) return null;

    const waitingValue = Number(datum[`${groupedInfo.stackId}__waiting`] ?? 0);
    const liveValue = Number(datum[`${groupedInfo.stackId}__live`] ?? 0);
    const stopByClientValue = Math.abs(Number(datum[`${groupedInfo.stackId}__stopByClient`] ?? 0));
    const stopByPerformanceValue = Math.abs(Number(datum[`${groupedInfo.stackId}__stopByPerformance`] ?? 0));
    const positiveAnchorStatus = liveValue > 0 ? 'live' : waitingValue > 0 ? 'waiting' : null;
    const negativeAnchorStatus =
        stopByClientValue > 0 ? 'stopByClient' : stopByPerformanceValue > 0 ? 'stopByPerformance' : null;
    const anchorStatus = positiveAnchorStatus ?? negativeAnchorStatus;

    if (!anchorStatus || groupedInfo.statusKey !== anchorStatus) {
        return null;
    }

    const safeX = typeof x === 'number' ? x : 0;
    const safeY = typeof y === 'number' ? y : 0;
    const safeWidth = typeof width === 'number' ? width : 0;
    const avatarSize = 30;
    const avatarY = Math.max(safeY - avatarSize - 8, 4);

    return (
        <foreignObject
            x={safeX + safeWidth / 2 - avatarSize / 2}
            y={avatarY}
            width={avatarSize}
            height={avatarSize}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: avatarSize,
                    height: avatarSize,
                }}
            >
                <MemberProfileAvatar
                    name={seriesMeta.avatarName ?? seriesMeta.label}
                    src={seriesMeta.avatarSrc}
                    size={avatarSize}
                    fontSize={11}
                />
            </div>
        </foreignObject>
    );
};

const AnalyticsChart = ({
    periods = [],
    lineData,
    groupedStackData,
    chartType = 'BAR',
    barMode = 'amount',
    preset,
    goalMarkerBySeriesId,
    isLoading = false,
    title = '운영 내역',
    showTitle = true,
    showLegend = true,
}: AnalyticsChartProps) => {
    const chartAreaRef = useRef<HTMLDivElement | null>(null);
    const [chartAreaWidth, setChartAreaWidth] = useState(0);

    useEffect(() => {
        const el = chartAreaRef.current;
        if (!el) return;

        const update = () => {
            const nextWidth = el.clientWidth;
            setChartAreaWidth((prev) => (prev === nextWidth ? prev : nextWidth));
        };

        update();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', update);
            return () => window.removeEventListener('resize', update);
        }

        const observer = new ResizeObserver(update);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const lineSeriesMeta = useMemo<LineSeriesMeta[]>(
        () =>
            (lineData?.series ?? []).map((item, index) => ({
                key: item.id,
                label: item.name,
                color: LINE_COLORS[index % LINE_COLORS.length],
                profileSrc: (item.profileImageUrl ?? item.profileSrc ?? '').trim() || undefined,
            })),
        [lineData?.series]
    );

    const lineSeriesMetaByKey = useMemo(
        () => lineSeriesMeta.reduce<Map<string, LineSeriesMeta>>((acc, item) => acc.set(item.key, item), new Map()),
        [lineSeriesMeta]
    );

    const lineChartData = useMemo<LineChartDatum[]>(
        () =>
            (lineData?.periodLabels ?? []).map((periodLabel, index) => {
                const datum: LineChartDatum = { periodLabel };
                (lineData?.series ?? []).forEach((seriesItem) => {
                    datum[seriesItem.id] = seriesItem.values[index] ?? 0;
                });
                return datum;
            }),
        [lineData?.periodLabels, lineData?.series]
    );

    const isGroupedAmountBar = chartType === 'BAR' && barMode === 'amount' && lineSeriesMeta.length > 0 && lineChartData.length > 0;
    const isGroupedStackBar =
        chartType === 'BAR' &&
        (groupedStackData?.series.length ?? 0) > 0 &&
        (groupedStackData?.data.length ?? 0) > 0;
    const isDivergingDataBar =
        chartType === 'BAR' &&
        (isGroupedStackBar || barMode === 'statusRatio' || barMode === 'statusAmount' || barMode === 'inboundStatusCount');
    const resolvedPreset = useMemo<AnalyticsChartPreset>(() => {
        if (preset) return preset;
        if (chartType === 'BAR') return 'dashboardMetric';
        return 'default';
    }, [chartType, preset]);
    const isDashboardMetricPreset = resolvedPreset === 'dashboardMetric';
    const isAmountShareBar = isDashboardMetricPreset && isGroupedAmountBar;

    const barData = useMemo(
        () =>
            isGroupedAmountBar
                ? lineChartData
                : isGroupedStackBar
                    ? groupedStackData?.data ?? []
                : periods.map((item) => ({
                    periodLabel: item.periodLabel,
                    totalAmount: item.totalAmount,
                    liveAmount: item.liveAmount,
                    pendingAmount: item.pendingAmount,
                    stoppedAmount: item.stoppedAmount,
                    stopByClientAmount: item.stopByClientAmount ?? 0,
                    stopByPerformanceAmount: item.stopByPerformanceAmount ?? 0,
                })),
        [groupedStackData?.data, isGroupedAmountBar, isGroupedStackBar, lineChartData, periods]
    );

    const barSeries = useMemo(
        () => (isGroupedAmountBar ? lineSeriesMeta : isGroupedStackBar ? groupedStackData?.series ?? [] : getBarSeries(barMode)),
        [barMode, groupedStackData?.series, isGroupedAmountBar, isGroupedStackBar, lineSeriesMeta]
    );
    const groupedStackSeriesMetaByKey = useMemo(
        () =>
            new Map(
                (groupedStackData?.series ?? []).map((item) => [item.key, item] as const)
            ),
        [groupedStackData?.series]
    );
    const groupedStackCount = useMemo(
        () => new Set((groupedStackData?.series ?? []).map((item) => item.stackId)).size,
        [groupedStackData?.series]
    );
    const dashboardBarGroupCount =
        isAmountShareBar
            ? 1
            : isGroupedStackBar
                ? groupedStackCount
                : 1;
    const shouldShowGroupedStackAvatars =
        isDashboardMetricPreset && isGroupedStackBar && groupedStackCount > 0 && groupedStackCount <= 5;
    const barTickFormatter = useMemo(() => getBarTickFormatter(barMode), [barMode]);
    const barTooltipValueFormatter = useMemo(() => getTooltipValueFormatter(barMode), [barMode]);
    const barYAxisWidth =
        isDashboardMetricPreset
            ? barMode === 'statusAmount'
                ? 132
                : barMode === 'statusRatio'
                    ? 84
                    : barMode === 'inboundStatusCount'
                        ? 72
                        : 96
            : 54;
    const barYAxisTickMargin = isDashboardMetricPreset ? 20 : 6;
    const barChartMargin = useMemo(
        () =>
            isDashboardMetricPreset
                ? {
                    top: shouldShowGroupedStackAvatars ? 64 : 0,
                    right: Math.max(barYAxisWidth - 40, 0),
                    left: 0,
                    bottom: 0,
                }
                : { top: 8, right: 12, left: 0, bottom: 8 },
        [barYAxisWidth, isDashboardMetricPreset, shouldShowGroupedStackAvatars]
    );
    const barPlotWidth = useMemo(() => {
        if (chartAreaWidth <= 0) return DEFAULT_BAR_PLOT_WIDTH;

        const leftMargin = barChartMargin.left ?? 0;
        const rightMargin = barChartMargin.right ?? 0;

        return Math.max(chartAreaWidth - barYAxisWidth - leftMargin - rightMargin, MIN_BAR_PLOT_WIDTH);
    }, [barChartMargin.left, barChartMargin.right, barYAxisWidth, chartAreaWidth]);
    const dashboardBarSize = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardBarSize(barData.length, dashboardBarGroupCount, barPlotWidth)
                : undefined,
        [barData.length, barPlotWidth, dashboardBarGroupCount, isDashboardMetricPreset]
    );
    const dashboardBarCategoryGap = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardBarCategoryGap(barData.length, barPlotWidth, dashboardBarGroupCount)
                : 30,
        [barData.length, barPlotWidth, dashboardBarGroupCount, isDashboardMetricPreset]
    );
    const dashboardBarGap = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardBarGap(barData.length, barPlotWidth, dashboardBarGroupCount)
                : undefined,
        [barData.length, barPlotWidth, dashboardBarGroupCount, isDashboardMetricPreset]
    );
    const divergingStatusDomain = useMemo(
        () => (isDivergingDataBar ? getDivergingBarDomain(barData, barMode) : undefined),
        [barData, barMode, isDivergingDataBar]
    );
    const positiveAmountDomain = useMemo(
        () =>
            barMode === 'amount'
                ? getPositiveBarDomain(
                    barData,
                    barSeries.map((item) => item.key),
                    barMode,
                    isAmountShareBar,
                    isDashboardMetricPreset
                )
                : undefined,
        [barData, barMode, barSeries, isAmountShareBar, isDashboardMetricPreset]
    );
    const metricBarDomain = divergingStatusDomain ?? positiveAmountDomain;
    const divergingStatusXAxisPadding = useMemo(
        () => undefined,
        []
    );
    const chartRenderKey = useMemo(
        () =>
            chartType === 'LINE'
                ? [
                    'line',
                    ...lineSeriesMeta.map((item) => item.key),
                    ...(lineData?.periodLabels ?? []),
                ].join(':')
                : [
                    'bar',
                    barMode,
                    ...barSeries.map((item) => item.key),
                    ...barData.map((item) => String(item.periodLabel ?? '')),
                ].join(':'),
        [barData, barMode, barSeries, chartType, lineData?.periodLabels, lineSeriesMeta]
    );

    const isEmpty =
        !isLoading &&
        (chartType === 'LINE'
            ? lineSeriesMeta.length === 0 || lineChartData.length === 0
            : barData.length === 0);

    return (
        <div style={containerStyle}>
            {showTitle ? (
                <Text size="md" weight="medium">
                    {title}
                </Text>
            ) : null}

            {isLoading ? (
                <Flex justify="center" align="center" style={chartAreaStyle}>
                    <Text size="sm" tone="muted">
                        데이터를 불러오는 중입니다.
                    </Text>
                </Flex>
            ) : isEmpty ? (
                <Flex justify="center" align="center" style={chartAreaStyle}>
                    <Text size="sm" tone="muted">
                        집계된 데이터가 없습니다.
                    </Text>
                </Flex>
            ) : (
                <div className={styles.ContentMotion}>
                    <div key={`chart-${chartRenderKey}`} className={styles.ChartMotion}>
                        <div ref={chartAreaRef} style={chartAreaStyle}>
                        <ResponsiveContainer width="100%" height="100%" debounce={80}>
                            {chartType === 'LINE' ? (
                                <LineChart
                                    key={chartRenderKey}
                                    data={lineChartData}
                                    margin={{ top: 28, right: 12, left: 0, bottom: 8 }}
                                >
                                    {isDashboardMetricPreset ? null : (
                                        <CartesianGrid stroke="#EEF2F7" vertical={false} />
                                    )}
                                    <XAxis
                                        dataKey="periodLabel"
                                        tickLine={false}
                                        axisLine={isDashboardMetricPreset ? false : { stroke: '#E5E7EB' }}
                                        fontSize={12}
                                        tickMargin={isDashboardMetricPreset ? 10 : 8}
                                        padding={divergingStatusXAxisPadding}
                                        tick={
                                            isDashboardMetricPreset
                                                ? (props) => <DivergingXAxisTick {...props} />
                                                : undefined
                                        }
                                    />
                                    <YAxis
                                        width={0}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={false}
                                        domain={[
                                            (value: number) =>
                                                Number.isFinite(value) ? Math.min(0, Math.floor(value * 1.1)) : 0,
                                            (value: number) =>
                                                !Number.isFinite(value) || value === 0 ? 1 : Math.ceil(value * 1.4),
                                        ]}
                                        tickFormatter={formatCompactAmount}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#111827', strokeWidth: 1, opacity: 0.2 }}
                                        content={(props) => (
                                            <LineTooltipContent
                                                active={props.active}
                                                payload={props.payload as TooltipPayloadItem[] | undefined}
                                                label={props.label}
                                                seriesMeta={lineSeriesMeta}
                                            />
                                        )}
                                    />
                                    {Object.entries(goalMarkerBySeriesId ?? {}).map(([seriesId, goal]) => {
                                        const meta = lineSeriesMetaByKey.get(seriesId);
                                        if (!meta || !Number.isFinite(goal)) return null;

                                        return (
                                            <ReferenceLine
                                                key={`goal-${seriesId}`}
                                                y={goal}
                                                stroke={meta.color}
                                                strokeDasharray="4 4"
                                                strokeOpacity={0.2}
                                            />
                                        );
                                    })}
                                    {lineSeriesMeta.map((seriesItem) => (
                                        <Line
                                            key={seriesItem.key}
                                            type="monotone"
                                            dataKey={seriesItem.key}
                                            name={seriesItem.label}
                                            stroke={seriesItem.color}
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={false}
                                            activeDot={(props: {
                                                cx?: number;
                                                cy?: number;
                                                value?: number | string;
                                            }) => {
                                                if (
                                                    typeof props.cx !== 'number' ||
                                                    typeof props.cy !== 'number' ||
                                                    !Number.isFinite(Number(props.value))
                                                ) {
                                                    return <g />;
                                                }

                                                const avatarSize = 28;
                                                const offsetY = props.cy - (avatarSize + 10) < 4 ? props.cy + 10 : props.cy - (avatarSize + 10);

                                                return (
                                                    <g>
                                                        <circle
                                                            cx={props.cx}
                                                            cy={props.cy}
                                                            r={4}
                                                            fill="#111827"
                                                            stroke="#ffffff"
                                                            strokeWidth={2}
                                                        />
                                                        <foreignObject
                                                            x={props.cx - avatarSize / 2}
                                                            y={offsetY}
                                                            width={avatarSize}
                                                            height={avatarSize}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: avatarSize,
                                                                    height: avatarSize,
                                                                    borderRadius: 999,
                                                                    background: 'var(--granter-white)',
                                                                }}
                                                            >
                                                                <MemberProfileAvatar
                                                                    name={seriesItem.label}
                                                                    src={seriesItem.profileSrc}
                                                                    size={avatarSize}
                                                                    fontSize={11}
                                                                />
                                                            </div>
                                                        </foreignObject>
                                                    </g>
                                                );
                                            }}
                                        />
                                    ))}
                                </LineChart>
                            ) : (
                                <BarChart
                                    key={chartRenderKey}
                                    data={barData}
                                    margin={barChartMargin}
                                    barCategoryGap={dashboardBarCategoryGap}
                                    barGap={dashboardBarGroupCount > 1 ? dashboardBarGap : undefined}
                                    stackOffset={isDivergingDataBar ? 'sign' : 'none'}
                                >
                                    {isDashboardMetricPreset ? null : (
                                        <CartesianGrid stroke="#EEF2F7" vertical={false} />
                                    )}
                                    <XAxis
                                        dataKey="periodLabel"
                                        tickLine={false}
                                        axisLine={isDashboardMetricPreset ? false : { stroke: '#E5E7EB' }}
                                        fontSize={12}
                                        tickMargin={isDashboardMetricPreset ? 0 : 8}
                                        height={isDashboardMetricPreset ? 40 : undefined}
                                        tick={
                                            isDashboardMetricPreset
                                                ? (props) => <DivergingXAxisTick {...props} />
                                                : undefined
                                        }
                                    />
                                    <YAxis
                                        width={barYAxisWidth}
                                        tickLine={false}
                                        axisLine={false}
                                        fontSize={12}
                                        tickMargin={barYAxisTickMargin}
                                        tick={
                                            isDashboardMetricPreset
                                                ? (props) => (
                                                    <DivergingYAxisTick
                                                        {...props}
                                                        formatter={barTickFormatter}
                                                    />
                                                )
                                                : undefined
                                        }
                                        tickFormatter={barTickFormatter}
                                        domain={metricBarDomain}
                                    />
                                    <Tooltip
                                        shared={isGroupedStackBar ? false : undefined}
                                        isAnimationActive={false}
                                        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                        content={
                                            isAmountShareBar
                                                ? (props) => (
                                                    <AmountShareTooltipContent
                                                        active={props.active}
                                                        payload={props.payload as TooltipPayloadItem[] | undefined}
                                                        label={props.label}
                                                        seriesMeta={lineSeriesMeta}
                                                    />
                                                )
                                                : isGroupedAmountBar
                                                ? (props) => (
                                                    <LineTooltipContent
                                                        active={props.active}
                                                        payload={props.payload as TooltipPayloadItem[] | undefined}
                                                        label={props.label}
                                                        seriesMeta={lineSeriesMeta}
                                                    />
                                                )
                                                : isGroupedStackBar
                                                    ? (props) => (
                                                        <GroupedStackTooltipContent
                                                            active={props.active}
                                                            payload={props.payload as TooltipPayloadItem[] | undefined}
                                                            label={props.label}
                                                            seriesMeta={groupedStackData?.series ?? []}
                                                            valueFormatter={barTooltipValueFormatter}
                                                        />
                                                    )
                                                : (props) => (
                                                    <BarTooltipContent
                                                        active={props.active}
                                                        payload={props.payload as TooltipPayloadItem[] | undefined}
                                                        label={props.label}
                                                        seriesMeta={barSeries}
                                                        valueFormatter={barTooltipValueFormatter}
                                                    />
                                                )
                                        }
                                    />
                                    {barSeries.map((seriesItem) => (
                                        <Bar
                                            key={seriesItem.key}
                                            dataKey={seriesItem.key}
                                            name={seriesItem.label}
                                            stackId={
                                                isAmountShareBar
                                                    ? 'amountShare'
                                                    : isGroupedStackBar
                                                    ? ('stackId' in seriesItem ? seriesItem.stackId : undefined)
                                                    : barMode === 'amount'
                                                        ? undefined
                                                        : barMode
                                            }
                                            fill={seriesItem.color}
                                            barSize={
                                                isDashboardMetricPreset
                                                    ? dashboardBarSize
                                                    : barMode === 'amount'
                                                        ? 42
                                                        : undefined
                                            }
                                            isAnimationActive={false}
                                        >
                                            {isGroupedStackBar ? (
                                                <LabelList
                                                    dataKey={seriesItem.key}
                                                    content={(props) => (
                                                        <GroupedStackAvatarLabel
                                                            {...props}
                                                            dataKey={seriesItem.key}
                                                            data={barData}
                                                            seriesMetaByKey={groupedStackSeriesMetaByKey}
                                                            enabled={shouldShowGroupedStackAvatars}
                                                        />
                                                    )}
                                                />
                                            ) : null}
                                        </Bar>
                                    ))}
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                        </div>
                    </div>

                    {showLegend ? (
                        <div key={`legend-${chartRenderKey}`} className={styles.LegendMotion}>
                            <div style={legendStyle}>
                                {(chartType === 'LINE' || isGroupedAmountBar ? lineSeriesMeta : barSeries).map((item) => (
                                    <div key={item.key} style={legendItemStyle}>
                                        <span style={legendDotStyle(item.color)} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

const MemoizedAnalyticsChart = memo(AnalyticsChart);

MemoizedAnalyticsChart.displayName = 'AnalyticsChart';

export default MemoizedAnalyticsChart;
