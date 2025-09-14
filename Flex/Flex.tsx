import React from 'react';
import classNames from 'classnames';
import styles from './Flex.module.scss';
import { toCssUnit } from '@/shared/utils';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { CSSLength } from '@/shared/types';
// 테스트2
export type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: string | number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    width?: string | number;
    maxWidth?: CSSLength;
    height?: string | number;
    padding?: PaddingSize | number;
    margin?: PaddingSize | number;
};

const Flex = ({
    children,
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    gap = 0,
    wrap = 'nowrap',
    maxWidth,
    width,
    height,
    style,
    className,
    padding,
    margin,
    ...props
}: FlexProps) => {
    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),
        '--max-width': toCssUnit(maxWidth),
    };

    return (
        <div {...props} className={classNames(styles.Flex, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default Flex;
