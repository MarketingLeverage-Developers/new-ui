import React, { type HTMLAttributes } from 'react';
import styles from './BaseChip.module.scss';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSLength } from '@/shared/types';
import type { HexColor } from '@/shared/types/css/HexColor';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

type BaseChipProps = HTMLAttributes<HTMLDivElement> & {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    textColor?: HexColor | ThemeColorVar;
    radius?: CSSLength;
    fontWeight?: number | string;
    children: React.ReactNode;
};

const BaseChip = ({
    padding,
    fontSize,
    width = 'fit-content',
    height,
    bgColor,
    textColor,
    radius,
    children,
    fontWeight,
    ...props
}: BaseChipProps) => {
    const computedFontWeight = typeof fontWeight === 'number' ? fontWeight : fontWeight ?? 400;

    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--color': textColor,
        '--background-color': bgColor,
        '--border-radius': toCssUnit(radius),
        '--text-font-weight': computedFontWeight,
    };

    return (
        <div {...props} className={styles.BaseChip} style={{ ...cssVariables, ...props.style }}>
            {children}
        </div>
    );
};

export default BaseChip;
