import React, { type HTMLAttributes } from 'react';
import styles from './Separator.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type SeparatorProps = {
    barColor?: HexColor | ThemeColorVar;
} & HTMLAttributes<HTMLDivElement>;

const Separator = ({ barColor = getThemeColor('Gray5'), ...props }: SeparatorProps) => {
    const cssVariables: CSSVariables = {
        '--bar-color': barColor,
    };
    return <div className={styles.Separator} style={{ ...cssVariables, ...props.style }}></div>;
};

export default Separator;
