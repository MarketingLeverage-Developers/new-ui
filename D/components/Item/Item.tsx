import React from 'react';
import ImageTagItem, { type ImageTagItemProps } from './components/ImageTagItem/ImageTagItem';

export type ItemVariant = 'image-tag';

export type ItemProps = { variant: 'image-tag' } & ImageTagItemProps;

const Item = (props: ItemProps) => {
    const { variant, ...rest } = props;

    if (variant === 'image-tag') return <ImageTagItem {...(rest as ImageTagItemProps)} />;

    return null;
};

export default Item;
