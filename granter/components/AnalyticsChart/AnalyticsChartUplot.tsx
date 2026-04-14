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
import type {
    AnalyticsChartAvatarKind,
    AnalyticsChartAvatarRenderer,
    AnalyticsChartBarClickPayload,
    AnalyticsChartBarPresentation,
    AnalyticsChartDatum,
    AnalyticsChartMarkerKind,
    AnalyticsChartPreset,
    AnalyticsChartProps,
    AnalyticsChartSeries,
    AnalyticsChartTooltipMode,
} from './AnalyticsChart.types';
import styles from './AnalyticsChart.module.scss';

type LineSeriesMeta = AnalyticsChartSeries;
type LineChartDatum = AnalyticsChartDatum;
type GroupedStackSeriesMeta = AnalyticsChartSeries;

type TooltipPayloadItem = {
    dataKey?: string | number;
    value?: string | number | boolean;
    payload?: LineChartDatum;
};

type LineTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: LineSeriesMeta[];
    valueFormatter: (value: number) => string;
    avatarRenderer?: AnalyticsChartAvatarRenderer;
};

type BarTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: AnalyticsChartSeries[];
    valueFormatter: (value: number) => string;
    countFormatter: (value: number) => string;
    showCountDivider?: boolean;
};

type GroupedStackTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: GroupedStackSeriesMeta[];
    valueFormatter: (value: number) => string;
    countFormatter: (value: number) => string;
    showCountDivider?: boolean;
};

type AmountShareTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    seriesMeta: LineSeriesMeta[];
    valueFormatter: (value: number) => string;
    avatarRenderer?: AnalyticsChartAvatarRenderer;
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

type AvatarAnchor = {
    key: string;
    label: string;
    profileSrc?: string;
    avatarSeed?: string;
    avatarKind?: AnalyticsChartAvatarKind;
    left: number;
    top: number;
};

type LocalStore<T> = {
    getSnapshot: () => T;
    subscribe: (listener: () => void) => () => void;
    set: (next: T) => void;
};

const DEFAULT_BAR_PLOT_WIDTH = 940;
const DEFAULT_DASHBOARD_BAR_WIDTH = 200;
const MIN_BAR_PLOT_WIDTH = 320;
const TOOLTIP_MAX_WIDTH = 320;
const FONT_FAMILY = 'Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif';
const GROUPED_STACK_AVATAR_SIZE = 30;
const MIN_VERTICAL_CHART_PADDING = 12;
const DEFAULT_BAR_Y_AXIS_MAX_TICK_COUNT = 6;
const DASHBOARD_BAR_Y_AXIS_MAX_TICK_COUNT = 5;
const BAR_GEOMETRY_ANIMATION_DURATION_MS = 960;
const BAR_GEOMETRY_ANIMATION_CSS_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
const INTEGER_AXIS_INCREMENTS = [
    1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000,
] as const;
const SMALL_COUNT_DASHBOARD_BAR_MAX_WIDTH_RATIOS = [
    0.634, 0.358, 0.249, 0.192, 0.156, 0.131, 0.112,
] as const;
const SMALL_COUNT_DASHBOARD_BAR_FILL_RATIOS = [
    0.92, 0.9, 0.88, 0.86, 0.88, 0.9, 0.92,
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
    width: 'max-content',
    minWidth: 0,
    maxWidth: TOOLTIP_MAX_WIDTH,
    padding: 12,
    border: '1px solid var(--granter-gray-200)',
    borderRadius: 12,
    background: 'var(--granter-white)',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
    boxSizing: 'border-box',
};

const tooltipItemStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '20px auto max-content',
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

const statusIconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    flexShrink: 0,
};

const formatNumericValue = (value: number) => value.toLocaleString('ko-KR');

const renderChartAvatar = ({
    avatarRenderer,
    label,
    profileSrc,
    seed,
    avatarKind = 'user',
    size,
    fontSize,
}: {
    label?: string | null;
    profileSrc?: string | null;
    seed?: string | null;
    avatarKind?: AnalyticsChartAvatarKind;
    size: number;
    fontSize: number;
    avatarRenderer?: AnalyticsChartAvatarRenderer;
}) =>
    avatarRenderer?.({
        label,
        profileSrc,
        seed,
        avatarKind,
        size,
        fontSize,
    }) ?? null;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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

const easeInOutCubic = (value: number) =>
    value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

