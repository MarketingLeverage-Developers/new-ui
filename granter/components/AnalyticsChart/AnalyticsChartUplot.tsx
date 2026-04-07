import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackProfileSrc } from '@/shared/utils/profile/getFallbackProfileSrc';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import {
    HiOutlineCheckCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineClock,
    HiOutlineExclamationTriangle,
    HiOutlineMagnifyingGlass,
    HiOutlinePauseCircle,
    HiOutlinePlayCircle,
    HiOutlineXCircle,
} from 'react-icons/hi2';
import {
    ANALYTICS_CHART_DASHBOARD_STATUS_COLORS,
    ANALYTICS_CHART_LINE_COLORS,
    ANALYTICS_CHART_PALETTE,
    ANALYTICS_CHART_STATUS_COLORS,
} from './AnalyticsChart.constants';
import styles from './AnalyticsChart.module.scss';

export type AnalyticsChartBarMode = 'amount' | 'statusRatio' | 'statusAmount' | 'inboundStatusCount';
export type AnalyticsChartType = 'BAR' | 'LINE' | 'PIE';
export type AnalyticsChartPreset = 'default' | 'dashboardMetric';
export type AnalyticsChartStatusSeriesMode = 'reason' | 'category';
export type AnalyticsChartAvatarKind = 'company' | 'user';

export type AnalyticsChartPeriodItem = {
    periodLabel: string;
    totalAmount: number;
    liveAmount: number;
    pendingAmount: number;
    stoppedAmount: number;
    isMissingData?: boolean;
    endAmount?: number;
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
    avatarKind?: AnalyticsChartAvatarKind;
    avatarSeed?: string;
};

export type AnalyticsChartLineData = {
    periodLabels: string[];
    series: AnalyticsChartLineSeries[];
};

export type AnalyticsChartDatum = {
    periodLabel: string;
    isMissingData?: boolean;
} & Record<string, string | number | boolean | undefined>;

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
    dashboardBarMaxWidth?: number;
    preset?: AnalyticsChartPreset;
    statusSeriesMode?: AnalyticsChartStatusSeriesMode;
    goalMarkerBySeriesId?: Record<string, number>;
    isLoading?: boolean;
    title?: string;
    showTitle?: boolean;
    showLegend?: boolean;
    showSeriesAvatars?: boolean;
};

type BarMode = AnalyticsChartBarMode;

type LineSeriesMeta = {
    key: string;
    label: string;
    color: string;
    profileSrc?: string;
    avatarKind?: AnalyticsChartAvatarKind;
    avatarSeed?: string;
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

type ChartAreaSize = {
    width: number;
    height: number;
};

type PlotFrame = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type CursorState = {
    idx: number | null;
    left: number;
    top: number;
    activeSeriesKey?: string;
};

type DrawnBarRect = {
    seriesKey: string;
    stackId?: string;
    idx: number;
    left: number;
    top: number;
    width: number;
    height: number;
    isPlaceholder?: boolean;
};

const drawRoundedRectPath = (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    width: number,
    height: number,
    radius: number
) => {
    const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

    ctx.beginPath();
    ctx.moveTo(left + safeRadius, top);
    ctx.lineTo(left + width - safeRadius, top);
    ctx.quadraticCurveTo(left + width, top, left + width, top + safeRadius);
    ctx.lineTo(left + width, top + height - safeRadius);
    ctx.quadraticCurveTo(left + width, top + height, left + width - safeRadius, top + height);
    ctx.lineTo(left + safeRadius, top + height);
    ctx.quadraticCurveTo(left, top + height, left, top + height - safeRadius);
    ctx.lineTo(left, top + safeRadius);
    ctx.quadraticCurveTo(left, top, left + safeRadius, top);
    ctx.closePath();
};

type AvatarAnchor = {
    key: string;
    label: string;
    profileSrc?: string;
    avatarSeed?: string;
    avatarKind?: AnalyticsChartAvatarKind;
    left: number;
    top: number;
};

type LinePointOverlay = {
    key: string;
    label: string;
    profileSrc?: string;
    avatarKind?: AnalyticsChartAvatarKind;
    avatarSeed?: string;
    left: number;
    top: number;
    value: number;
};

type LocalStore<T> = {
    getSnapshot: () => T;
    subscribe: (listener: () => void) => () => void;
    set: (next: T) => void;
};

const AMOUNT_SERIES = [{ key: 'totalAmount', label: '소진액', color: ANALYTICS_CHART_PALETTE.positive }] as const;

const STATUS_REASON_SERIES = [
    { key: 'pendingAmount', label: '운영대기중', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.waiting },
    { key: 'liveAmount', label: '라이브중', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.live },
    {
        key: 'stopByClientAmount',
        label: '중단-광고주요청',
        color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.stopByClient,
    },
    {
        key: 'stopByPerformanceAmount',
        label: '중단-성과저하',
        color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.stopByPerformance,
    },
] as const;

const STATUS_CATEGORY_SERIES = [
    { key: 'pendingAmount', label: '운영대기중', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.waiting },
    { key: 'liveAmount', label: '라이브중', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.live },
    { key: 'stoppedAmount', label: '광고중단', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.stopped },
    { key: 'endAmount', label: '피이관', color: ANALYTICS_CHART_DASHBOARD_STATUS_COLORS.end },
] as const;

const INBOUND_STATUS_SERIES = [
    { key: 'liveAmount', label: '관리', color: ANALYTICS_CHART_STATUS_COLORS.live },
    { key: 'pendingAmount', label: '가망', color: ANALYTICS_CHART_STATUS_COLORS.waiting },
    { key: 'stoppedAmount', label: '실패', color: ANALYTICS_CHART_STATUS_COLORS.stopped },
    { key: 'totalAmount', label: '계약', color: ANALYTICS_CHART_STATUS_COLORS.contracted },
] as const;

const DEFAULT_BAR_PLOT_WIDTH = 940;
const DEFAULT_DASHBOARD_BAR_WIDTH = 200;
const MIN_BAR_PLOT_WIDTH = 320;
const TOOLTIP_MAX_WIDTH = 220;
const FONT_FAMILY = 'Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif';
const LINE_AVATAR_SIZE = 28;
const GROUPED_STACK_AVATAR_SIZE = 30;
const MIN_VERTICAL_CHART_PADDING = 12;
const INTEGER_AXIS_INCREMENTS = [
    1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000,
] as const;

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
    minWidth: 0,
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'visible',
    position: 'relative',
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
const chartAvatarStyle: React.CSSProperties = {
    border: '1px solid var(--granter-gray-200)',
    boxSizing: 'border-box',
    backgroundColor: 'var(--granter-gray-50)',
};

const legendDotStyle = (color: string): React.CSSProperties => ({
    display: 'inline-flex',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: color,
    flexShrink: 0,
});

const statusIconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    flexShrink: 0,
};

const formatCompactAmount = (value: number) => Math.round(value).toLocaleString('ko-KR');
const formatCurrency = (value: number) => `${value.toLocaleString('ko-KR')}원`;
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const pickProfileSrc = (...candidates: Array<string | null | undefined>) => {
    for (const candidate of candidates) {
        const normalized = String(candidate ?? '').trim();

        if (normalized.length > 0) {
            return normalized;
        }
    }

    return '';
};
const resolveAvatarSrc = (
    profileSrc?: string | null,
    seed?: string | null,
    avatarKind: AnalyticsChartAvatarKind = 'user'
) =>
    pickProfileSrc(
        profileSrc,
        avatarKind === 'company' ? getFallbackProfileSrc(seed) : getFallbackUserProfileSrc(seed)
    );
