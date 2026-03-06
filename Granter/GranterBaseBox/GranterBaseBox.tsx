import React from 'react';
import styles from './GranterBaseBox.module.scss';

import type { CSSVariables } from '../../shared/types/css/CSSVariables';
import type { PaddingSize } from '../../shared/types/css/PaddingSize';
import type { CSSLength } from '../../shared/types/css/CSSLength';
import { toCssPadding } from '../../shared/utils/css/toCssPadding';
import { toCssUnit } from '../../shared/utils/css/toCssUnit';

export type GranterBaseBoxDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type GranterBaseBoxAlign = 'stretch' | 'center' | 'start' | 'end' | 'baseline';
export type GranterBaseBoxJustify =
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
export type GranterBaseBoxWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type GranterBaseBoxProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    direction?: GranterBaseBoxDirection;
    align?: GranterBaseBoxAlign;
    justify?: GranterBaseBoxJustify;
    gap?: CSSLength;
    wrap?: GranterBaseBoxWrap;

    width?: CSSLength;
    maxWidth?: CSSLength;
    height?: CSSLength;

    padding?: PaddingSize | number;
    margin?: PaddingSize | number;

    flex?: CSSLength;
    minWidth?: CSSLength;
    minHeight?: CSSLength;

    background?: string;
    borderColor?: string;

    main?: boolean | CSSLength;
};

const GranterBaseBox = ({
    children,
    className,
    style,
    direction,
    align,
    justify,
    gap,
    wrap,
    width,
    maxWidth,
    height,
    padding,
    margin,
    flex,
    minWidth,
    minHeight,
    background,
    borderColor,
    main,
    ...rest
}: GranterBaseBoxProps) => {
    const mergedClassName = [styles.GranterBaseBox, className ?? ''].filter(Boolean).join(' ');
    const mainAsFlex = main === true ? 1 : main === false ? undefined : main;
    const resolvedFlex = flex ?? mainAsFlex;

    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': gap != null ? toCssUnit(gap) : undefined,

        '--width': width != null ? toCssUnit(width) : undefined,
        '--max-width': maxWidth != null ? toCssUnit(maxWidth) : undefined,
        '--height': height != null ? toCssUnit(height) : undefined,

        '--padding': padding != null ? toCssPadding(padding) : undefined,
        '--margin': margin != null ? toCssPadding(margin) : undefined,

        '--flex': resolvedFlex,
        '--min-width': minWidth != null ? toCssUnit(minWidth) : undefined,
        '--min-height': minHeight != null ? toCssUnit(minHeight) : undefined,

        '--bg': background,
        '--border-color': borderColor,
    };

    return (
        <div {...rest} className={mergedClassName} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default GranterBaseBox;
