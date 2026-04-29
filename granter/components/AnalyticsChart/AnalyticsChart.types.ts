import type { ReactNode } from 'react';

export type AnalyticsChartPreset = 'default' | 'dashboardMetric';
export type AnalyticsChartAvatarKind = 'company' | 'user';

export type AnalyticsChartMarkerKind =
    | 'dot'
    | 'playCircle'
    | 'clipboard'
    | 'magnifyingGlass'
    | 'xCircle'
    | 'clock'
    | 'pauseCircle'
    | 'warningTriangle'
    | 'checkCircle';

export type AnalyticsChartTooltipMode =
    | 'barSeries'
    | 'lineSeries'
    | 'groupedStack'
    | 'amountShare';

export type AnalyticsChartAvatarRendererParams = {
    label?: string | null;
    profileSrc?: string | null;
    seed?: string | null;
    avatarKind?: AnalyticsChartAvatarKind;
    size: number;
    fontSize: number;
};

export type AnalyticsChartAvatarRenderer = (
    params: AnalyticsChartAvatarRendererParams
) => ReactNode;

export type AnalyticsChartDatum = {
    periodLabel: string;
    isMissingData?: boolean;
} & Record<string, string | number | boolean | undefined>;

export type AnalyticsChartSeries = {
    key: string;
    label: string;
    color: string;
    order?: number;
    stackOrder?: number;
    stackId?: string;
    countKey?: string;
    markerKind?: AnalyticsChartMarkerKind;
    tooltipLabel?: string;
    tooltipGroupLabel?: string;
    profileSrc?: string;
    avatarSrc?: string;
    avatarName?: string;
    avatarKind?: AnalyticsChartAvatarKind;
    avatarSeed?: string;
};

export type AnalyticsChartLegendItem = {
    key: string;
    label: string;
    color: string;
};

export type AnalyticsChartHeaderMetaItem = {
    label: string;
    value: string;
    tone?: 'default' | 'positive' | 'negative';
    color?: string;
};

export type AnalyticsChartHeaderMeta = {
    title?: string;
    items: AnalyticsChartHeaderMetaItem[];
};

export type AnalyticsChartBarClickPayload = {
    index: number;
    periodLabel: string;
    datum: AnalyticsChartDatum;
    seriesKey?: string;
    stackId?: string;
};

export type AnalyticsChartBarPresentation = 'single' | 'grouped' | 'groupedStack';

export type AnalyticsChartBarModel = {
    data: AnalyticsChartDatum[];
    series: AnalyticsChartSeries[];
    presentation?: AnalyticsChartBarPresentation;
    showAvatars?: boolean;
    tooltipMode?: AnalyticsChartTooltipMode;
    tooltipCountDivider?: boolean;
    countFormatter?: (value: number) => string;
    yAxisWidth?: number;
    yAxisFormatter?: (value: number) => string;
    yAxisIntegerOnly?: boolean;
    yAxisDomain?: [number, number];
    tooltipValueFormatter?: (value: number) => string;
    noDataLabel?: string;
    dashboardBarMaxWidth?: number;
    legendItems?: AnalyticsChartLegendItem[];
};

export type AnalyticsChartProps = {
    barChart: AnalyticsChartBarModel;
    avatarRenderer?: AnalyticsChartAvatarRenderer;
    preset?: AnalyticsChartPreset;
    isLoading?: boolean;
    title?: string;
    showTitle?: boolean;
    showLegend?: boolean;
    headerMeta?: AnalyticsChartHeaderMeta | null;
    onBarClick?: (payload: AnalyticsChartBarClickPayload) => void;
};
