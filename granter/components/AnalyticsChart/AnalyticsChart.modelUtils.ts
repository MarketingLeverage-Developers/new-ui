import type {
    AnalyticsChartDatum,
    AnalyticsChartLegendItem,
    AnalyticsChartSeries,
} from './AnalyticsChart';

export type AnalyticsChartGroupedStackSeries = AnalyticsChartSeries & {
    stackId: string;
};

export type AnalyticsChartGroupedStackData = {
    data: AnalyticsChartDatum[];
    series: AnalyticsChartGroupedStackSeries[];
};

export const formatAnalyticsChartCompactAmount = (value: number) =>
    `${(value / 10000).toLocaleString('ko-KR')}만원`;

export const formatAnalyticsChartCurrency = (value: number) =>
    `${(value / 10000).toLocaleString('ko-KR')}만원`;

export const formatAnalyticsChartPercent = (value: number) =>
    `${value.toFixed(1)}%`;

export const formatAnalyticsChartCount = (value: number) =>
    `${value.toLocaleString('ko-KR')}개`;

export const toAnalyticsChartPositiveValue = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? Math.abs(numeric) : 0;
};

export const toAnalyticsChartNegativeValue = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? -Math.abs(numeric) : 0;
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

const resolveSeriesOrder = (series: AnalyticsChartSeries[]) =>
    [...series].sort(
        (left, right) =>
            (left.order ?? Number.MAX_SAFE_INTEGER) -
                (right.order ?? Number.MAX_SAFE_INTEGER) ||
            left.label.localeCompare(right.label, 'ko-KR')
    );

export const toAnalyticsChartLegendItems = (
    series: AnalyticsChartSeries[]
): AnalyticsChartLegendItem[] =>
    resolveSeriesOrder(series).map((item) => ({
        key: item.key,
        label: item.tooltipLabel ?? item.label,
        color: item.color,
    }));

export const toAnalyticsChartSeriesValue = (
    datum: AnalyticsChartDatum,
    key: string
) => {
    const value = Number(datum[key] ?? 0);
    return Number.isFinite(value) ? value : 0;
};

export const buildAnalyticsChartPositiveBarDomain = (
    data: AnalyticsChartDatum[],
    seriesKeys: string[],
    stacked = false,
    tight = false
): [number, number] => {
    const maxValue = data.reduce((acc, item) => {
        const nextValue = seriesKeys.reduce((seriesAcc, key) => {
            const value = toAnalyticsChartSeriesValue(item, key);

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

export const buildAnalyticsChartStackedDomain = ({
    data,
    series,
    integerOnly,
    percentScale,
}: {
    data: AnalyticsChartDatum[];
    series: AnalyticsChartSeries[];
    integerOnly?: boolean;
    percentScale?: boolean;
}): [number, number] => {
    const stackIds = Array.from(
        new Set(series.map((item) => item.stackId ?? '__single__'))
    );

    const { maxPositiveStack, maxNegativeStack, maxAbsStack } = data.reduce(
        (acc, datum) => {
            stackIds.forEach((stackId) => {
                const stackSeries = series.filter(
                    (item) => (item.stackId ?? '__single__') === stackId
                );

                const totals = stackSeries.reduce(
                    (sum, item) => {
                        const value = toAnalyticsChartSeriesValue(datum, item.key);

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
