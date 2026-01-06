import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import styles from './ChartDot.module.scss';
import React, { type HTMLAttributes } from 'react';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type ChartDotProps = HTMLAttributes<HTMLDivElement> & {
    bgColor: HexColor | ThemeColorVar;
    size?: string | number;
};

const ChartDot = ({ bgColor = getThemeColor('Black1'), size = 8, ...props }: ChartDotProps) => {
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
        '--width': toCssUnit(size),
        '--height': toCssUnit(size),
    };

    return <div className={styles.Dot} style={{ ...cssVariables, ...props.style }} />;
};

export default ChartDot;
