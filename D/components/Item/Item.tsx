import React from 'react';
import ImageTagItem, { type ImageTagItemProps } from './components/ImageTagItem/ImageTagItem';
import ImageInfoItem, { type ImageInfoItemProps } from './components/ImageInfoItem/ImageInfoItem';
import ImageMetricItem, { type ImageMetricItemProps } from './components/ImageMetricItem/ImageMetricItem';
import DepartmentCardItem, { type DepartmentCardItemProps } from './components/DepartmentCardItem/DepartmentCardItem';
import ContentCardItem, { type ContentCardItemProps } from './components/ContentCardItem/ContentCardItem';
import InflowMetricItem, { type InflowMetricItemProps } from './components/InflowMetricItem/InflowMetricItem';
import SummaryStatItem, { type SummaryStatItemProps } from './components/SummaryStatItem/SummaryStatItem';
import GranterHomeBanner, { type GranterHomeBannerProps } from './components/GranterHomeBanner/GranterHomeBanner';
import GranterHomeDashboardCard, {
    type GranterHomeDashboardCardProps,
} from './components/GranterHomeDashboardCard/GranterHomeDashboardCard';
import GranterHomeMetricOverview, {
    type GranterHomeMetricOverviewProps,
} from './components/GranterHomeMetricOverview/GranterHomeMetricOverview';
import GranterHomeAssetMetricGrid, {
    type GranterHomeAssetMetricGridProps,
} from './components/GranterHomeAssetMetricGrid/GranterHomeAssetMetricGrid';
import GranterHomeTagGrid, { type GranterHomeTagGridProps } from './components/GranterHomeTagGrid/GranterHomeTagGrid';
import GranterHomePeopleGrid, {
    type GranterHomePeopleGridProps,
} from './components/GranterHomePeopleGrid/GranterHomePeopleGrid';
import GranterHomeAssetCardGrid, {
    type GranterHomeAssetCardGridProps,
} from './components/GranterHomeAssetCardGrid/GranterHomeAssetCardGrid';
import GranterHomePollBanner, {
    type GranterHomePollBannerProps,
} from './components/GranterHomePollBanner/GranterHomePollBanner';
import GranterPatternStepCard, {
    type GranterPatternStepCardProps,
} from './components/GranterPatternStepCard/GranterPatternStepCard';
import GranterPatternPreviewTable, {
    type GranterPatternPreviewTableProps,
} from './components/GranterPatternPreviewTable/GranterPatternPreviewTable';
import GranterPatternAssignmentSummary, {
    type GranterPatternAssignmentSummaryProps,
} from './components/GranterPatternAssignmentSummary/GranterPatternAssignmentSummary';
import GranterProfileCategoryGrid, {
    type GranterProfileCategoryGridProps,
} from './components/GranterProfileCategoryGrid/GranterProfileCategoryGrid';

export type ItemVariant =
    | 'image-tag'
    | 'image-info'
    | 'image-metric'
    | 'department'
    | 'content-card'
    | 'inflow-metric'
    | 'summary-stat'
    | 'granter-home-banner'
    | 'granter-home-dashboard-card'
    | 'granter-home-metric-overview'
    | 'granter-home-asset-metric-grid'
    | 'granter-home-tag-grid'
    | 'granter-home-people-grid'
    | 'granter-home-asset-card-grid'
    | 'granter-home-poll-banner'
    | 'granter-pattern-step-card'
    | 'granter-pattern-preview-table'
    | 'granter-pattern-assignment-summary'
    | 'granter-profile-category-grid';

