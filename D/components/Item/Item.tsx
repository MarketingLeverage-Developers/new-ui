import React from 'react';
import ImageTagItem, { type ImageTagItemProps } from './components/ImageTagItem/ImageTagItem';
import ImageInfoItem, { type ImageInfoItemProps } from './components/ImageInfoItem/ImageInfoItem';
import ImageMetricItem, { type ImageMetricItemProps } from './components/ImageMetricItem/ImageMetricItem';
import DepartmentCardItem, { type DepartmentCardItemProps } from './components/DepartmentCardItem/DepartmentCardItem';
import ContentCardItem, { type ContentCardItemProps } from './components/ContentCardItem/ContentCardItem';
import InflowMetricItem, { type InflowMetricItemProps } from './components/InflowMetricItem/InflowMetricItem';
import SummaryStatItem, { type SummaryStatItemProps } from './components/SummaryStatItem/SummaryStatItem';

export type ItemVariant =
    | 'image-tag'
    | 'image-info'
    | 'image-metric'
    | 'department'
    | 'content-card'
    | 'inflow-metric'
    | 'summary-stat';

export type ItemProps =
    | ({ variant: 'image-tag' } & ImageTagItemProps)
    | ({ variant: 'image-info' } & ImageInfoItemProps)
    | ({ variant: 'image-metric' } & ImageMetricItemProps)
    | ({ variant: 'department' } & DepartmentCardItemProps)
    | ({ variant: 'content-card' } & ContentCardItemProps)
    | ({ variant: 'inflow-metric' } & InflowMetricItemProps)
    | ({ variant: 'summary-stat' } & SummaryStatItemProps);

const Item = (props: ItemProps) => {
    const { variant, ...rest } = props;

    if (variant === 'image-tag') return <ImageTagItem {...(rest as ImageTagItemProps)} />;
    if (variant === 'image-info') return <ImageInfoItem {...(rest as ImageInfoItemProps)} />;
    if (variant === 'image-metric') return <ImageMetricItem {...(rest as ImageMetricItemProps)} />;
    if (variant === 'department') return <DepartmentCardItem {...(rest as DepartmentCardItemProps)} />;
    if (variant === 'content-card') return <ContentCardItem {...(rest as ContentCardItemProps)} />;
    if (variant === 'inflow-metric') return <InflowMetricItem {...(rest as InflowMetricItemProps)} />;
    if (variant === 'summary-stat') return <SummaryStatItem {...(rest as SummaryStatItemProps)} />;

    return null;
};

export default Item;