const formatCount = (value: number) => `${value.toLocaleString('ko-KR')}건`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const withAlpha = (color: string, alpha: number) => {
    const normalized = color.trim();

    if (/^#([0-9a-f]{3})$/i.test(normalized)) {
        const [, shortHex = ''] = normalized.match(/^#([0-9a-f]{3})$/i) ?? [];
        const expanded = shortHex
            .split('')
            .map((char) => char + char)
            .join('');
        const red = parseInt(expanded.slice(0, 2), 16);
        const green = parseInt(expanded.slice(2, 4), 16);
        const blue = parseInt(expanded.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    if (/^#([0-9a-f]{6})$/i.test(normalized)) {
        const [, hex = '000000'] = normalized.match(/^#([0-9a-f]{6})$/i) ?? [];
        const red = parseInt(hex.slice(0, 2), 16);
        const green = parseInt(hex.slice(2, 4), 16);
        const blue = parseInt(hex.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    const rgbMatch = normalized.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbMatch) {
        const channels = rgbMatch[1]
            .split(',')
            .slice(0, 3)
            .map((item) => Number(item.trim()))
            .filter((item) => Number.isFinite(item));

        if (channels.length === 3) {
            return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
        }
    }

    return `rgba(148, 163, 184, ${alpha})`;
};

const areCursorStatesEqual = (left: CursorState, right: CursorState) =>
    left.idx === right.idx &&
    left.left === right.left &&
    left.top === right.top &&
    left.activeSeriesKey === right.activeSeriesKey;

const createLocalStore = <T,>(initial: T, isEqual: (left: T, right: T) => boolean): LocalStore<T> => {
    let state = initial;
    const listeners = new Set<() => void>();

    return {
        getSnapshot: () => state,
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        set: (next) => {
            if (isEqual(state, next)) return;
            state = next;
            listeners.forEach((listener) => listener());
        },
    };
};

const useLatestRef = <T,>(value: T) => {
    const ref = useRef(value);
    ref.current = value;
    return ref;
};

type ManagedUplotProps = {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    onCreate?: (chart: uPlot) => void;
    onDelete?: (chart: uPlot) => void;
    resetScales?: boolean;
    className?: string;
};

type OptionsUpdateState = 'keep' | 'update' | 'create';

const getOptionsUpdateState = (prev: uPlot.Options, next: uPlot.Options): OptionsUpdateState => {
    const { width: prevWidth, height: prevHeight, ...prevRest } = prev;
    const { width: nextWidth, height: nextHeight, ...nextRest } = next;

    let state: OptionsUpdateState = 'keep';

    if (prevWidth !== nextWidth || prevHeight !== nextHeight) {
        state = 'update';
    }

    if (Object.keys(prevRest).length !== Object.keys(nextRest).length) {
        return 'create';
    }

    for (const key of Object.keys(prevRest)) {
        if (!Object.is(prevRest[key as keyof typeof prevRest], nextRest[key as keyof typeof nextRest])) {
            state = 'create';
            break;
        }
    }

    return state;
};

const doesAlignedDataMatch = (left: uPlot.AlignedData, right: uPlot.AlignedData) => {
    if (left.length !== right.length) return false;

    return left.every((leftSeries, seriesIndex) => {
        const rightSeries = right[seriesIndex];
        if (leftSeries.length !== rightSeries.length) return false;
        return leftSeries.every((value, valueIndex) => value === rightSeries[valueIndex]);
    });
};

const ManagedUplot = memo(({
    options,
    data,
    onCreate,
    onDelete,
    resetScales = true,
    className,
}: ManagedUplotProps) => {
    const chartRef = useRef<uPlot | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef(options);
    const dataRef = useRef(data);
    const onCreateRef = useRef(onCreate);
    const onDeleteRef = useRef(onDelete);

    useEffect(() => {
        onCreateRef.current = onCreate;
        onDeleteRef.current = onDelete;
    });

    const destroy = useCallback((chart: uPlot | null) => {
        if (!chart) return;

        onDeleteRef.current?.(chart);
        chart.destroy();

        if (chartRef.current === chart) {
            chartRef.current = null;
        }
    }, []);

    const create = useCallback(() => {
        if (!targetRef.current) return;

        const nextChart = new uPlot(optionsRef.current, dataRef.current, targetRef.current);
        chartRef.current = nextChart;
        onCreateRef.current?.(nextChart);
    }, []);

    useEffect(() => {
        create();

        return () => {
            destroy(chartRef.current);
        };
    }, [create, destroy]);

    useEffect(() => {
        if (optionsRef.current === options) return;

        const updateState = getOptionsUpdateState(optionsRef.current, options);
        optionsRef.current = options;

        if (!chartRef.current || updateState === 'create') {
            destroy(chartRef.current);
            create();
            return;
        }

        if (updateState === 'update') {
            chartRef.current.setSize({
                width: options.width ?? 0,
                height: options.height ?? 0,
            });
        }
    }, [create, destroy, options]);

    useEffect(() => {
        if (dataRef.current === data) return;

        if (!chartRef.current) {
            dataRef.current = data;
            create();
            return;
        }

        if (!doesAlignedDataMatch(dataRef.current, data)) {
            chartRef.current.setData(data, resetScales);

            if (!resetScales) {
                chartRef.current.redraw();
            }
        }

        dataRef.current = data;
    }, [create, data, resetScales]);

    return <div ref={targetRef} className={className} />;
});

ManagedUplot.displayName = 'ManagedUplot';

const dedupeAxisSplitsByFormatter = (
    splits: number[],
    formatter: (value: number) => string
): (number | null)[] => {
    let previousLabel: string | null = null;

    return splits.map((value) => {
        const nextLabel = formatter(Number(value));

        if (nextLabel === previousLabel) {
            return null;
        }

        previousLabel = nextLabel;
        return value;
    });
};

const normalizeChartAmount = (value: unknown, direction: 'positive' | 'negative') => {
    const numeric = Number(value ?? 0);
    if (!Number.isFinite(numeric)) return 0;

    const absolute = Math.abs(numeric);
    return direction === 'negative' ? -absolute : absolute;
};

const toTooltipStatusIconKey = (
    value?: string | number
): 'live' | 'waiting' | 'adStop' | 'end' | 'managed' | 'prospect' | 'failed' | 'contracted' | null => {
    const normalized = String(value ?? '').trim();

    switch (normalized) {
        case '관리':
            return 'managed';
        case '가망':
            return 'prospect';
        case '실패':
            return 'failed';
        case 'live':
        case 'liveAmount':
        case '라이브':
        case '라이브중':
            return 'live';
        case 'waiting':
        case 'pendingAmount':
        case '대기':
        case '운영대기':
        case '운영대기중':
            return 'waiting';
        case 'adStop':
        case 'stoppedAmount':
        case 'stopByClient':
        case 'stopByPerformance':
        case 'stopByClientAmount':
        case 'stopByPerformanceAmount':
        case '중단':
        case '광고중단':
        case '중단 - 광고주 요청':
        case '중단 - 성과 저하':
        case '중단-광고주요청':
        case '중단-성과저하':
            return 'adStop';
        case 'end':
        case 'endAmount':
        case '피이관':
        case '피이관 - 광고주 요청':
        case '피이관 - 성과 저하':
        case '피이관-광고주요청':
        case '피이관-성과저하':
            return 'end';
        case 'total':
        case 'totalAmount':
        case 'contracted':
        case '계약':
            return 'contracted';
        default:
            return null;
    }
};

const getTooltipStatusOrder = (value?: string | number) => {
    const statusKey = toTooltipStatusIconKey(value);

    if (statusKey === 'managed') return 0;
    if (statusKey === 'prospect') return 1;
    if (statusKey === 'failed') return 2;
    if (statusKey === 'contracted') return 3;
    if (statusKey === 'live') return 0;
    if (statusKey === 'waiting') return 1;
    if (statusKey === 'adStop') return 2;
    if (statusKey === 'end') return 3;

    return Number.MAX_SAFE_INTEGER;
};

const compareTooltipSeriesOrder = (
    left: { key?: string | number; label?: string },
    right: { key?: string | number; label?: string }
) => {
    const leftOrder = Math.min(getTooltipStatusOrder(left.key), getTooltipStatusOrder(left.label));
    const rightOrder = Math.min(getTooltipStatusOrder(right.key), getTooltipStatusOrder(right.label));

    if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
    }

    return 0;
};

const renderTooltipMarker = (keyOrLabel: string | number | undefined, color: string, fallbackLabel?: string) => {
    const statusKey = toTooltipStatusIconKey(keyOrLabel) ?? toTooltipStatusIconKey(fallbackLabel);

    if (statusKey === 'live') {
        return (
            <span style={statusIconStyle}>
                <HiOutlinePlayCircle size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'managed') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineClipboardDocumentList size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'prospect') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineMagnifyingGlass size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'failed') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineXCircle size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'waiting') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineClock size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'adStop') {
        return (
            <span style={statusIconStyle}>
                <HiOutlinePauseCircle size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'end') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineExclamationTriangle size={16} color={color} />
            </span>
        );
    }

    if (statusKey === 'contracted') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineCheckCircle size={16} color={color} />
            </span>
        );
    }

    return <span style={legendDotStyle(color)} />;
};

type DashboardBarLayout = {
    categoryGap: number;
    barGap: number;
};

const getDashboardBarLayout = (
    periodCount: number,
    plotWidth: number,
    groupCount: number
): DashboardBarLayout => {
    if (periodCount <= 0 || groupCount <= 0) {
        return { categoryGap: 0, barGap: 0 };
    }

    if (periodCount === 1) {
        return { categoryGap: 0, barGap: groupCount > 1 ? 6 : 0 };
    }

    const isNarrow = plotWidth < 760;

    if (groupCount > 1) {
        return {
            categoryGap: isNarrow ? 12 : 18,
            barGap: isNarrow ? 4 : 6,
        };
    }

    return {
        categoryGap: isNarrow ? 14 : 24,
        barGap: 0,
    };
};

const getDashboardBarFillRatio = (periodCount: number) => {
    if (periodCount <= 1) return 0.92;
    if (periodCount <= 2) return 0.9;
    if (periodCount <= 4) return 0.86;
    if (periodCount <= 8) return 0.8;
    return 0.72;
};

const getDashboardXAxisLabelStride = (periodCount: number) => {
    if (periodCount <= 1) return 1;
    if (periodCount <= 8) return 1;
    if (periodCount <= 16) return 2;
    if (periodCount <= 24) return 3;
    if (periodCount <= 36) return 4;
    return 7;
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
    // 이 steps 배열이 y축 끝점을 결정하는 기준입니다.
    // 2.5억(normalized 2.5)일 때 다음 스텝인 3을 선택하게 되어 있습니다.
    const steps = [1, 1.2, 1.5, 1.8, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 9, 10];
    const nextStep = steps.find((step) => normalized <= step) ?? 10;

    return nextStep * magnitude;
};

