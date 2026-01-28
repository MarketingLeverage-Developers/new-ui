import React from 'react';
import ImageTagItem, { type ImageTagItemProps } from './components/ImageTagItem/ImageTagItem';
import ImageInfoItem, { type ImageInfoItemProps } from './components/ImageInfoItem/ImageInfoItem';
import ImageMetricItem, { type ImageMetricItemProps } from './components/ImageMetricItem/ImageMetricItem';

export type ItemVariant = 'image-tag' | 'image-info' | 'image-metric';

export type ItemProps =
    | ({ variant: 'image-tag' } & ImageTagItemProps)
    | ({ variant: 'image-info' } & ImageInfoItemProps)
    | ({ variant: 'image-metric' } & ImageMetricItemProps);

const Item = (props: ItemProps) => {
    const { variant, ...rest } = props;

    if (variant === 'image-tag') return <ImageTagItem {...(rest as ImageTagItemProps)} />;
    if (variant === 'image-info') return <ImageInfoItem {...(rest as ImageInfoItemProps)} />;
    if (variant === 'image-metric') return <ImageMetricItem {...(rest as ImageMetricItemProps)} />;

    return null;
};

export default Item;