export type ItemProps =
    | ({ variant: 'image-tag' } & ImageTagItemProps)
    | ({ variant: 'image-info' } & ImageInfoItemProps)
    | ({ variant: 'image-metric' } & ImageMetricItemProps)
    | ({ variant: 'department' } & DepartmentCardItemProps)
    | ({ variant: 'content-card' } & ContentCardItemProps)
    | ({ variant: 'inflow-metric' } & InflowMetricItemProps)
    | ({ variant: 'summary-stat' } & SummaryStatItemProps)
    | ({ variant: 'granter-home-banner' } & GranterHomeBannerProps)
    | ({ variant: 'granter-home-dashboard-card' } & GranterHomeDashboardCardProps)
    | ({ variant: 'granter-home-metric-overview' } & GranterHomeMetricOverviewProps)
    | ({ variant: 'granter-home-asset-metric-grid' } & GranterHomeAssetMetricGridProps)
    | ({ variant: 'granter-home-tag-grid' } & GranterHomeTagGridProps)
    | ({ variant: 'granter-home-people-grid' } & GranterHomePeopleGridProps)
    | ({ variant: 'granter-home-asset-card-grid' } & GranterHomeAssetCardGridProps)
    | ({ variant: 'granter-home-poll-banner' } & GranterHomePollBannerProps)
    | ({ variant: 'granter-pattern-step-card' } & GranterPatternStepCardProps)
    | ({ variant: 'granter-pattern-preview-table' } & GranterPatternPreviewTableProps)
    | ({ variant: 'granter-pattern-assignment-summary' } & GranterPatternAssignmentSummaryProps)
    | ({ variant: 'granter-profile-category-grid' } & GranterProfileCategoryGridProps);

const Item = (props: ItemProps) => {
    const { variant, ...rest } = props;

    switch (variant) {
        case 'image-tag':
            return <ImageTagItem {...(rest as ImageTagItemProps)} />;
        case 'image-info':
            return <ImageInfoItem {...(rest as ImageInfoItemProps)} />;
        case 'image-metric':
            return <ImageMetricItem {...(rest as ImageMetricItemProps)} />;
        case 'department':
            return <DepartmentCardItem {...(rest as DepartmentCardItemProps)} />;
        case 'content-card':
            return <ContentCardItem {...(rest as ContentCardItemProps)} />;
        case 'inflow-metric':
            return <InflowMetricItem {...(rest as InflowMetricItemProps)} />;
        case 'summary-stat':
            return <SummaryStatItem {...(rest as SummaryStatItemProps)} />;
        case 'granter-home-banner':
            return <GranterHomeBanner {...(rest as GranterHomeBannerProps)} />;
        case 'granter-home-dashboard-card':
            return <GranterHomeDashboardCard {...(rest as GranterHomeDashboardCardProps)} />;
        case 'granter-home-metric-overview':
            return <GranterHomeMetricOverview {...(rest as GranterHomeMetricOverviewProps)} />;
        case 'granter-home-asset-metric-grid':
            return <GranterHomeAssetMetricGrid {...(rest as GranterHomeAssetMetricGridProps)} />;
        case 'granter-home-tag-grid':
            return <GranterHomeTagGrid {...(rest as GranterHomeTagGridProps)} />;
        case 'granter-home-people-grid':
            return <GranterHomePeopleGrid {...(rest as GranterHomePeopleGridProps)} />;
        case 'granter-home-asset-card-grid':
            return <GranterHomeAssetCardGrid {...(rest as GranterHomeAssetCardGridProps)} />;
        case 'granter-home-poll-banner':
            return <GranterHomePollBanner {...(rest as GranterHomePollBannerProps)} />;
        case 'granter-pattern-step-card':
            return <GranterPatternStepCard {...(rest as GranterPatternStepCardProps)} />;
        case 'granter-pattern-preview-table':
            return <GranterPatternPreviewTable {...(rest as GranterPatternPreviewTableProps)} />;
        case 'granter-pattern-assignment-summary':
            return <GranterPatternAssignmentSummary {...(rest as GranterPatternAssignmentSummaryProps)} />;
        case 'granter-profile-category-grid':
            return <GranterProfileCategoryGrid {...(rest as GranterProfileCategoryGridProps)} />;
        default:
            return null;
    }
};

export default Item;