const useChartAnimation = (
    data: uPlot.AlignedData | null,
    duration = BAR_GEOMETRY_ANIMATION_DURATION_MS
) => {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const animate = useCallback(
        (time: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = time;
            }
            const elapsedTime = time - startTimeRef.current;
            const nextProgress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutCubic(nextProgress);

            setProgress(easedProgress);

            if (nextProgress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            }
        },
        [duration]
    );

    useEffect(() => {
        setProgress(0);
        startTimeRef.current = null;
        if (requestRef.current !== null) {
            cancelAnimationFrame(requestRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [data, animate]);

    return progress;
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

    for (let i = 0; i < left.length; i += 1) {
        const l = left[i];
        const r = right[i];
        if (l.length !== r.length) return false;

        for (let j = 0; j < l.length; j += 1) {
            if ((l as (number | null)[])[j] !== (r as (number | null)[])[j]) return false;
        }
    }

    return true;
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
    formatter: (value: number) => string,
    maxTickCount = DEFAULT_BAR_Y_AXIS_MAX_TICK_COUNT
): (number | null)[] => {
    const finiteSplits = splits.filter((value) => Number.isFinite(value));
    const limitedSplits = (() => {
        if (finiteSplits.length <= maxTickCount || maxTickCount < 2) return finiteSplits;

        const baseStep = finiteSplits.reduce<number>((acc, value, index, arr) => {
            if (index === 0) return acc;

            const diff = Math.abs(value - arr[index - 1]);
            if (diff <= Number.EPSILON) return acc;
            return acc === 0 ? diff : Math.min(acc, diff);
        }, 0);

        if (baseStep <= 0) return finiteSplits;

        const stride = Math.max(1, Math.ceil((finiteSplits.length - 1) / Math.max(maxTickCount - 1, 1)));
        const step = baseStep * stride;
        const min = finiteSplits[0];
        const max = finiteSplits[finiteSplits.length - 1];
        const epsilon = step / 1000;
        const next: number[] = [];

        if (min < 0 && max > 0) {
            for (let value = 0; value <= max + epsilon; value += step) {
                next.push(Number(value.toFixed(10)));
            }

            for (let value = -step; value >= min - epsilon; value -= step) {
                next.unshift(Number(value.toFixed(10)));
            }

            return next;
        }

        const start = Math.ceil(min / step) * step;
        for (let value = start; value <= max + epsilon; value += step) {
            next.push(Number(value.toFixed(10)));
        }

        return next.length > 0 ? next : finiteSplits;
    })();
    const allowedSplitKeys = new Set(limitedSplits.map((value) => value.toFixed(10)));
    let previousLabel: string | null = null;

    return splits.map((value) => {
        if (!allowedSplitKeys.has(Number(value).toFixed(10))) {
            return null;
        }

        const nextLabel = formatter(Number(value));

        if (nextLabel === previousLabel) {
            return null;
        }

        previousLabel = nextLabel;
        return value;
    });
};

const getSeriesOrder = (series: { order?: number; label?: string }) =>
    series.order ?? Number.MAX_SAFE_INTEGER;

const renderTooltipMarker = (
    markerKind: AnalyticsChartMarkerKind | undefined,
    color: string
) => {
    if (markerKind === 'playCircle') {
        return (
            <span style={statusIconStyle}>
                <HiOutlinePlayCircle size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'clipboard') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineClipboardDocumentList size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'magnifyingGlass') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineMagnifyingGlass size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'xCircle') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineXCircle size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'clock') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineClock size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'pauseCircle') {
        return (
            <span style={statusIconStyle}>
                <HiOutlinePauseCircle size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'warningTriangle') {
        return (
            <span style={statusIconStyle}>
                <HiOutlineExclamationTriangle size={16} color={color} />
            </span>
        );
    }

    if (markerKind === 'checkCircle') {
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

const DENSE_DASHBOARD_BAR_PERIOD_THRESHOLD = 28;

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
    const isDense = periodCount >= DENSE_DASHBOARD_BAR_PERIOD_THRESHOLD;

    if (groupCount > 1) {
        if (isDense) {
            return {
                categoryGap: isNarrow ? 8 : 10,
                barGap: isNarrow ? 3 : 4,
            };
        }

        return {
            categoryGap: isNarrow ? 12 : 18,
            barGap: isNarrow ? 4 : 6,
        };
    }

    if (isDense) {
        return {
            categoryGap: isNarrow ? 8 : 10,
            barGap: 0,
        };
    }

    return {
        categoryGap: isNarrow ? 14 : 24,
        barGap: 0,
    };
};

const getDashboardBarFillRatio = (periodCount: number, groupCount: number) => {
    if (groupCount === 1) {
        const calibratedFillRatio = SMALL_COUNT_DASHBOARD_BAR_FILL_RATIOS[periodCount - 1];

        if (calibratedFillRatio !== undefined) {
            return calibratedFillRatio;
        }
    }

    if (periodCount <= 1) return 0.92;
    if (periodCount <= 2) return 0.9;
    if (periodCount <= 4) return 0.86;
    if (periodCount <= 8) return 0.8;
    if (periodCount >= DENSE_DASHBOARD_BAR_PERIOD_THRESHOLD) {
        return groupCount > 1 ? 0.8 : 0.86;
    }
    return 0.72;
};

const getDashboardSingleBarMaxWidth = (periodCount: number, plotWidth: number) => {
    const calibratedWidthRatio = SMALL_COUNT_DASHBOARD_BAR_MAX_WIDTH_RATIOS[periodCount - 1];

    if (calibratedWidthRatio === undefined) {
        return undefined;
    }

    return Math.max(1, Math.round(plotWidth * calibratedWidthRatio));
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

const getStackedBarDomain = ({
    data,
    seriesMeta,
    integerOnly = false,
    percentScale = false,
}: {
    data: LineChartDatum[];
    seriesMeta: Array<{ key: string; stackId?: string }>;
    integerOnly?: boolean;
    percentScale?: boolean;
}): [number, number] | undefined => {
    if (data.length === 0 || seriesMeta.length === 0) {
        return undefined;
    }

    const stackIds = Array.from(
        new Set(seriesMeta.map((item) => item.stackId ?? '__single__'))
    );

    const { maxPositiveStack, maxNegativeStack, maxAbsStack } = data.reduce(
        (acc, datum) => {
            stackIds.forEach((stackId) => {
                const stackSeries = seriesMeta.filter(
                    (item) => (item.stackId ?? '__single__') === stackId
                );

                const totals = stackSeries.reduce(
                    (sum, item) => {
                        const value = Number(datum[item.key] ?? 0);

                        if (!Number.isFinite(value)) {
                            return sum;
                        }

                        if (value >= 0) {
                            sum.positive += value;
                        } else {
                            sum.negative += Math.abs(value);
                        }

                        return sum;
                    },
                    { positive: 0, negative: 0 }
                );

                acc.maxPositiveStack = Math.max(
                    acc.maxPositiveStack,
                    totals.positive
                );
                acc.maxNegativeStack = Math.max(
                    acc.maxNegativeStack,
                    totals.negative
                );
                acc.maxAbsStack = Math.max(
                    acc.maxAbsStack,
                    totals.positive,
                    totals.negative
                );
            });

            return acc;
        },
        { maxPositiveStack: 0, maxNegativeStack: 0, maxAbsStack: 0 }
    );

    if (percentScale) {
        const padded = Math.min(
            100,
            Math.max(10, Math.ceil((maxAbsStack * 1.1) / 10) * 10)
        );
        return [-padded, padded];
    }

    if (integerOnly) {
        const padded = Math.max(1, toTightCountDomainValue(maxAbsStack * 1.08));
        return [-padded, padded];
    }

    const positivePadded =
        maxPositiveStack > 0
            ? Math.max(1, toTightAmountDomainValue(maxPositiveStack * 1.02))
            : 0;
    const negativePadded =
        maxNegativeStack > 0
            ? Math.max(1, toTightAmountDomainValue(maxNegativeStack * 1.02))
            : 0;

    if (positivePadded === 0 && negativePadded === 0) return [-1, 1];
    if (negativePadded === 0) return [0, positivePadded];
    if (positivePadded === 0) return [-negativePadded, 0];
    return [-negativePadded, positivePadded];
};

const getPositiveBarDomain = (
    data: LineChartDatum[],
    seriesKeys: string[],
    stacked = false,
    tight = false
): [number, number] | undefined => {
    if (data.length === 0 || seriesKeys.length === 0) {
        return undefined;
    }

    const maxValue = data.reduce((acc, item) => {
        const nextValue = seriesKeys.reduce((seriesAcc, key) => {
            const value = Number(item[key] ?? 0);

            if (!Number.isFinite(value)) {
                return seriesAcc;
            }

            return stacked
                ? seriesAcc + Math.max(value, 0)
                : Math.max(seriesAcc, value);
        }, 0);

        return Math.max(acc, nextValue);
    }, 0);

    const padded = Math.max(
        1,
        tight
            ? toTightAmountDomainValue(maxValue * 1.2)
            : toNiceDomainValue(maxValue * 1.1)
    );

    return [0, padded];
};

const getTooltipCountValue = (
    seriesMeta: Pick<AnalyticsChartSeries, 'key' | 'countKey'>,
    payload?: LineChartDatum
): number | null => {
    if (!payload) return null;

    const countKey = (seriesMeta.countKey ?? `${seriesMeta.key}__count`).trim();
    if (!countKey) return null;

    const countValue = Number(payload[countKey] ?? Number.NaN);
    return Number.isFinite(countValue) ? countValue : null;
};

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

const getDrawnBarRectKey = (
    rect: Pick<DrawnBarRect, 'seriesKey' | 'stackId' | 'idx'>
) => `${rect.idx}__${rect.stackId ?? '__single__'}__${rect.seriesKey}`;

const interpolateNumber = (from: number, to: number, progress: number) =>
    from + (to - from) * progress;

const collapseDrawnBarRect = (
    rect: DrawnBarRect,
    zeroLine: number
): DrawnBarRect => ({
    ...rect,
    left: rect.left + rect.width / 2,
    top: zeroLine,
    width: 0,
    height: 0,
});

const interpolateDrawnBarRect = (
    from: DrawnBarRect,
    to: DrawnBarRect,
    progress: number
): DrawnBarRect => ({
    ...to,
    left: interpolateNumber(from.left, to.left, progress),
    top: interpolateNumber(from.top, to.top, progress),
    width: interpolateNumber(from.width, to.width, progress),
    height: interpolateNumber(from.height, to.height, progress),
});

const buildAnimatedBarRects = ({
    previousRects,
    nextRects,
    progress,
    zeroLine,
}: {
    previousRects: DrawnBarRect[];
    nextRects: DrawnBarRect[];
    progress: number;
    zeroLine: number;
}) => {
    if (progress >= 1 || previousRects.length === 0) {
        return nextRects;
    }

    const previousRectByKey = new Map(
        previousRects.map((item) => [getDrawnBarRectKey(item), item] as const)
    );
    const nextRectByKey = new Map(
        nextRects.map((item) => [getDrawnBarRectKey(item), item] as const)
    );
    const orderedKeys = [
        ...nextRects.map((item) => getDrawnBarRectKey(item)),
        ...previousRects
            .map((item) => getDrawnBarRectKey(item))
            .filter((key) => !nextRectByKey.has(key)),
    ];

    return orderedKeys.flatMap((key) => {
        const previousRect = previousRectByKey.get(key);
        const nextRect = nextRectByKey.get(key);

        if (previousRect && nextRect) {
            return [interpolateDrawnBarRect(previousRect, nextRect, progress)];
        }

        if (nextRect) {
            const collapsedRect = collapseDrawnBarRect(nextRect, zeroLine);
            return [interpolateDrawnBarRect(collapsedRect, nextRect, progress)];
        }

        if (previousRect) {
            const collapsedRect = collapseDrawnBarRect(previousRect, zeroLine);
            return [interpolateDrawnBarRect(previousRect, collapsedRect, progress)];
        }

        return [];
    });
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
    size,
    gap,
}: {
    labelsRef: React.MutableRefObject<string[]>;
    strideRef: React.MutableRefObject<number>;
    condensedRef: React.MutableRefObject<boolean>;
    axisLineColor: string;
    size: number;
    gap: number;
}): uPlot.Axis => ({
    side: 2,
    size,
    gap,
    stroke: '#6B7280',
    font: `11px ${FONT_FAMILY}`,
    splits: () => labelsRef.current.map((_, index) => index),
    values: () => buildCategoryLabels(labelsRef.current, strideRef.current, condensedRef.current),
    grid: { show: false },
    ticks: {
        show: false,
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
    maxTickCount = DEFAULT_BAR_Y_AXIS_MAX_TICK_COUNT,
}: {
    width: number;
    formatterRef: React.MutableRefObject<(value: number) => string>;
    showGrid: boolean;
    integerOnly?: boolean;
    maxTickCount?: number;
}): uPlot.Axis => ({
    side: 3,
    size: width,
    gap: 0,
    align: 1,
    alignTo: 2,
    stroke: '#6B7280',
    font: `11px ${FONT_FAMILY}`,
    incrs: integerOnly ? [...INTEGER_AXIS_INCREMENTS] : undefined,
    filter: (_self, splits) => dedupeAxisSplitsByFormatter(splits, formatterRef.current, maxTickCount),
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
    valueFormatter,
    avatarRenderer,
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
                        {renderChartAvatar({
                            avatarRenderer,
                            label: item.label,
                            profileSrc: item.profileSrc,
                            seed: item.avatarSeed ?? item.key,
                            avatarKind: item.avatarKind ?? 'user',
                            size: 20,
                            fontSize: 11,
                        })}
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {item.label}
                        </Text>
                        <Text size={13} weight={'semibold'}>
                            {valueFormatter(item.value)}
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
    countFormatter,
    showCountDivider = false,
}: BarTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const valueByKey = new Map<string, number>();
    const payloadByKey = new Map<string, TooltipPayloadItem>();

    payload.forEach((item: TooltipPayloadItem) => {
        const key = String(item.dataKey ?? '').trim();
        const value = Number(item.value);
        if (key.length > 0 && Number.isFinite(value)) {
            valueByKey.set(key, value);
            payloadByKey.set(key, item);
        }
    });

    const sortedItems = seriesMeta
        .map((item) => ({
            ...item,
            value: valueByKey.get(item.key) ?? 0,
            count: getTooltipCountValue(
                item,
                payloadByKey.get(item.key)?.payload as LineChartDatum | undefined
            ),
        }))
        .filter((item) => Math.abs(item.value) > 0)
        .sort(
            (a, b) =>
                getSeriesOrder(a) - getSeriesOrder(b) ||
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
                        {renderTooltipMarker(item.markerKind, item.color)}
                        <Text
                            size={13}
                            style={{ minWidth: 0, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                            {item.tooltipLabel ?? item.label}
                        </Text>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Text size={13} weight={'semibold'}>
                                {valueFormatter(Math.abs(item.value))}
                            </Text>
                            {typeof item.count === 'number' ? (
                                <>
                                    {showCountDivider ? (
                                        <Text size={12} tone="muted">
                                            |
                                        </Text>
                                    ) : null}
                                    <Text size={12} tone="muted">
                                        {countFormatter(item.count)}
                                    </Text>
                                </>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NoDataTooltipContent = ({
    label,
    description,
}: {
    label?: string | number;
    description: string;
}) => (
    <div style={tooltipStyle}>
        {label ? (
            <Text size={13}>
                {label}
            </Text>
        ) : null}
        <Text size={13} tone="muted">
            {description}
        </Text>
    </div>
);

const GroupedStackTooltipContent = ({
    active,
    payload,
    label,
    seriesMeta,
    valueFormatter,
    countFormatter,
    showCountDivider = false,
}: GroupedStackTooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const activeSeriesKey = payload
        .map((item) => String(item.dataKey ?? '').trim())
        .find((item) =>
            seriesMeta.some((seriesItem) => seriesItem.key === item && seriesItem.stackId)
        );
    const activeSeries = seriesMeta.find((item) => item.key === activeSeriesKey);
    if (!activeSeries?.stackId) return null;

    const activeDatum = payload.find((item) => String(item.dataKey ?? '').trim() === activeSeriesKey)?.payload;
    if (!activeDatum) return null;

    const marketerSeriesItems = seriesMeta
        .filter((item) => item.stackId === activeSeries.stackId)
        .map((item) => ({
            ...item,
            value: Number(activeDatum[item.key] ?? 0),
            count: getTooltipCountValue(item, activeDatum as LineChartDatum),
        }))
        .filter((item) => Number.isFinite(item.value) && Math.abs(item.value) > 0)
        .sort(
            (a, b) =>
                getSeriesOrder(a) - getSeriesOrder(b) ||
                Math.abs(b.value) - Math.abs(a.value) ||
                (a.tooltipLabel ?? a.label).localeCompare(
                    b.tooltipLabel ?? b.label,
                    'ko-KR'
                )
        );

    if (marketerSeriesItems.length === 0) return null;

    const marketerName = marketerSeriesItems[0]?.tooltipGroupLabel ?? '';

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
                        {renderTooltipMarker(item.markerKind, item.color)}
                        <Text
                            size={13}
                            style={{ minWidth: 0, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                            {item.tooltipLabel ?? item.label}
                        </Text>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Text size={13} weight={'semibold'}>
                                {valueFormatter(Math.abs(item.value))}
                            </Text>
                            {typeof item.count === 'number' ? (
                                <>
                                    {showCountDivider ? (
                                        <Text size={12} tone="muted">
                                            |
                                        </Text>
                                    ) : null}
                                    <Text size={12} tone="muted">
                                        {countFormatter(item.count)}
                                    </Text>
                                </>
                            ) : null}
                        </div>
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
    valueFormatter,
    avatarRenderer,
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
                        {renderChartAvatar({
                            avatarRenderer,
                            label: item.label,
                            profileSrc: item.profileSrc,
                            seed: item.avatarSeed ?? item.key,
                            avatarKind: item.avatarKind ?? 'user',
                            size: 20,
                            fontSize: 11,
                        })}
                        <Text size={13} style={{ minWidth: 0, wordBreak: 'break-word' }}>
                            {`${item.label} · ${Math.round(item.ratio)}%`}
                        </Text>
                        <Text size={13} weight={'semibold'}>
                            {valueFormatter(item.raw)}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
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

const buildBarGeometry = ({
    chart,
    data,
    seriesMeta,
    isGroupedAmountBar,
    isGroupedStackBar,
    dashboardCategoryGap,
    dashboardBarGap,
    isDashboardMetricPreset,
    barPresentation,
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
        tooltipGroupLabel?: string;
        order?: number;
    }>;
    isGroupedAmountBar: boolean;
    isGroupedStackBar: boolean;
    dashboardCategoryGap: number;
    dashboardBarGap?: number;
    isDashboardMetricPreset: boolean;
    barPresentation: AnalyticsChartBarPresentation;
    dashboardBarMaxWidth?: number;
}): { rects: DrawnBarRect[]; avatars: AvatarAnchor[] } => {
    const frame = getPlotFrame(chart);
    if (!frame || data.length === 0) return { rects: [], avatars: [] };

    const plotWidth = frame.width;
    const categoryWidth = plotWidth / data.length;
    const gapPx = isDashboardMetricPreset ? dashboardCategoryGap : 30;
    const intraGapPx = dashboardBarGap ?? 0;
    const stackIds = isGroupedStackBar
        ? Array.from(new Set(seriesMeta.map((item) => item.stackId ?? item.key)))
        : isGroupedAmountBar
        ? seriesMeta.map((item) => item.key)
        : ['__single__'];

    const groupCount = Math.max(stackIds.length, 1);
    const fillRatio = isDashboardMetricPreset ? getDashboardBarFillRatio(data.length, groupCount) : 1;
    const totalCategoryGapWidth = gapPx * Math.max(data.length - 1, 0);
    const countAwareCategoryWidth = Math.max(plotWidth - totalCategoryGapWidth, 0) / Math.max(data.length, 1);
    const clusterWidth = Math.max(categoryWidth - gapPx, Math.min(categoryWidth * 0.92, categoryWidth));
    const rawGroupWidth =
        groupCount > 1 ? (clusterWidth - intraGapPx * (groupCount - 1)) / groupCount : clusterWidth;
    const fixedBarWidth =
        !isDashboardMetricPreset && barPresentation === 'single' ? 42 : undefined;
    const countAwareGroupWidth = Math.max(
        1,
        Math.floor(
            (countAwareCategoryWidth * fillRatio - intraGapPx * Math.max(groupCount - 1, 0)) /
                Math.max(groupCount, 1)
        )
    );
    const calibratedDashboardBarMaxWidth =
        isDashboardMetricPreset && groupCount === 1
            ? getDashboardSingleBarMaxWidth(data.length, plotWidth)
            : undefined;
    const resolvedDashboardBarMaxWidth =
        calibratedDashboardBarMaxWidth ??
        dashboardBarMaxWidth ??
        DEFAULT_DASHBOARD_BAR_WIDTH;
    const dashboardBarWidth = isDashboardMetricPreset
        ? Math.min(resolvedDashboardBarMaxWidth, countAwareGroupWidth)
        : undefined;
    const groupWidth = fixedBarWidth
        ? Math.min(rawGroupWidth, fixedBarWidth)
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

        acc[stackId] = [...stackSeries].sort(
            (left, right) =>
                getSeriesOrder(left) - getSeriesOrder(right) ||
                left.label.localeCompare(right.label, 'ko-KR')
        );
        return acc;
    }, {});

    data.forEach((datum, idx) => {
        const centerX = frame.left + chart.valToPos(idx, 'x');
        const clusterLeft = centerX - clusterVisibleWidth / 2;

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
                stackTop = stackTop === null ? nextRect.top : Math.min(stackTop, nextRect.top);
            });

            if (stackTop !== null) {
                const avatarSeries = stackSeries.find((item) => (item.stackId ?? item.key) === stackId);
                if (avatarSeries) {
                    const avatarLabel =
                        avatarSeries.tooltipGroupLabel ??
                        avatarSeries.avatarName ??
                        avatarSeries.label;
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

const UplotBarChart = ({
    size,
    labels,
    barData,
    barSeries,
    tooltipSeriesMeta,
    shouldShowGroupedAmountAvatars,
    shouldShowGroupedStackAvatars,
    isDashboardMetricPreset,
    barPresentation,
    tooltipMode,
    dashboardBarMaxWidth,
    barYAxisWidth,
    barYAxisIntegerOnly,
    metricBarDomain,
    barTickFormatter,
    barTooltipValueFormatter,
    countFormatter,
    tooltipCountDivider,
    noDataLabel,
    dashboardBarCategoryGap,
    dashboardBarGap,
    dashboardBarXAxisLabelStride,
    groupedStackSeries,
    avatarRenderer,
    onBarClick,
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
        tooltipGroupLabel?: string;
        order?: number;
    }>;
    tooltipSeriesMeta: LineSeriesMeta[];
    shouldShowGroupedAmountAvatars: boolean;
    shouldShowGroupedStackAvatars: boolean;
    isDashboardMetricPreset: boolean;
    barPresentation: AnalyticsChartBarPresentation;
    tooltipMode: AnalyticsChartTooltipMode;
    barYAxisWidth: number;
    barYAxisIntegerOnly?: boolean;
    metricBarDomain?: [number, number];
    barTickFormatter: (value: number) => string;
    barTooltipValueFormatter: (value: number) => string;
    countFormatter: (value: number) => string;
    tooltipCountDivider?: boolean;
    noDataLabel: string;
    dashboardBarCategoryGap: number;
    dashboardBarGap?: number;
    dashboardBarMaxWidth?: number;
    dashboardBarXAxisLabelStride: number;
    groupedStackSeries: AnalyticsChartSeries[];
    avatarRenderer?: AnalyticsChartAvatarRenderer;
    onBarClick?: (payload: AnalyticsChartBarClickPayload) => void;
}) => {
    const [chart, setChart] = useState<uPlot | null>(null);
    const [avatarAnchors, setAvatarAnchors] = useState<AvatarAnchor[]>([]);
    const previousBarRectsRef = useRef<DrawnBarRect[]>([]);
    const targetBarRectsRef = useRef<DrawnBarRect[]>([]);
    const renderedBarRectsRef = useRef<DrawnBarRect[]>([]);
    const isGroupedStackBar = barPresentation === 'groupedStack';
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
    const barPresentationRef = useLatestRef(barPresentation);
    const dashboardPresetRef = useLatestRef(isDashboardMetricPreset);
    const dashboardBarMaxWidthRef = useLatestRef(dashboardBarMaxWidth);
    const barTickFormatterRef = useLatestRef(barTickFormatter);
    const onBarClickRef = useLatestRef(onBarClick);

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

    const animationProgress = useChartAnimation(alignedData);

    const syncBarGeometry = useCallback((nextRects: DrawnBarRect[], nextAvatars: AvatarAnchor[]) => {
        if (!areDrawnBarRectsEqual(targetBarRectsRef.current, nextRects)) {
            previousBarRectsRef.current =
                renderedBarRectsRef.current.length > 0
                    ? renderedBarRectsRef.current
                    : targetBarRectsRef.current;
            targetBarRectsRef.current = nextRects;
        }
        setAvatarAnchors((prev) => (areAvatarAnchorsEqual(prev, nextAvatars) ? prev : nextAvatars));
    }, []);
    const xAxis = useMemo(
        () =>
            buildNumericXAxis({
                labelsRef,
                strideRef,
                condensedRef,
                axisLineColor: isDashboardMetricPreset ? 'transparent' : '#E5E7EB',
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
                integerOnly: Boolean(barYAxisIntegerOnly),
                maxTickCount: isDashboardMetricPreset
                    ? DASHBOARD_BAR_Y_AXIS_MAX_TICK_COUNT
                    : DEFAULT_BAR_Y_AXIS_MAX_TICK_COUNT,
            }),
        [
            barTickFormatterRef,
            barYAxisIntegerOnly,
            barYAxisWidth,
            isDashboardMetricPreset,
        ]
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
                                const hovered = renderedBarRectsRef.current.find(
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
                                isGroupedAmountBar: barPresentation === 'grouped',
                                isGroupedStackBar: barPresentation === 'groupedStack',
                                dashboardCategoryGap: categoryGapRef.current,
                                dashboardBarGap: barGapRef.current,
                                isDashboardMetricPreset: dashboardPresetRef.current,
                                barPresentation: barPresentationRef.current,
                                dashboardBarMaxWidth: dashboardBarMaxWidthRef.current,
                            });

                            if (
                                !areDrawnBarRectsEqual(targetBarRectsRef.current, rects) ||
                                !areAvatarAnchorsEqual(avatarAnchors, avatars)
                            ) {
                                syncBarGeometry(rects, avatars);
                            }

                            const ctx = instance.ctx;
                            const pxRatio = uPlot.pxRatio || 1;
                            const zeroLine = frame.top + instance.valToPos(0, 'y');
                            const animatedRects = buildAnimatedBarRects({
                                previousRects: previousBarRectsRef.current,
                                nextRects: rects,
                                progress: animationProgress,
                                zeroLine,
                            });

                            renderedBarRectsRef.current = animatedRects;

                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(frame.left * pxRatio, frame.top * pxRatio, frame.width * pxRatio, frame.height * pxRatio);
                            ctx.clip();

                            animatedRects.forEach((rect) => {
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
            barPresentationRef,
            barSeriesRef,
            categoryGapRef,
            dashboardBarMaxWidthRef,
            dashboardPresetRef,
            barPresentation,
            isGroupedStackBar,
            avatarAnchors,
            syncBarGeometry,
            animationProgress,
        ]
    );

    useEffect(() => {
        if (!chart || !onBarClick) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            const rootRect = chart.root.getBoundingClientRect();
            const clickLeft = event.clientX - rootRect.left;
            const clickTop = event.clientY - rootRect.top;
            const hoveredRect = renderedBarRectsRef.current.find(
                (rect) =>
                    clickLeft >= rect.left &&
                    clickLeft <= rect.left + rect.width &&
                    clickTop >= rect.top &&
                    clickTop <= rect.top + rect.height
            );

            if (!hoveredRect) {
                return;
            }

            const datum = barDataRef.current[hoveredRect.idx];
            if (!datum) {
                return;
            }

            onBarClickRef.current?.({
                index: hoveredRect.idx,
                periodLabel: String(datum.periodLabel ?? ''),
                datum,
                seriesKey: hoveredRect.seriesKey,
                stackId: hoveredRect.stackId,
            });
        };

        chart.root.addEventListener('click', handleClick);
        return () => {
            chart.root.removeEventListener('click', handleClick);
        };
    }, [barDataRef, chart, onBarClick, onBarClickRef]);

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
                                transition:
                                    `left ${BAR_GEOMETRY_ANIMATION_DURATION_MS}ms ${BAR_GEOMETRY_ANIMATION_CSS_EASING}, ` +
                                    `top ${BAR_GEOMETRY_ANIMATION_DURATION_MS}ms ${BAR_GEOMETRY_ANIMATION_CSS_EASING}`,
                            }}
                        >
                            {renderChartAvatar({
                                avatarRenderer,
                                label: item.label,
                                profileSrc: item.profileSrc,
                                seed: item.avatarSeed ?? item.label,
                                avatarKind: item.avatarKind ?? 'user',
                                size: GROUPED_STACK_AVATAR_SIZE,
                                fontSize: 11,
                            })}
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
                    tooltipSeriesMeta={tooltipSeriesMeta}
                    groupedStackSeries={groupedStackSeries}
                    tooltipMode={tooltipMode}
                    barTooltipValueFormatter={barTooltipValueFormatter}
                    countFormatter={countFormatter}
                    tooltipCountDivider={tooltipCountDivider}
                    noDataLabel={noDataLabel}
                    barRectsRef={renderedBarRectsRef}
                    avatarRenderer={avatarRenderer}
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
    tooltipSeriesMeta,
    groupedStackSeries,
    tooltipMode,
    barTooltipValueFormatter,
    countFormatter,
    tooltipCountDivider,
    noDataLabel,
    barRectsRef,
    avatarRenderer,
}: {
    chart: uPlot | null;
    cursorStore: LocalStore<CursorState>;
    size: ChartAreaSize;
    labels: string[];
    barData: LineChartDatum[];
    barSeries: AnalyticsChartSeries[];
    tooltipSeriesMeta: LineSeriesMeta[];
    groupedStackSeries: AnalyticsChartSeries[];
    tooltipMode: AnalyticsChartTooltipMode;
    barTooltipValueFormatter: (value: number) => string;
    countFormatter: (value: number) => string;
    tooltipCountDivider?: boolean;
    noDataLabel: string;
    barRectsRef: React.RefObject<DrawnBarRect[]>;
    avatarRenderer?: AnalyticsChartAvatarRenderer;
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

        if (tooltipMode !== 'groupedStack') {
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
            .sort(
                (left, right) =>
                    getSeriesOrder(left) - getSeriesOrder(right) ||
                    left.label.localeCompare(right.label, 'ko-KR')
            );

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
    }, [barData, barRectsRef, barSeries, cursorState.activeSeriesKey, cursorState.idx, groupedStackSeries, tooltipMode]);

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
            {tooltipMode === 'amountShare' ? (
                <AmountShareTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={tooltipSeriesMeta}
                    valueFormatter={barTooltipValueFormatter}
                    avatarRenderer={avatarRenderer}
                />
            ) : isMissingPeriod ? (
                <NoDataTooltipContent
                    label={labels[cursorState.idx] ?? ''}
                    description={noDataLabel}
                />
            ) : tooltipMode === 'lineSeries' ? (
                <LineTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={tooltipSeriesMeta}
                    valueFormatter={barTooltipValueFormatter}
                    avatarRenderer={avatarRenderer}
                />
            ) : tooltipMode === 'groupedStack' ? (
                <GroupedStackTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={groupedStackSeries}
                    valueFormatter={barTooltipValueFormatter}
                    countFormatter={countFormatter}
                    showCountDivider={tooltipCountDivider}
                />
            ) : (
                <BarTooltipContent
                    active
                    payload={activeTooltipPayload}
                    label={labels[cursorState.idx] ?? ''}
                    seriesMeta={barSeries}
                    valueFormatter={barTooltipValueFormatter}
                    countFormatter={countFormatter}
                    showCountDivider={tooltipCountDivider}
                />
            )}
        </div>
    );
});

UplotBarTooltipOverlay.displayName = 'UplotBarTooltipOverlay';

const AnalyticsChart = ({
    barChart,
    avatarRenderer,
    preset,
    isLoading = false,
    title = '운영 내역',
    showTitle = true,
    showLegend = true,
    onBarClick,
}: AnalyticsChartProps) => {
    const [chartAreaElement, setChartAreaElement] = useState<HTMLDivElement | null>(null);
    const chartAreaSize = useElementSize(chartAreaElement);
    const barSeries = useMemo(() => barChart.series ?? [], [barChart.series]);
    const barData = useMemo(() => barChart.data ?? [], [barChart.data]);

    const resolvedPreset = useMemo<AnalyticsChartPreset>(
        () => preset ?? 'dashboardMetric',
        [preset]
    );

    const isDashboardMetricPreset = resolvedPreset === 'dashboardMetric';
    const barPresentation = useMemo<AnalyticsChartBarPresentation>(() => {
        if (barChart.presentation) return barChart.presentation;
        if (barSeries.some((item) => item.stackId)) return 'groupedStack';
        if (barSeries.length > 1) return 'grouped';
        return 'single';
    }, [barChart.presentation, barSeries]);
    const isGroupedAmountBar =
        barPresentation === 'grouped' &&
        barSeries.length > 0 &&
        barData.length > 0;
    const isGroupedStackBar =
        barPresentation === 'groupedStack' &&
        barSeries.length > 0 &&
        barData.length > 0;

    const hasAnyGroupedAmountValue = useMemo(
        () =>
            barData.some((datum) =>
                barSeries.some((seriesItem) => Math.abs(Number(datum[seriesItem.key] ?? 0)) > 0)
            ),
        [barData, barSeries]
    );
    const resolvedBarData = useMemo(
        () =>
            isGroupedAmountBar
                ? barData.map((datum) => ({
                      ...datum,
                      isMissingData: !hasAnyGroupedAmountValue,
                  }))
                : barData,
        [barData, hasAnyGroupedAmountValue, isGroupedAmountBar]
    );

    const groupedStackCount = useMemo(
        () => new Set(barSeries.map((item) => item.stackId).filter(Boolean)).size,
        [barSeries]
    );

    const dashboardBarGroupCount = isGroupedAmountBar
        ? Math.max(barSeries.length, 1)
        : isGroupedStackBar
          ? groupedStackCount
          : 1;

    const shouldShowGroupedStackAvatars =
        Boolean(barChart.showAvatars) &&
        isDashboardMetricPreset &&
        isGroupedStackBar &&
        groupedStackCount > 0 &&
        groupedStackCount <= 5;
    const shouldShowGroupedAmountAvatars =
        Boolean(barChart.showAvatars) &&
        isDashboardMetricPreset &&
        isGroupedAmountBar &&
        barSeries.length > 0 &&
        barSeries.length <= 5;
    const barTickFormatter =
        barChart.yAxisFormatter ?? formatNumericValue;
    const barTooltipValueFormatter =
        barChart.tooltipValueFormatter ?? barTickFormatter;
    const barCountFormatter = barChart.countFormatter ?? formatNumericValue;
    const barTooltipCountDivider = Boolean(barChart.tooltipCountDivider);
    const barYAxisWidth = barChart.yAxisWidth ?? (isDashboardMetricPreset ? 72 : 54);
    const barYAxisIntegerOnly = Boolean(barChart.yAxisIntegerOnly);
    const barTooltipMode =
        barChart.tooltipMode ??
        (isGroupedStackBar
            ? 'groupedStack'
            : isGroupedAmountBar
              ? isDashboardMetricPreset
                  ? 'amountShare'
                  : 'lineSeries'
              : 'barSeries');
    const noDataLabel = barChart.noDataLabel ?? '집계 데이터 없음';

    const barChartPadding = useMemo<[number, number, number, number]>(
        () =>
            isDashboardMetricPreset
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
        [
            barYAxisWidth,
            isDashboardMetricPreset,
            shouldShowGroupedAmountAvatars,
            shouldShowGroupedStackAvatars,
        ]
    );

    const barPlotWidth = useMemo(() => {
        if (chartAreaSize.width <= 0) return DEFAULT_BAR_PLOT_WIDTH;
        const [, rightPadding, , leftPadding] = barChartPadding;

        return Math.max(chartAreaSize.width - barYAxisWidth - leftPadding - rightPadding, MIN_BAR_PLOT_WIDTH);
    }, [barChartPadding, barYAxisWidth, chartAreaSize.width]);

    const dashboardBarLayout = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardBarLayout(
                      resolvedBarData.length,
                      barPlotWidth,
                      dashboardBarGroupCount
                  )
                : { categoryGap: 30, barGap: 0 },
        [
            dashboardBarGroupCount,
            barPlotWidth,
            isDashboardMetricPreset,
            resolvedBarData.length,
        ]
    );

    const dashboardBarXAxisLabelStride = useMemo(
        () =>
            isDashboardMetricPreset
                ? getDashboardXAxisLabelStride(resolvedBarData.length)
                : 1,
        [isDashboardMetricPreset, resolvedBarData.length]
    );
    const hasNegativeBarValue = useMemo(
        () =>
            resolvedBarData.some((datum) =>
                barSeries.some((item) => Number(datum[item.key] ?? 0) < 0)
            ),
        [barSeries, resolvedBarData]
    );

    const isAllBarPeriodsMissing =
        !isLoading &&
        resolvedBarData.length > 0 &&
        !isGroupedStackBar &&
        resolvedBarData.every((item) => item.isMissingData);

    const fallbackBarDomain = useMemo(() => {
        if (hasNegativeBarValue) {
            return getStackedBarDomain({
                data: resolvedBarData,
                seriesMeta: barSeries,
                integerOnly: barYAxisIntegerOnly,
            });
        }

        return getPositiveBarDomain(
            resolvedBarData,
            barSeries.map((item) => item.key),
            !isGroupedAmountBar,
            isDashboardMetricPreset
        );
    }, [
        barSeries,
        barYAxisIntegerOnly,
        hasNegativeBarValue,
        isDashboardMetricPreset,
        isGroupedAmountBar,
        resolvedBarData,
    ]);

    const metricBarDomain = isAllBarPeriodsMissing
        ? ([0, 1] as [number, number])
        : barChart.yAxisDomain ?? fallbackBarDomain;

    const legendSeries = useMemo(
        () => barChart.legendItems ?? barSeries,
        [barChart.legendItems, barSeries]
    );

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
                            <UplotBarChart
                                size={chartAreaSize}
                                labels={resolvedBarData.map((item) => String(item.periodLabel ?? ''))}
                                barData={resolvedBarData}
                                barSeries={barSeries}
                                tooltipSeriesMeta={barSeries}
                                shouldShowGroupedAmountAvatars={shouldShowGroupedAmountAvatars}
                                shouldShowGroupedStackAvatars={shouldShowGroupedStackAvatars}
                                isDashboardMetricPreset={isDashboardMetricPreset}
                                barPresentation={barPresentation}
                                tooltipMode={barTooltipMode}
                                barYAxisWidth={barYAxisWidth}
                                barYAxisIntegerOnly={barYAxisIntegerOnly}
                                metricBarDomain={metricBarDomain}
                                barTickFormatter={barTickFormatter}
                                barTooltipValueFormatter={barTooltipValueFormatter}
                                countFormatter={barCountFormatter}
                                tooltipCountDivider={barTooltipCountDivider}
                                noDataLabel={noDataLabel}
                                dashboardBarCategoryGap={dashboardBarLayout.categoryGap}
                                dashboardBarGap={dashboardBarLayout.barGap}
                                dashboardBarMaxWidth={barChart.dashboardBarMaxWidth}
                                dashboardBarXAxisLabelStride={dashboardBarXAxisLabelStride}
                                groupedStackSeries={barSeries}
                                avatarRenderer={avatarRenderer}
                                onBarClick={onBarClick}
                            />
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
