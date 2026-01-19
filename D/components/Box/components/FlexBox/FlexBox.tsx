import React from 'react';
import classNames from 'classnames';
import styles from './FlexBox.module.scss';

import { toCssUnit } from '@/shared/utils';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { CSSLength } from '@/shared/types';
import type { BoxCommonProps } from '../../Box';

export type FlexBoxExtraProps = {
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

    flex?: CSSLength;
    minWidth?: CSSLength;
    minHeight?: CSSLength;
};

type FlexBoxProps = BoxCommonProps & FlexBoxExtraProps;

const FlexBox: React.FC<FlexBoxProps> = (props) => {
    const {
        children,

        direction = 'row',
        align = 'stretch',
        justify = 'start',
        gap = 0,
        wrap = 'nowrap',

        width,
        maxWidth,
        height,
        padding,
        margin,

        flex,
        minWidth,
        minHeight,

        style,
        className,
        ...rest
    } = props;

    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),

        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--max-width': toCssUnit(maxWidth),

        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),

        '--flex': flex,
        '--min-width': toCssUnit(minWidth),
        '--min-height': toCssUnit(minHeight),
    };

    return (
        <div {...rest} className={classNames(styles.FlexBox, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default FlexBox;