const getDivergingBarDomain = (
    data: LineChartDatum[],
    barMode: BarMode,
    statusSeriesMode: AnalyticsChartStatusSeriesMode
): [number, number] | undefined => {
    if (barMode !== 'statusRatio' && barMode !== 'statusAmount' && barMode !== 'inboundStatusCount') {
        return undefined;
    }

    const { maxPositiveStack, maxNegativeStack, maxAbsStack } = data.reduce(
        (acc, item) => {
            if (barMode === 'inboundStatusCount') {
                const managed = Number(item.liveAmount ?? 0);
                const prospect = Number(item.pendingAmount ?? 0);
                const contracted = Number(item.totalAmount ?? 0);
                const failed = Math.abs(Number(item.stoppedAmount ?? 0));
                const positiveTotal = managed + prospect + contracted;

                return {
                    maxPositiveStack: Math.max(acc.maxPositiveStack, positiveTotal),
                    maxNegativeStack: Math.max(acc.maxNegativeStack, failed),
                    maxAbsStack: Math.max(acc.maxAbsStack, positiveTotal, failed),
                };
            }

            const live = Number(item.liveAmount ?? 0);
            const pending = Number(item.pendingAmount ?? 0);
            const stopByClient =
                statusSeriesMode === 'category'
                    ? Math.abs(Number(item.stoppedAmount ?? 0))
                    : Math.abs(Number(item.stopByClientAmount ?? 0));
            const stopByPerformance =
                statusSeriesMode === 'category'
                    ? Math.abs(Number(item.endAmount ?? 0))
                    : Math.abs(Number(item.stopByPerformanceAmount ?? 0));
            const positiveTotal = live + pending;
            const negativeTotal = stopByClient + stopByPerformance;

            return {
                maxPositiveStack: Math.max(acc.maxPositiveStack, positiveTotal),
                maxNegativeStack: Math.max(acc.maxNegativeStack, negativeTotal),
                maxAbsStack: Math.max(acc.maxAbsStack, positiveTotal, negativeTotal),
            };
        },
        { maxPositiveStack: 0, maxNegativeStack: 0, maxAbsStack: 0 }
    );

    if (barMode === 'statusRatio') {
        const padded = Math.min(100, Math.max(10, Math.ceil((maxAbsStack * 1.1) / 10) * 10));
        return [-padded, padded];
    }

    if (barMode === 'inboundStatusCount') {
        const padded = Math.max(1, toTightCountDomainValue(maxAbsStack * 1.08));
        return [-padded, padded];
    }

    const positivePadded =
        maxPositiveStack > 0 ? Math.max(1, toTightAmountDomainValue(maxPositiveStack * 1.02)) : 0;
    const negativePadded =
        maxNegativeStack > 0 ? Math.max(1, toTightAmountDomainValue(maxNegativeStack * 1.02)) : 0;

    if (positivePadded === 0 && negativePadded === 0) return [-1, 1];
    if (negativePadded === 0) return [0, positivePadded];
    if (positivePadded === 0) return [-negativePadded, 0];
    return [-negativePadded, positivePadded];
};

const getGroupedStackBarDomain = (
    data: LineChartDatum[],
    seriesMeta: Array<{ key: string; stackId?: string }>,
    barMode: BarMode
): [number, number] | undefined => {
    if (data.length === 0 || seriesMeta.length === 0) {
        return undefined;
    }

    const stackIds = Array.from(new Set(seriesMeta.map((item) => item.stackId ?? item.key)));

    const { maxPositiveStack, maxNegativeStack } = data.reduce(
        (acc, datum) => {
            stackIds.forEach((stackId) => {
            const stackSeries = seriesMeta.filter((item) => (item.stackId ?? item.key) === stackId);

            const { positiveTotal, negativeTotal } = stackSeries.reduce(
                (totals, seriesItem) => {
                    const value = Number(datum[seriesItem.key] ?? 0);
                    if (!Number.isFinite(value)) return totals;

                    if (value >= 0) {
                        totals.positiveTotal += value;
                    } else {
                        totals.negativeTotal += Math.abs(value);
                    }

                    return totals;
                },
                { positiveTotal: 0, negativeTotal: 0 }
            );

                acc.maxPositiveStack = Math.max(acc.maxPositiveStack, positiveTotal);
                acc.maxNegativeStack = Math.max(acc.maxNegativeStack, negativeTotal);
            });

            return acc;
        },
        { maxPositiveStack: 0, maxNegativeStack: 0 }
    );

    if (barMode === 'statusRatio') {
        const positivePadded =
            maxPositiveStack > 0
                ? Math.min(100, Math.max(10, Math.ceil((maxPositiveStack * 1.1) / 10) * 10))
                : 0;
        const negativePadded =
            maxNegativeStack > 0
                ? Math.min(100, Math.max(10, Math.ceil((maxNegativeStack * 1.1) / 10) * 10))
                : 0;

        if (positivePadded === 0 && negativePadded === 0) return [-10, 10];
        if (negativePadded === 0) return [0, positivePadded];
        if (positivePadded === 0) return [-negativePadded, 0];
        return [-negativePadded, positivePadded];
    }

    const positivePadded =
        maxPositiveStack > 0 ? toTightAmountDomainValue(maxPositiveStack * 1.02) : 0;
    const negativePadded =
        maxNegativeStack > 0 ? toTightAmountDomainValue(maxNegativeStack * 1.02) : 0;

    if (positivePadded === 0 && negativePadded === 0) return [-1, 1];
    if (negativePadded === 0) return [0, positivePadded];
    if (positivePadded === 0) return [-negativePadded, 0];
    return [-negativePadded, positivePadded];
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
        tight ? toTightAmountDomainValue(maxValue * 1.2) : toNiceDomainValue(maxValue * 1.1)
    );
    return [0, padded];
};

const getBarSeries = (barMode: BarMode, statusSeriesMode: AnalyticsChartStatusSeriesMode) => {
    if (barMode === 'statusRatio' || barMode === 'statusAmount') {
        return statusSeriesMode === 'category' ? [...STATUS_CATEGORY_SERIES] : [...STATUS_REASON_SERIES];
    }
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

const normalizeStatusDatum = (datum: LineChartDatum): LineChartDatum => ({
    ...datum,
    liveAmount: normalizeChartAmount(datum.liveAmount, 'positive'),
    pendingAmount: normalizeChartAmount(datum.pendingAmount, 'positive'),
    stoppedAmount: normalizeChartAmount(datum.stoppedAmount, 'negative'),
    endAmount: normalizeChartAmount(datum.endAmount, 'negative'),
    stopByClientAmount: normalizeChartAmount(datum.stopByClientAmount, 'negative'),
    stopByPerformanceAmount: normalizeChartAmount(datum.stopByPerformanceAmount, 'negative'),
});

const normalizeGroupedStatusDatum = (datum: LineChartDatum): LineChartDatum =>
    Object.entries(datum).reduce<LineChartDatum>((acc, [key, value]) => {
        if (key === 'periodLabel') {
            acc[key] = value;
            return acc;
        }

        const groupedInfo = parseGroupedSeriesKey(key);
        if (!groupedInfo) {
            acc[key] = value;
            return acc;
        }

        if (groupedInfo.statusKey === 'live' || groupedInfo.statusKey === 'waiting') {
            acc[key] = normalizeChartAmount(value, 'positive');
            return acc;
        }

        if (
            groupedInfo.statusKey === 'adStop' ||
            groupedInfo.statusKey === 'end' ||
            groupedInfo.statusKey === 'stopByClient' ||
            groupedInfo.statusKey === 'stopByPerformance'
        ) {
            acc[key] = normalizeChartAmount(value, 'negative');
            return acc;
        }

        acc[key] = value;
        return acc;
    }, {} as LineChartDatum);

const areAvatarAnchorsEqual = (a: AvatarAnchor[], b: AvatarAnchor[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i += 1) {
        const left = a[i];
        const right = b[i];

        if (
            left.key !== right.key ||
            left.label !== right.label ||
            left.profileSrc !== right.profileSrc ||
            left.avatarSeed !== right.avatarSeed ||
            left.avatarKind !== right.avatarKind ||
            left.left !== right.left ||
            left.top !== right.top
        ) {
            return false;
        }
    }

    return true;
};

const areDrawnBarRectsEqual = (a: DrawnBarRect[], b: DrawnBarRect[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i += 1) {
        const left = a[i];
        const right = b[i];

        if (
            left.seriesKey !== right.seriesKey ||
            left.stackId !== right.stackId ||
            left.idx !== right.idx ||
            left.left !== right.left ||
            left.top !== right.top ||
            left.width !== right.width ||
            left.height !== right.height ||
            left.isPlaceholder !== right.isPlaceholder
        ) {
            return false;
        }
    }

    return true;
};

const useElementSize = (element: HTMLElement | null) => {
    const [size, setSize] = useState<ChartAreaSize>({ width: 0, height: 0 });

    useEffect(() => {
        if (!element) {
            setSize((prev) =>
                prev.width === 0 && prev.height === 0 ? prev : { width: 0, height: 0 }
            );
            return;
        }

        const update = () => {
            const next = {
                width: element.clientWidth,
                height: element.clientHeight,
            };

            setSize((prev) =>
                prev.width === next.width && prev.height === next.height ? prev : next
            );
        };

        update();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', update);
            return () => window.removeEventListener('resize', update);
        }

        const observer = new ResizeObserver(update);
        observer.observe(element);

        return () => observer.disconnect();
    }, [element]);

    return size;
};

const getPlotFrame = (chart: uPlot | null): PlotFrame | null => {
    if (!chart) return null;

    const rootRect = chart.root.getBoundingClientRect();
    const plotRect = chart.over.getBoundingClientRect();

    return {
        left: plotRect.left - rootRect.left,
        top: plotRect.top - rootRect.top,
        width: plotRect.width,
        height: plotRect.height,
    };
};

const buildCategoryLabels = (labels: string[], stride: number, condensed: boolean) => {
    void stride;

    return (labels.length > 0 ? labels : []).map((label, index) => {
        if (!condensed) return label;

        const isEdge = index === 0 || index === labels.length - 1;
        return isEdge ? label : '';
    });
};

