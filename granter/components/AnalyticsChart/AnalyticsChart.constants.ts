export const ANALYTICS_CHART_PALETTE = {
    positive: '#109BE6',
    positiveSoft: '#6DCEF5',
    positiveDeep: '#0D82C4',
    negative: '#ED3C3C',
    negativeSoft: '#F78484',
    green: '#22A06B',
    teal: '#14B8A6',
    orange: '#F59E0B',
    violet: '#8B5CF6',
    slate: '#64748B',
    charcoal: '#475569',
} as const;

export const ANALYTICS_CHART_LINE_COLORS = [
    ANALYTICS_CHART_PALETTE.positive,
    ANALYTICS_CHART_PALETTE.positiveDeep,
    ANALYTICS_CHART_PALETTE.teal,
    '#6366F1',
    ANALYTICS_CHART_PALETTE.negative,
    ANALYTICS_CHART_PALETTE.orange,
    ANALYTICS_CHART_PALETTE.violet,
    ANALYTICS_CHART_PALETTE.slate,
] as const;
