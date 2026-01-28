import React from 'react';
import ImageTagItem, { type ImageTagItemProps } from './components/ImageTagItem/ImageTagItem';
import ImageInfoItem, { type ImageInfoItemProps } from './components/ImageInfoItem/ImageInfoItem';

export type ItemVariant = 'image-tag' | 'image-info';

export type ItemProps =
    | ({ variant: 'image-tag' } & ImageTagItemProps)
    | ({ variant: 'image-info' } & ImageInfoItemProps);

const Item = (props: ItemProps) => {
    const { variant, ...rest } = props;

    if (variant === 'image-tag') return <ImageTagItem {...(rest as ImageTagItemProps)} />;
    if (variant === 'image-info') return <ImageInfoItem {...(rest as ImageInfoItemProps)} />;

    return null;
};

export default Item;
