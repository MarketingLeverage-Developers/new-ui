import React from 'react';
import classNames from 'classnames';
import styles from './GridBox.module.scss';

import type { BoxCommonProps } from '../../Box';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import { toCssUnit } from '@/shared/utils';

export type GridBoxExtraProps = {
    cols?: number;
    gap?: number;
    rowGap?: number;
    colGap?: number;
};

type GridBoxProps = BoxCommonProps & GridBoxExtraProps;

const GridBox: React.FC<GridBoxProps> = (props) => {
    const {
        children,
        className,
        style,

        padding,
        margin,
        width,
        maxWidth,
        height,
        flex,
        minWidth,
        minHeight,

        cols = 12,
        gap = 12,
        rowGap,
        colGap,

        // ✅ 공통 props (DOM으로 내려가면 안 됨)
        direction,
        align,
        justify,
        wrap,

        ...rest
    } = props;

    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),

        '--width': toCssUnit(width),
        '--max-width': toCssUnit(maxWidth),
        '--height': toCssUnit(height),

        '--flex': flex,
        '--min-width': toCssUnit(minWidth),
        '--min-height': toCssUnit(minHeight),

        '--cols': cols,
        '--gap': toCssUnit(gap),
        ...(rowGap !== undefined ? { '--row-gap': toCssUnit(rowGap) } : {}),
        ...(colGap !== undefined ? { '--col-gap': toCssUnit(colGap) } : {}),
    };

    return (
        <div {...rest} className={classNames(styles.GridBox, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default GridBox;
