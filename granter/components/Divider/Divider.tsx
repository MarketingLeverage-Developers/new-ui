import React from 'react';
import classNames from 'classnames';
import Box, { type BoxLength, type BoxProps } from '../Box/Box';
import styles from './Divider.module.scss';

const toCssLength = (value?: BoxLength) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

type DividerCssVariables = React.CSSProperties & {
    '--granter-divider-thickness'?: string;
    '--granter-divider-color'?: string;
};

export type DividerProps = Omit<BoxProps, 'children'> & {
    orientation?: 'horizontal' | 'vertical';
    thickness?: BoxLength;
    color?: string;
};

const Divider = ({
    className,
    style,
    orientation = 'horizontal',
    thickness = 1,
    color,
    ...props
}: DividerProps) => {
    const dividerCssVariables: DividerCssVariables = {
        '--granter-divider-thickness': toCssLength(thickness),
        '--granter-divider-color': color,
    };

    return (
        <Box
            aria-hidden="true"
            className={classNames(styles.Divider, className)}
            style={{ ...dividerCssVariables, ...style }}
            data-orientation={orientation}
            {...props}
        />
    );
};

export default Divider;
