import { memo } from 'react';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackProfileSrc } from '@/shared/utils/profile/getFallbackProfileSrc';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import toProfileShortName from '@/shared/utils/profile/toProfileShortName';
import AnalyticsChartUplot from './AnalyticsChartUplot';
import type {
    AnalyticsChartAvatarKind,
    AnalyticsChartAvatarRenderer,
    AnalyticsChartAvatarRendererParams,
    AnalyticsChartBarModel,
    AnalyticsChartBarClickPayload,
    AnalyticsChartBarPresentation,
    AnalyticsChartDatum,
    AnalyticsChartLegendItem,
    AnalyticsChartMarkerKind,
    AnalyticsChartPreset,
    AnalyticsChartProps,
    AnalyticsChartSeries,
    AnalyticsChartTooltipMode,
} from './AnalyticsChart.types';

const chartAvatarStyle: React.CSSProperties = {
    border: '1px solid var(--granter-gray-200)',
    boxSizing: 'border-box',
    backgroundColor: 'var(--granter-gray-50)',
};

const chartShortNameAvatarStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
};

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

const defaultAnalyticsChartAvatarRenderer: AnalyticsChartAvatarRenderer = ({
    label,
    profileSrc,
    seed,
    avatarKind = 'user',
    size,
    fontSize,
}: AnalyticsChartAvatarRendererParams) => {
    const useShortNameAvatar = avatarKind === 'user';

    return (
        <MemberProfileAvatar
            name={label}
            src={useShortNameAvatar ? undefined : resolveAvatarSrc(profileSrc, seed, avatarKind)}
            fallbackText={useShortNameAvatar ? toProfileShortName(label || seed) : undefined}
            size={size}
            fontSize={fontSize}
            style={useShortNameAvatar ? chartShortNameAvatarStyle : chartAvatarStyle}
        />
    );
};

const AnalyticsChart = memo((props: AnalyticsChartProps) => (
    <AnalyticsChartUplot
        {...props}
        avatarRenderer={props.avatarRenderer ?? defaultAnalyticsChartAvatarRenderer}
    />
));

AnalyticsChart.displayName = 'AnalyticsChart';

export default AnalyticsChart;
export type {
    AnalyticsChartAvatarKind,
    AnalyticsChartAvatarRenderer,
    AnalyticsChartAvatarRendererParams,
    AnalyticsChartBarModel,
    AnalyticsChartBarClickPayload,
    AnalyticsChartBarPresentation,
    AnalyticsChartDatum,
    AnalyticsChartLegendItem,
    AnalyticsChartMarkerKind,
    AnalyticsChartPreset,
    AnalyticsChartProps,
    AnalyticsChartSeries,
    AnalyticsChartTooltipMode,
};