const buildNumericXAxis = ({
    labelsRef,
    strideRef,
    condensedRef,
    axisLineColor,
    showTicks,
    size,
    gap,
}: {
    labelsRef: React.MutableRefObject<string[]>;
    strideRef: React.MutableRefObject<number>;
    condensedRef: React.MutableRefObject<boolean>;
    axisLineColor: string;
    showTicks: boolean;
    size: number;
    gap: number;
}): uPlot.Axis => ({
    side: 2,
    size,
    gap,
    stroke: '#6B7280',
    font: `12px ${FONT_FAMILY}`,
    splits: () => labelsRef.current.map((_, index) => index),
    values: () => buildCategoryLabels(labelsRef.current, strideRef.current, condensedRef.current),
    grid: { show: false },
    ticks: {
        show: showTicks,
        stroke: '#CBD5E1',
        width: 1,
        size: showTicks ? 8 : 4,
    },
    border: {
        show: true,
        stroke: axisLineColor,
        width: 1,
    },
});

const buildNumericYAxis = ({
    width,
    formatterRef,
    showGrid,
    integerOnly = false,
}: {
    width: number;
    formatterRef: React.MutableRefObject<(value: number) => string>;
    showGrid: boolean;
    integerOnly?: boolean;
}): uPlot.Axis => ({
    side: 3,
    size: width,
    gap: 0,
    align: 1,
    alignTo: 2,
    stroke: '#6B7280',
    font: `12px ${FONT_FAMILY}`,
    incrs: integerOnly ? [...INTEGER_AXIS_INCREMENTS] : undefined,
    filter: (_self, splits) => dedupeAxisSplitsByFormatter(splits, formatterRef.current),
    values: (_self, splits) =>
        splits.map((value) => (value == null ? '' : formatterRef.current(Number(value)))),
    ticks: { show: false },
    border: { show: false },
    grid: {
        show: showGrid,
        stroke: '#EEF2F7',
        width: 1,
    },
});

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
                <Text size={13}>
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sortedItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <MemberProfileAvatar
                            name={item.label}
                            src={resolveAvatarSrc(
                                item.profileSrc,
                                item.avatarSeed ?? item.key,
                                item.avatarKind ?? 'user'
                            )}
                            size={20}
                            fontSize={11}
                            style={chartAvatarStyle}
                        />
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.label}
                        </Text>
                        <Text size={13} weight={'semibold'}>
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
        .sort(
            (a, b) =>
                compareTooltipSeriesOrder(a, b) ||
                Math.abs(b.value) - Math.abs(a.value) ||
                a.label.localeCompare(b.label, 'ko-KR')
        );

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size={13}>
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sortedItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        {renderTooltipMarker(item.key, item.color, item.label)}
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.label}
                        </Text>
                        <Text size={13} weight={'semibold'}>
                            {valueFormatter(Math.abs(item.value))}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NoDataTooltipContent = ({ label }: { label?: string | number }) => (
    <div style={tooltipStyle}>
        {label ? (
            <Text size={13}>
                {label}
            </Text>
        ) : null}
        <Text size={13} tone="muted">
            집계 데이터 없음
        </Text>
    </div>
);

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
        .sort(
            (a, b) =>
                compareTooltipSeriesOrder(
                    { key: parseGroupedSeriesKey(a.key)?.statusKey, label: a.statusLabel },
                    { key: parseGroupedSeriesKey(b.key)?.statusKey, label: b.statusLabel }
                ) ||
                Math.abs(b.value) - Math.abs(a.value) ||
                a.statusLabel.localeCompare(b.statusLabel, 'ko-KR')
        );

    if (marketerSeriesItems.length === 0) return null;

    const marketerName = marketerSeriesItems[0]?.marketerName ?? '';

    return (
        <div style={tooltipStyle}>
            {label ? (
                <Text size={13}>
                    {label}
                </Text>
            ) : null}
            {marketerName ? (
                <Text size={13} tone="muted">
                    {marketerName}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {marketerSeriesItems.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        {renderTooltipMarker(parseGroupedSeriesKey(item.key)?.statusKey, item.color, item.statusLabel)}
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.statusLabel}
                        </Text>
                        <Text size={13} weight={'semibold'}>
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
                <Text size={13}>
                    {label}
                </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((item) => (
                    <div key={item.key} style={tooltipItemStyle}>
                        <MemberProfileAvatar
                            name={item.label}
                            src={resolveAvatarSrc(
                                item.profileSrc,
                                item.avatarSeed ?? item.key,
                                item.avatarKind ?? 'user'
                            )}
                            size={20}
                            fontSize={11}
                            style={chartAvatarStyle}
                        />
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {`${item.label} · ${Math.round(item.ratio)}%`}
                        </Text>
                        <Text size={13} weight={'semibold'}>
                            {formatCurrency(item.raw)}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

const buildLineTooltipPayload = (
    idx: number,
    lineChartData: LineChartDatum[],
    seriesMeta: LineSeriesMeta[]
): TooltipPayloadItem[] => {
    const datum = lineChartData[idx];
    if (!datum) return [];

    return seriesMeta.map((seriesItem) => ({
        dataKey: seriesItem.key,
        value: datum[seriesItem.key],
        payload: datum,
    }));
};

const buildBarTooltipPayload = (
    idx: number,
    barData: LineChartDatum[],
    seriesKeys: string[]
): TooltipPayloadItem[] => {
    const datum = barData[idx];
    if (!datum) return [];

    return seriesKeys.map((key) => ({
        dataKey: key,
        value: datum[key],
        payload: datum,
    }));
};

const getStackOrderKey = (statusKey: string) => {
    if (statusKey === 'live') return 0;
    if (statusKey === 'waiting') return 1;
    if (statusKey === 'stopByClient') return 2;
    if (statusKey === 'stopByPerformance') return 3;
    if (statusKey === 'adStop') return 2;
    if (statusKey === 'end') return 3;
    return 99;
};

const createGoalLinePlugin = (
    goalMarkerBySeriesIdRef: React.MutableRefObject<Record<string, number> | undefined>,
    seriesMetaRef: React.MutableRefObject<LineSeriesMeta[]>
): uPlot.Plugin => ({
    hooks: {
        draw: [
            (chart) => {
                const goalMarkerBySeriesId = goalMarkerBySeriesIdRef.current;
                if (!goalMarkerBySeriesId || Object.keys(goalMarkerBySeriesId).length === 0) return;

                const frame = getPlotFrame(chart);
                if (!frame) return;

                const ctx = chart.ctx;
                const pxRatio = uPlot.pxRatio || 1;
                const seriesMetaByKey = seriesMetaRef.current.reduce<Map<string, LineSeriesMeta>>(
                    (acc, item) => acc.set(item.key, item),
                    new Map()
                );

                ctx.save();
                ctx.setLineDash([4 * pxRatio, 4 * pxRatio]);
                ctx.lineWidth = pxRatio;

                Object.entries(goalMarkerBySeriesId).forEach(([seriesKey, goal]) => {
                    const meta = seriesMetaByKey.get(seriesKey);
                    if (!meta || !Number.isFinite(goal)) return;

                    const y = frame.top + chart.valToPos(goal, 'y');
                    ctx.beginPath();
                    ctx.strokeStyle = meta.color;
                    ctx.globalAlpha = 0.2;
                    ctx.moveTo(frame.left * pxRatio, y * pxRatio);
                    ctx.lineTo((frame.left + frame.width) * pxRatio, y * pxRatio);
                    ctx.stroke();
                });

                ctx.restore();
            },
        ],
    },
});

const buildBarGeometry = ({
    chart,
    data,
    seriesMeta,
    isGroupedAmountBar,
    isGroupedStackBar,
    dashboardCategoryGap,
    dashboardBarGap,
    isDashboardMetricPreset,
    barMode,
    dashboardBarMaxWidth,
}: {
    chart: uPlot;
    data: LineChartDatum[];
    seriesMeta: Array<{
        key: string;
        color: string;
        stackId?: string;
        label: string;
        profileSrc?: string;
        avatarSrc?: string;
        avatarName?: string;
        avatarKind?: AnalyticsChartAvatarKind;
        avatarSeed?: string;
    }>;
    isGroupedAmountBar: boolean;
    isGroupedStackBar: boolean;
    dashboardCategoryGap: number;
    dashboardBarGap?: number;
    isDashboardMetricPreset: boolean;
    barMode: BarMode;
    dashboardBarMaxWidth?: number;
}): { rects: DrawnBarRect[]; avatars: AvatarAnchor[] } => {
    const frame = getPlotFrame(chart);
    if (!frame || data.length === 0) return { rects: [], avatars: [] };

    const plotWidth = frame.width;
    const categoryWidth = plotWidth / data.length;
    const gapPx = isDashboardMetricPreset ? dashboardCategoryGap : 30;
    const intraGapPx = dashboardBarGap ?? 0;
    const fillRatio = isDashboardMetricPreset ? getDashboardBarFillRatio(data.length) : 1;
    const totalCategoryGapWidth = gapPx * Math.max(data.length - 1, 0);
    const countAwareCategoryWidth = Math.max(plotWidth - totalCategoryGapWidth, 0) / Math.max(data.length, 1);

    const stackIds = isGroupedStackBar
        ? Array.from(new Set(seriesMeta.map((item) => item.stackId ?? item.key)))
        : isGroupedAmountBar
        ? seriesMeta.map((item) => item.key)
        : ['__single__'];

    const groupCount = Math.max(stackIds.length, 1);
    const clusterWidth = Math.max(categoryWidth - gapPx, Math.min(categoryWidth * 0.92, categoryWidth));
    const rawGroupWidth =
        groupCount > 1 ? (clusterWidth - intraGapPx * (groupCount - 1)) / groupCount : clusterWidth;
    const fixedAmountWidth = !isDashboardMetricPreset && barMode === 'amount' ? 42 : undefined;
    const countAwareGroupWidth = Math.max(
        1,
        Math.floor(
            (countAwareCategoryWidth * fillRatio - intraGapPx * Math.max(groupCount - 1, 0)) /
                Math.max(groupCount, 1)
        )
    );
    const dashboardBarWidth = isDashboardMetricPreset
        ? Math.min(dashboardBarMaxWidth ?? DEFAULT_DASHBOARD_BAR_WIDTH, countAwareGroupWidth)
        : undefined;
    const groupWidth = fixedAmountWidth
        ? Math.min(rawGroupWidth, fixedAmountWidth)
        : dashboardBarWidth !== undefined
          ? Math.min(rawGroupWidth, dashboardBarWidth)
          : rawGroupWidth;
    const clusterVisibleWidth =
        groupCount > 1 ? groupWidth * groupCount + intraGapPx * (groupCount - 1) : groupWidth;

    const rects: DrawnBarRect[] = [];
    const avatars: AvatarAnchor[] = [];

    const stackSeriesById = stackIds.reduce<Record<string, typeof seriesMeta>>((acc, stackId) => {
        const stackSeries =
            isGroupedStackBar
                ? seriesMeta.filter((item) => (item.stackId ?? item.key) === stackId)
                : isGroupedAmountBar
                  ? seriesMeta.filter((item) => item.key === stackId)
                  : seriesMeta;

        acc[stackId] = stackSeries.sort((left, right) => {
            const leftKey = parseGroupedSeriesKey(left.key)?.statusKey ?? left.key;
            const rightKey = parseGroupedSeriesKey(right.key)?.statusKey ?? right.key;
            return getStackOrderKey(leftKey) - getStackOrderKey(rightKey);
        });
        return acc;
    }, {});

    data.forEach((datum, idx) => {
        const centerX = frame.left + chart.valToPos(idx, 'x');
        const clusterLeft = centerX - clusterVisibleWidth / 2;
        let hasVisibleValue = false;

        stackIds.forEach((stackId, groupIndex) => {
            const groupLeft = clusterLeft + groupIndex * (groupWidth + intraGapPx);
            const stackSeries = stackSeriesById[stackId] ?? [];

            let positiveAcc = 0;
            let negativeAcc = 0;
            let stackTop: number | null = null;

            stackSeries.forEach((seriesItem) => {
                const rawValue = Number(datum[seriesItem.key] ?? 0);
                if (!Number.isFinite(rawValue) || rawValue === 0) return;

                const fromValue = rawValue >= 0 ? positiveAcc : negativeAcc;
                const toValue = fromValue + rawValue;

                if (rawValue >= 0) positiveAcc = toValue;
                else negativeAcc = toValue;

                const topValue = Math.max(fromValue, toValue);
                const bottomValue = Math.min(fromValue, toValue);
                const top = frame.top + chart.valToPos(topValue, 'y');
                const bottom = frame.top + chart.valToPos(bottomValue, 'y');

                const nextRect: DrawnBarRect = {
                    seriesKey: seriesItem.key,
                    stackId,
                    idx,
                    left: groupLeft,
                    top: Math.min(top, bottom),
                    width: groupWidth,
                    height: Math.abs(bottom - top),
                };

                rects.push(nextRect);
                hasVisibleValue = true;
                stackTop = stackTop === null ? nextRect.top : Math.min(stackTop, nextRect.top);
            });

            if (stackTop !== null) {
                const avatarSeries = stackSeries.find((item) => (item.stackId ?? item.key) === stackId);
                if (avatarSeries) {
                    const avatarLabel = avatarSeries.label.split(' · ')[0] ?? avatarSeries.label;
                    avatars.push({
                        key: `${stackId}-${idx}`,
                        label: avatarLabel,
                        profileSrc: avatarSeries.avatarSrc ?? avatarSeries.profileSrc,
                        avatarSeed:
                            avatarSeries.avatarSeed ??
                            avatarSeries.stackId ??
                            avatarSeries.avatarName ??
                            avatarLabel,
                        avatarKind: avatarSeries.avatarKind,
                        left: groupLeft + groupWidth / 2,
                        top: Math.max(stackTop - GROUPED_STACK_AVATAR_SIZE - 8, 4),
                    });
                }
            }
        });

    });

    return { rects, avatars };
};

const UplotLineChart = ({
    size,
    labels,
    lineChartData,
    seriesMeta,
    isDashboardMetricPreset,
    dashboardLineXAxisLabelStride,
    goalMarkerBySeriesId,
}: {
    size: ChartAreaSize;
    labels: string[];
    lineChartData: LineChartDatum[];
    seriesMeta: LineSeriesMeta[];
    isDashboardMetricPreset: boolean;
    dashboardLineXAxisLabelStride: number;
    goalMarkerBySeriesId?: Record<string, number>;
}) => {
    const [chart, setChart] = useState<uPlot | null>(null);
    const cursorStore = useMemo(
        () => createLocalStore<CursorState>({ idx: null, left: 0, top: 0 }, areCursorStatesEqual),
        []
    );

    const xData = useMemo(() => labels.map((_, index) => index), [labels]);
    const alignedData = useMemo<uPlot.AlignedData>(
        () => [
            xData,
            ...seriesMeta.map((seriesItem) =>
                lineChartData.map((datum) => {
                    const value = Number(datum[seriesItem.key] ?? 0);
                    return Number.isFinite(value) ? value : null;
                })
            ),
        ],
        [lineChartData, seriesMeta, xData]
    );
    const labelsRef = useLatestRef(labels);
    const strideRef = useLatestRef(dashboardLineXAxisLabelStride);
    const condensedRef = useLatestRef(isDashboardMetricPreset);
    const lineChartDataRef = useLatestRef(lineChartData);
    const seriesMetaRef = useLatestRef(seriesMeta);
    const goalMarkerBySeriesIdRef = useLatestRef(goalMarkerBySeriesId);

    const lineYRange = useMemo<[number, number]>(() => {
        const values = lineChartData.flatMap((datum) =>
            seriesMeta
                .map((seriesItem) => Number(datum[seriesItem.key] ?? 0))
                .filter((value) => Number.isFinite(value))
        );

        if (values.length === 0) return [0, 1];

        const min = Math.min(...values);
        const max = Math.max(...values);

        if (min >= 0) {
            return [0, Math.max(1, toTightAmountDomainValue(max * 1.2))];
        }

        if (max <= 0) {
            return [-Math.max(1, toTightAmountDomainValue(Math.abs(min) * 1.02)), 0];
        }

        const padded = Math.max(1, toTightAmountDomainValue(Math.max(Math.abs(min), Math.abs(max)) * 1.02));
        return [-padded, padded];
    }, [lineChartData, seriesMeta]);
    const lineYRangeRef = useLatestRef(lineYRange);
    const xAxis = useMemo(
        () =>
            buildNumericXAxis({
                labelsRef,
                strideRef,
                condensedRef,
                axisLineColor: isDashboardMetricPreset ? 'transparent' : '#E5E7EB',
                showTicks: isDashboardMetricPreset,
                size: isDashboardMetricPreset ? 40 : 36,
                gap: isDashboardMetricPreset ? 0 : 8,
            }),
        [condensedRef, isDashboardMetricPreset, labelsRef, strideRef]
    );

    const plugins = useMemo<uPlot.Plugin[]>(
        () => [
            {
                hooks: {
                    setCursor: [
                        (instance) => {
                            cursorStore.set({
                                idx: instance.cursor.idx ?? null,
                                left: instance.cursor.left ?? 0,
                                top: instance.cursor.top ?? 0,
                            });
                        },
                    ],
                },
            },
            createGoalLinePlugin(goalMarkerBySeriesIdRef, seriesMetaRef),
        ],
        [cursorStore, goalMarkerBySeriesIdRef, seriesMetaRef]
    );

    const options = useMemo<uPlot.Options>(() => {
        const lineSeries: uPlot.Series[] = seriesMeta.map((seriesItem) => ({
            label: seriesItem.label,
            stroke: seriesItem.color,
            width: 2,
            points: { show: false },
        }));

        return {
            width: Math.max(size.width, 1),
            height: Math.max(size.height, 1),
            padding: [28, 12, MIN_VERTICAL_CHART_PADDING, 0],
            legend: { show: false },
            plugins,
            scales: {
                x: {
                    time: false,
                    range: () => (labelsRef.current.length > 0 ? [-0.5, labelsRef.current.length - 0.5] : [0, 1]),
                },
                y: {
                    auto: false,
                    range: () => lineYRangeRef.current,
                },
            },
            axes: [
                xAxis,
                {
                    show: false,
                },
            ],
            cursor: {
                y: false,
                x: true,
                drag: { setScale: false, x: false, y: false },
                focus: { prox: 24 },
                points: { show: false },
            },
            series: [{}, ...lineSeries],
        };
    }, [labelsRef, lineYRangeRef, plugins, seriesMeta, size.height, size.width, xAxis]);

    if (size.width <= 0 || size.height <= 0) return null;

    return (
        <div className={styles.UplotRoot}>
            <ManagedUplot
                options={options}
                data={alignedData}
                onCreate={setChart}
                onDelete={() => setChart(null)}
                resetScales
            />
            <div className={styles.OverlayLayer}>
                <UplotLineTooltipOverlay
                    chart={chart}
                    cursorStore={cursorStore}
                    size={size}
                    labels={labels}
                    lineChartData={lineChartDataRef.current}
                    seriesMeta={seriesMetaRef.current}
                />
            </div>
        </div>
    );
};

const UplotLineTooltipOverlay = memo(({
    chart,
    cursorStore,
    size,
    labels,
    lineChartData,
    seriesMeta,
}: {
    chart: uPlot | null;
    cursorStore: LocalStore<CursorState>;
    size: ChartAreaSize;
    labels: string[];
    lineChartData: LineChartDatum[];
    seriesMeta: LineSeriesMeta[];
}) => {
    const cursorState = useSyncExternalStore(
        cursorStore.subscribe,
        cursorStore.getSnapshot,
        cursorStore.getSnapshot
    );

    const frame = getPlotFrame(chart);

    const activeLinePoint = useMemo<LinePointOverlay | null>(() => {
        if (!chart || !frame || cursorState.idx === null || cursorState.idx < 0 || cursorState.idx >= lineChartData.length) {
            return null;
        }

        let candidate: LinePointOverlay | null = null;

        seriesMeta.forEach((seriesItem) => {
            const value = Number(lineChartData[cursorState.idx]?.[seriesItem.key] ?? 0);
            if (!Number.isFinite(value)) return;

            const x = frame.left + chart.valToPos(cursorState.idx, 'x');
            const y = frame.top + chart.valToPos(value, 'y');
            const dist = Math.abs(y - (frame.top + cursorState.top));

            if (!candidate || dist < Math.abs(candidate.top - (frame.top + cursorState.top))) {
                candidate = {
                    key: seriesItem.key,
                    label: seriesItem.label,
                    profileSrc: seriesItem.profileSrc,
                    avatarKind: seriesItem.avatarKind,
                    avatarSeed: seriesItem.avatarSeed,
                    left: x,
                    top: y,
                    value,
                };
            }
        });

        return candidate;
    }, [chart, cursorState.idx, cursorState.top, frame, lineChartData, seriesMeta]);

    const tooltipPayload = useMemo(
        () =>
            cursorState.idx === null ? [] : buildLineTooltipPayload(cursorState.idx, lineChartData, seriesMeta),
        [cursorState.idx, lineChartData, seriesMeta]
    );

    if (!frame) return null;

    return (
        <>
            {activeLinePoint ? (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            left: activeLinePoint.left,
                            top: activeLinePoint.top,
                            width: 10,
                            height: 10,
                            borderRadius: 999,
                            background: '#111827',
                            border: '2px solid #fff',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: activeLinePoint.left,
                            top: Math.max(activeLinePoint.top - LINE_AVATAR_SIZE - 10, 4),
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <MemberProfileAvatar
                            name={activeLinePoint.label}
                            src={resolveAvatarSrc(
                                activeLinePoint.profileSrc,
                                activeLinePoint.avatarSeed ?? activeLinePoint.key,
                                activeLinePoint.avatarKind ?? 'user'
                            )}
                            size={LINE_AVATAR_SIZE}
                            fontSize={11}
                            style={chartAvatarStyle}
                        />
                    </div>
                </>
            ) : null}
            {cursorState.idx !== null ? (
                <div
                    style={{
                        position: 'absolute',
                        left: clamp(frame.left + cursorState.left + 16, 12, Math.max(size.width - TOOLTIP_MAX_WIDTH, 12)),
                        top: clamp(frame.top + cursorState.top - 12, 12, Math.max(size.height - 140, 12)),
                    }}
                >
                    <LineTooltipContent
                        active
                        payload={tooltipPayload}
                        label={labels[cursorState.idx] ?? ''}
                        seriesMeta={seriesMeta}
                    />
                </div>
            ) : null}
        </>
    );
});

UplotLineTooltipOverlay.displayName = 'UplotLineTooltipOverlay';

const UplotBarChart = ({
    size,
    labels,
    barData,
    barSeries,
    lineSeriesMeta,
    isGroupedAmountBar,
    isGroupedStackBar,
    isAmountShareBar,
    shouldShowGroupedAmountAvatars,
    shouldShowGroupedStackAvatars,
    isDashboardMetricPreset,
    barMode,
    dashboardBarMaxWidth,
    barYAxisWidth,
    metricBarDomain,
    barTickFormatter,
    barTooltipValueFormatter,
    dashboardBarCategoryGap,
    dashboardBarGap,
    dashboardBarXAxisLabelStride,
    groupedStackSeries,
}: {
    size: ChartAreaSize;
    labels: string[];
    barData: LineChartDatum[];
    barSeries: Array<{
        key: string;
        label: string;
        color: string;
        stackId?: string;
        profileSrc?: string;
        avatarSrc?: string;
        avatarName?: string;
        avatarKind?: AnalyticsChartAvatarKind;
        avatarSeed?: string;
    }>;
    lineSeriesMeta: LineSeriesMeta[];
    isGroupedAmountBar: boolean;
    isGroupedStackBar: boolean;
    isAmountShareBar: boolean;
    shouldShowGroupedAmountAvatars: boolean;
    shouldShowGroupedStackAvatars: boolean;
    isDashboardMetricPreset: boolean;
    barMode: BarMode;
    barYAxisWidth: number;
    metricBarDomain?: [number, number];
    barTickFormatter: (value: number) => string;
    barTooltipValueFormatter: (value: number) => string;
    dashboardBarCategoryGap: number;
    dashboardBarGap?: number;
    dashboardBarMaxWidth?: number;
    dashboardBarXAxisLabelStride: number;
    groupedStackSeries: AnalyticsChartGroupedStackSeries[];
}) => {
    const [chart, setChart] = useState<uPlot | null>(null);
    const [avatarAnchors, setAvatarAnchors] = useState<AvatarAnchor[]>([]);
    const barRectsRef = useRef<DrawnBarRect[]>([]);
    const cursorStore = useMemo(
        () => createLocalStore<CursorState>({ idx: null, left: 0, top: 0 }, areCursorStatesEqual),
        []
    );
    const labelsRef = useLatestRef(labels);
    const strideRef = useLatestRef(dashboardBarXAxisLabelStride);
    const condensedRef = useLatestRef(isDashboardMetricPreset);
    const barDataRef = useLatestRef(barData);
    const barSeriesRef = useLatestRef(barSeries);
    const metricBarDomainRef = useLatestRef(metricBarDomain ?? [0, 1] as [number, number]);
    const categoryGapRef = useLatestRef(dashboardBarCategoryGap);
    const barGapRef = useLatestRef(dashboardBarGap);
    const barModeRef = useLatestRef(barMode);
    const dashboardPresetRef = useLatestRef(isDashboardMetricPreset);
    const dashboardBarMaxWidthRef = useLatestRef(dashboardBarMaxWidth);
    const barTickFormatterRef = useLatestRef(barTickFormatter);

    const xData = useMemo(() => labels.map((_, index) => index), [labels]);
    const alignedData = useMemo<uPlot.AlignedData>(
        () => [
            xData,
            ...barSeries.map((seriesItem) =>
                barData.map((datum) => {
                    const value = Number(datum[seriesItem.key] ?? 0);
                    return Number.isFinite(value) ? value : null;
                })
            ),
        ],
        [barData, barSeries, xData]
    );

    const syncBarGeometry = useCallback((nextRects: DrawnBarRect[], nextAvatars: AvatarAnchor[]) => {
        barRectsRef.current = nextRects;
        setAvatarAnchors((prev) => (areAvatarAnchorsEqual(prev, nextAvatars) ? prev : nextAvatars));
    }, []);
    const xAxis = useMemo(
        () =>
            buildNumericXAxis({
                labelsRef,
                strideRef,
                condensedRef,
                axisLineColor: isDashboardMetricPreset ? 'transparent' : '#E5E7EB',
                showTicks: isDashboardMetricPreset,
                size: isDashboardMetricPreset ? 40 : 36,
                gap: isDashboardMetricPreset ? 0 : 8,
            }),
        [condensedRef, isDashboardMetricPreset, labelsRef, strideRef]
    );
    const yAxis = useMemo(
        () =>
            buildNumericYAxis({
                width: barYAxisWidth,
                formatterRef: barTickFormatterRef,
                showGrid: !isDashboardMetricPreset,
                integerOnly: barMode === 'inboundStatusCount',
            }),
        [barMode, barTickFormatterRef, barYAxisWidth, isDashboardMetricPreset]
    );

    const plugins = useMemo<uPlot.Plugin[]>(
        () => [
            {
                hooks: {
                    setCursor: [
                        (instance) => {
                            const nextIdx = instance.cursor.idx ?? null;
                            const left = instance.cursor.left ?? 0;
                            const top = instance.cursor.top ?? 0;

                            if (nextIdx === null) {
                                cursorStore.set({ idx: null, left: 0, top: 0 });
                                return;
                            }

                            if (isGroupedStackBar) {
                                const frame = getPlotFrame(instance);
                                const plotLeft = frame?.left ?? 0;
                                const plotTop = frame?.top ?? 0;
                                const hovered = barRectsRef.current.find(
                                    (rect) =>
                                        rect.idx === nextIdx &&
                                        left + plotLeft >= rect.left &&
                                        left + plotLeft <= rect.left + rect.width &&
                                        top + plotTop >= rect.top &&
                                        top + plotTop <= rect.top + rect.height
                                );

                                cursorStore.set({
                                    idx: nextIdx,
                                    left,
                                    top,
                                    activeSeriesKey: hovered?.seriesKey,
                                });
                                return;
                            }

                            cursorStore.set({ idx: nextIdx, left, top });
                        },
                    ],
                    draw: [
                        (instance) => {
                            const frame = getPlotFrame(instance);
                            if (!frame) return;

                            const { rects, avatars } = buildBarGeometry({
                                chart: instance,
                                data: barDataRef.current,
                                seriesMeta: barSeriesRef.current,
                                isGroupedAmountBar,
                                isGroupedStackBar,
                                dashboardCategoryGap: categoryGapRef.current,
                                dashboardBarGap: barGapRef.current,
                                isDashboardMetricPreset: dashboardPresetRef.current,
                                barMode: barModeRef.current,
                                dashboardBarMaxWidth: dashboardBarMaxWidthRef.current,
                            });

                            if (
                                !areDrawnBarRectsEqual(barRectsRef.current, rects) ||
                                !areAvatarAnchorsEqual(avatarAnchors, avatars)
                            ) {
                                syncBarGeometry(rects, avatars);
                            }

                            const ctx = instance.ctx;
                            const pxRatio = uPlot.pxRatio || 1;

                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(frame.left * pxRatio, frame.top * pxRatio, frame.width * pxRatio, frame.height * pxRatio);
                            ctx.clip();

                            rects.forEach((rect) => {
                                if (rect.width <= 0 || rect.height <= 0) return;

                                const series = barSeriesRef.current.find((item) => item.key === rect.seriesKey);
                                if (!series) return;

                                ctx.beginPath();
                                ctx.fillStyle = series.color;
                                ctx.rect(rect.left * pxRatio, rect.top * pxRatio, rect.width * pxRatio, rect.height * pxRatio);
                                ctx.fill();
                            });

                            ctx.restore();
                        },
                    ],
                },
            },
        ],
        [
            cursorStore,
            barDataRef,
            barGapRef,
            barModeRef,
            barSeriesRef,
            categoryGapRef,
            dashboardPresetRef,
            isGroupedAmountBar,
            isGroupedStackBar,
            avatarAnchors,
            syncBarGeometry,
        ]
    );

    const options = useMemo<uPlot.Options>(() => ({
        width: Math.max(size.width, 1),
        height: Math.max(size.height, 1),
        padding: isDashboardMetricPreset
            ? [
                  Math.max(
                      shouldShowGroupedStackAvatars || shouldShowGroupedAmountAvatars ? 64 : 0,
                      MIN_VERTICAL_CHART_PADDING
                  ),
                  Math.max(barYAxisWidth - 40, 0),
                  MIN_VERTICAL_CHART_PADDING,
                  0,
              ]
            : [8, 12, MIN_VERTICAL_CHART_PADDING, 0],
        legend: { show: false },
        plugins,
        scales: {
            x: {
                time: false,
                range: () => (labelsRef.current.length > 0 ? [-0.5, labelsRef.current.length - 0.5] : [0, 1]),
            },
            y: {
                auto: false,
                range: () => metricBarDomainRef.current,
            },
        },
        axes: [xAxis, yAxis],
        cursor: {
            y: false,
            x: true,
            drag: { setScale: false, x: false, y: false },
            points: { show: false },
        },
        series: [
            {},
            ...barSeries.map((seriesItem) => ({
                label: seriesItem.label,
                show: false,
                stroke: seriesItem.color,
                width: 0,
                points: { show: false },
            })),
        ],
    }), [
        barSeries,
        barYAxisWidth,
        isDashboardMetricPreset,
        labelsRef,
        metricBarDomainRef,
        plugins,
        shouldShowGroupedAmountAvatars,
        shouldShowGroupedStackAvatars,
        size.height,
        size.width,
        xAxis,
        yAxis,
    ]);

    if (size.width <= 0 || size.height <= 0) return null;

    return (
        <div className={styles.UplotRoot}>
            <ManagedUplot
                options={options}
                data={alignedData}
                onCreate={setChart}
                onDelete={() => setChart(null)}
                resetScales
            />
            <div className={styles.OverlayLayer}>
                {shouldShowGroupedStackAvatars || shouldShowGroupedAmountAvatars
                    ? avatarAnchors.map((item) => (
                        <div
                            key={item.key}
                            style={{
                                position: 'absolute',
                                left: item.left,
                                top: item.top,
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <MemberProfileAvatar
                                name={item.label}
                                src={resolveAvatarSrc(
                                    item.profileSrc,
                                    item.avatarSeed ?? item.label,
                                    item.avatarKind ?? 'user'
                                )}
                                size={GROUPED_STACK_AVATAR_SIZE}
                                fontSize={11}
                                style={chartAvatarStyle}
                            />
                        </div>
                    ))
                    : null}
                <UplotBarTooltipOverlay
                    chart={chart}
                    cursorStore={cursorStore}
                    size={size}
                    labels={labels}
                    barData={barData}
                    barSeries={barSeries}
                    lineSeriesMeta={lineSeriesMeta}
                    groupedStackSeries={groupedStackSeries}
                    isGroupedAmountBar={isGroupedAmountBar}
                    isGroupedStackBar={isGroupedStackBar}
                    isAmountShareBar={isAmountShareBar}
                    barTooltipValueFormatter={barTooltipValueFormatter}
                    barRectsRef={barRectsRef}
                />
            </div>
        </div>
    );
};

const UplotBarTooltipOverlay = memo(({
    chart,
    cursorStore,
    size,
    labels,
    barData,
    barSeries,
    lineSeriesMeta,
    groupedStackSeries,
    isGroupedAmountBar,
    isGroupedStackBar,
    isAmountShareBar,
    barTooltipValueFormatter,
    barRectsRef,
}: {
    chart: uPlot | null;
    cursorStore: LocalStore<CursorState>;
    size: ChartAreaSize;
    labels: string[];
    barData: LineChartDatum[];
    barSeries: Array<{ key: string; label: string; color: string; stackId?: string; avatarSrc?: string; avatarName?: string }>;
    lineSeriesMeta: LineSeriesMeta[];
    groupedStackSeries: AnalyticsChartGroupedStackSeries[];
    isGroupedAmountBar: boolean;
    isGroupedStackBar: boolean;
    isAmountShareBar: boolean;
    barTooltipValueFormatter: (value: number) => string;
    barRectsRef: React.RefObject<DrawnBarRect[]>;
}) => {
    const cursorState = useSyncExternalStore(
        cursorStore.subscribe,
        cursorStore.getSnapshot,
        cursorStore.getSnapshot
    );

    const frame = getPlotFrame(chart);
    const activeDatum = cursorState.idx === null ? null : barData[cursorState.idx];
    const isMissingPeriod = Boolean(activeDatum?.isMissingData);

    const activeTooltipPayload = useMemo(() => {
        if (cursorState.idx === null || cursorState.idx < 0 || cursorState.idx >= barData.length) return [];

        if (!isGroupedStackBar) {
            return buildBarTooltipPayload(
                cursorState.idx,
                barData,
                barSeries.map((item) => item.key)
            );
        }

        if (!cursorState.activeSeriesKey) return [];

        const activeRect = barRectsRef.current.find(
            (item) => item.idx === cursorState.idx && item.seriesKey === cursorState.activeSeriesKey
        );
        if (!activeRect?.stackId) return [];

        const datum = barData[cursorState.idx];
        const stackSeries = groupedStackSeries
            .filter((item) => item.stackId === activeRect.stackId)
            .sort((left, right) => {
                const leftOrder = getStackOrderKey(parseGroupedSeriesKey(left.key)?.statusKey ?? left.key);
                const rightOrder = getStackOrderKey(parseGroupedSeriesKey(right.key)?.statusKey ?? right.key);
                return leftOrder - rightOrder;
            });

        const first = stackSeries.find((item) => item.key === cursorState.activeSeriesKey) ?? stackSeries[0];

        return [
            {
                dataKey: first?.key,
                value: first ? datum[first.key] : 0,
                payload: datum,
            },
            ...stackSeries
                .filter((item) => item.key !== first?.key)
                .map((item) => ({
                    dataKey: item.key,
                    value: datum[item.key],
                    payload: datum,
                })),
        ];
    }, [barData, barRectsRef, barSeries, cursorState.activeSeriesKey, cursorState.idx, groupedStackSeries, isGroupedStackBar]);

    if (!frame || cursorState.idx === null || (!isMissingPeriod && activeTooltipPayload.length === 0)) {
        return null;
    }

    return (
        <div
            style={{
                position: 'absolute',
                left: clamp(frame.left + cursorState.left + 16, 12, Math.max(size.width - TOOLTIP_MAX_WIDTH, 12)),
                top: clamp(frame.top + cursorState.top - 12, 12, Math.max(size.height - 160, 12)),
            }}
        >
            {isAmountShareBar ? (
                <AmountShareTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={lineSeriesMeta}
                />
            ) : isMissingPeriod ? (
                <NoDataTooltipContent label={labels[cursorState.idx] ?? ''} />
            ) : isGroupedAmountBar ? (
                <LineTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={lineSeriesMeta}
                />
            ) : isGroupedStackBar ? (
                <GroupedStackTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={groupedStackSeries}
                    valueFormatter={barTooltipValueFormatter}
                />
            ) : (
                <BarTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={barSeries}
                    valueFormatter={barTooltipValueFormatter}
                />
            )}
        </div>
    );
});

UplotBarTooltipOverlay.displayName = 'UplotBarTooltipOverlay';

const AnalyticsChart = ({
    periods = [],
    lineData,
    groupedStackData,
    chartType = 'BAR',
    barMode = 'amount',
    dashboardBarMaxWidth,
    preset,
    statusSeriesMode = 'reason',
    goalMarkerBySeriesId,
    isLoading = false,
    title = '운영 내역',
    showTitle = true,
    showLegend = true,
    showSeriesAvatars = false,
}: AnalyticsChartProps) => {
    const [chartAreaElement, setChartAreaElement] = useState<HTMLDivElement | null>(null);
    const chartAreaSize = useElementSize(chartAreaElement);

    const lineSeriesMeta = useMemo<LineSeriesMeta[]>(
        () =>
            (lineData?.series ?? []).map((item, index) => ({
                key: item.id,
                label: item.name,
                color: ANALYTICS_CHART_LINE_COLORS[index % ANALYTICS_CHART_LINE_COLORS.length],
                profileSrc: (item.profileImageUrl ?? item.profileSrc ?? '').trim() || undefined,
                avatarKind: item.avatarKind,
                avatarSeed: item.avatarSeed ?? item.id,
            })),
        [lineData?.series]
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

    const isGroupedAmountBar =
        chartType === 'BAR' && barMode === 'amount' && lineSeriesMeta.length > 0 && lineChartData.length > 0;
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

    const hasAnyGroupedAmountValue = useMemo(
        () =>
            lineChartData.some((datum) =>
                lineSeriesMeta.some((seriesItem) => Math.abs(Number(datum[seriesItem.key] ?? 0)) > 0)
            ),
        [lineChartData, lineSeriesMeta]
    );

    const barData = useMemo(
        () =>
            isGroupedAmountBar
                ? lineChartData.map((datum) => ({
                      ...datum,
                      isMissingData: !hasAnyGroupedAmountValue,
                  }))
                : isGroupedStackBar
                ? (groupedStackData?.data ?? []).map(normalizeGroupedStatusDatum)
                : periods.map((item) =>
                      normalizeStatusDatum({
                          periodLabel: item.periodLabel,
                          isMissingData: item.isMissingData,
                          totalAmount: item.totalAmount,
                          liveAmount: item.liveAmount,
                          pendingAmount: item.pendingAmount,
                          stoppedAmount: item.stoppedAmount,
                          endAmount: item.endAmount ?? 0,
                          stopByClientAmount: item.stopByClientAmount ?? 0,
                          stopByPerformanceAmount: item.stopByPerformanceAmount ?? 0,
                      })
                  ),
        [groupedStackData?.data, hasAnyGroupedAmountValue, isGroupedAmountBar, isGroupedStackBar, lineChartData, periods]
    );

    const barSeries = useMemo(
        () =>
            isGroupedAmountBar
                ? lineSeriesMeta
                : isGroupedStackBar
                ? groupedStackData?.series ?? []
                : getBarSeries(barMode, statusSeriesMode),
        [barMode, groupedStackData?.series, isGroupedAmountBar, isGroupedStackBar, lineSeriesMeta, statusSeriesMode]
    );

    const groupedStackCount = useMemo(
        () => new Set((groupedStackData?.series ?? []).map((item) => item.stackId)).size,
        [groupedStackData?.series]
    );

    const dashboardBarGroupCount = isGroupedAmountBar
        ? Math.max(barSeries.length, 1)
        : isGroupedStackBar
          ? groupedStackCount
          : 1;

    const shouldShowGroupedStackAvatars =
        isDashboardMetricPreset && isGroupedStackBar && groupedStackCount > 0 && groupedStackCount <= 5;
    const shouldShowGroupedAmountAvatars =
        showSeriesAvatars &&
        isDashboardMetricPreset &&
        isGroupedAmountBar &&
        barSeries.length > 0 &&
        barSeries.length <= 5;

    const barTickFormatter = useMemo(() => getBarTickFormatter(barMode), [barMode]);
    const barTooltipValueFormatter = useMemo(() => getTooltipValueFormatter(barMode), [barMode]);

    const barYAxisWidth =
        isDashboardMetricPreset
            ? barMode === 'statusAmount'
                ? 72
                : barMode === 'statusRatio'
                ? 84
                : barMode === 'inboundStatusCount'
                ? 72
                : 84
            : 54;

    const barChartPadding = useMemo<[number, number, number, number]>(
        () =>
            isDashboardMetricPreset
                ? [
                      Math.max(
                          shouldShowGroupedStackAvatars || shouldShowGroupedAmountAvatars ? 64 : 0,
                          MIN_VERTICAL_CHART_PADDING
                      ),
                      barMode === 'statusAmount' ? 8 : Math.max(barYAxisWidth - 40, 0),
                      MIN_VERTICAL_CHART_PADDING,
                      0,
                  ]
                : [8, 12, MIN_VERTICAL_CHART_PADDING, 0],
        [barMode, barYAxisWidth, isDashboardMetricPreset, shouldShowGroupedAmountAvatars, shouldShowGroupedStackAvatars]
    );

    const barPlotWidth = useMemo(() => {
        if (chartAreaSize.width <= 0) return DEFAULT_BAR_PLOT_WIDTH;
        const [, rightPadding, , leftPadding] = barChartPadding;

        return Math.max(chartAreaSize.width - barYAxisWidth - leftPadding - rightPadding, MIN_BAR_PLOT_WIDTH);
    }, [barChartPadding, barYAxisWidth, chartAreaSize.width]);

    const dashboardBarLayout = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardBarLayout(barData.length, barPlotWidth, dashboardBarGroupCount)
                : { categoryGap: 30, barGap: 0 },
        [barData.length, barPlotWidth, dashboardBarGroupCount, isDashboardMetricPreset]
    );

    const dashboardBarXAxisLabelStride = useMemo(
        () => (isDashboardMetricPreset ? getDashboardXAxisLabelStride(barData.length) : 1),
        [barData.length, isDashboardMetricPreset]
    );

    const dashboardLineXAxisLabelStride = useMemo(
        () => (isDashboardMetricPreset ? getDashboardXAxisLabelStride(lineChartData.length) : 1),
        [isDashboardMetricPreset, lineChartData.length]
    );

    const divergingStatusDomain = useMemo(() => {
        if (!isDivergingDataBar) return undefined;
        if (isGroupedStackBar) return getGroupedStackBarDomain(barData, barSeries, barMode);

        return getDivergingBarDomain(barData, barMode, statusSeriesMode);
    }, [barData, barMode, barSeries, isDivergingDataBar, isGroupedStackBar, statusSeriesMode]);

    const positiveAmountDomain = useMemo(
        () =>
            barMode === 'amount'
                ? getPositiveBarDomain(
                      barData,
                      barSeries.map((item) => item.key),
                      barMode,
                      false,
                      isDashboardMetricPreset
                  )
                : undefined,
        [barData, barMode, barSeries, isAmountShareBar, isDashboardMetricPreset]
    );

    const isAllBarPeriodsMissing =
        !isLoading &&
        chartType === 'BAR' &&
        barData.length > 0 &&
        !isGroupedStackBar &&
        barData.every((item) => item.isMissingData);

    const metricBarDomain = isAllBarPeriodsMissing ? ([0, 1] as [number, number]) : divergingStatusDomain ?? positiveAmountDomain;

    const legendSeries = useMemo(() => {
        const source = chartType === 'LINE' || isGroupedAmountBar ? lineSeriesMeta : barSeries;

        if (
            chartType !== 'BAR' ||
            (barMode !== 'statusRatio' && barMode !== 'statusAmount' && !isGroupedStackBar)
        ) {
            return source;
        }

        return [...source].sort((a, b) => compareTooltipSeriesOrder(a, b) || a.label.localeCompare(b.label, 'ko-KR'));
    }, [barMode, barSeries, chartType, isGroupedAmountBar, isGroupedStackBar, lineSeriesMeta]);

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
            ) : (
                <div className={styles.ContentMotion}>
                    <div className={styles.ChartMotion}>
                        <div ref={setChartAreaElement} style={chartAreaStyle}>
                            {chartType === 'LINE' ? (
                                <UplotLineChart
                                    size={chartAreaSize}
                                    labels={lineData?.periodLabels ?? []}
                                    lineChartData={lineChartData}
                                    seriesMeta={lineSeriesMeta}
                                    isDashboardMetricPreset={isDashboardMetricPreset}
                                    dashboardLineXAxisLabelStride={dashboardLineXAxisLabelStride}
                                    goalMarkerBySeriesId={goalMarkerBySeriesId}
                                />
                            ) : (
                                <UplotBarChart
                                    size={chartAreaSize}
                                    labels={barData.map((item) => String(item.periodLabel ?? ''))}
                                    barData={barData}
                                    barSeries={barSeries.map((item) => ({
                                        ...item,
                                        avatarName: 'avatarName' in item ? item.avatarName : undefined,
                                        avatarSrc: 'avatarSrc' in item ? item.avatarSrc : undefined,
                                    }))}
                                    lineSeriesMeta={lineSeriesMeta}
                                    isGroupedAmountBar={isGroupedAmountBar}
                                    isGroupedStackBar={isGroupedStackBar}
                                    isAmountShareBar={isAmountShareBar}
                                    shouldShowGroupedAmountAvatars={shouldShowGroupedAmountAvatars}
                                    shouldShowGroupedStackAvatars={shouldShowGroupedStackAvatars}
                                    isDashboardMetricPreset={isDashboardMetricPreset}
                                    barMode={barMode}
                                    barYAxisWidth={barYAxisWidth}
                                    metricBarDomain={metricBarDomain}
                                    barTickFormatter={barTickFormatter}
                                    barTooltipValueFormatter={barTooltipValueFormatter}
                                    dashboardBarCategoryGap={dashboardBarLayout.categoryGap}
                                    dashboardBarGap={dashboardBarLayout.barGap}
                                    dashboardBarMaxWidth={dashboardBarMaxWidth}
                                    dashboardBarXAxisLabelStride={dashboardBarXAxisLabelStride}
                                    groupedStackSeries={groupedStackData?.series ?? []}
                                />
                            )}
                        </div>
                    </div>

                    {showLegend ? (
                        <div className={styles.LegendMotion}>
                            <div style={legendStyle}>
                                {legendSeries.map((item) => (
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
