import React from 'react';
import classNames from 'classnames';
import Box from '../Box/Box';
import styles from './PlaceholderBlock.module.scss';

export type PlaceholderBlockVariant = 'dashed' | 'solid';

export type PlaceholderBlockProps = {
    children: React.ReactNode;
    variant?: PlaceholderBlockVariant;
};

const variantClassName: Record<PlaceholderBlockVariant, string> = {
    dashed: styles.Dashed,
    solid: styles.Solid,
};

const PlaceholderBlock = ({ children, variant = 'dashed' }: PlaceholderBlockProps) => (
    <Box className={classNames(variantClassName[variant])}>{children}</Box>
);

export default PlaceholderBlock;
