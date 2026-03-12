import React from 'react';
import classNames from 'classnames';
import Box, { type BoxLength, type BoxProps } from '../Box/Box';
import styles from './Flex.module.scss';

const toCssLength = (value?: BoxLength) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type FlexProps = BoxProps & {
    direction?: React.CSSProperties['flexDirection'];
    align?: React.CSSProperties['alignItems'];
    justify?: React.CSSProperties['justifyContent'];
    wrap?: React.CSSProperties['flexWrap'];
    gap?: BoxLength;
    rowGap?: BoxLength;
    columnGap?: BoxLength;
    inline?: boolean;
};

type FlexCssVariables = React.CSSProperties & {
    '--granter-flex-display'?: string;
    '--granter-flex-direction'?: string;
    '--granter-flex-align'?: string;
    '--granter-flex-justify'?: string;
    '--granter-flex-wrap'?: string;
    '--granter-flex-gap'?: string;
    '--granter-flex-row-gap'?: string;
    '--granter-flex-column-gap'?: string;
};

const Flex = ({
    className,
    style,
    direction = 'row',
    align,
    justify,
    wrap,
    gap,
    rowGap,
    columnGap,
    inline = false,
    ...props
}: FlexProps) => {
    const flexCssVariables: FlexCssVariables = {
        '--granter-flex-display': inline ? 'inline-flex' : 'flex',
        '--granter-flex-direction': direction,
        '--granter-flex-align': align,
        '--granter-flex-justify': justify,
        '--granter-flex-wrap': wrap,
        '--granter-flex-gap': toCssLength(gap),
        '--granter-flex-row-gap': toCssLength(rowGap),
        '--granter-flex-column-gap': toCssLength(columnGap),
    };

    return <Box className={classNames(styles.Flex, className)} style={{ ...flexCssVariables, ...style }} {...props} />;
};

export default Flex;
