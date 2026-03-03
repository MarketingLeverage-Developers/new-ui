import React from 'react';
import classNames from 'classnames';
import styles from './CircleDot.module.scss';

import { toCssUnit } from '../../../../../shared/utils';
import type { CSSVariables } from '../../../../../shared/types/css/CSSVariables';
import type { HexColor } from '../../../../../shared/types/css/HexColor';
import type { ThemeColorVar } from '../../../../../shared/types/css/ThemeColorTokens';
import { getThemeColor } from '../../../../../shared/utils/css/getThemeColor';

export type CircleDotProps = React.HTMLAttributes<HTMLSpanElement> & {
    color?: HexColor | ThemeColorVar;
    size?: number | string;
};

const CircleDot = ({ color = getThemeColor('Black1'), size = 8, className, style, ...props }: CircleDotProps) => {
    const cssVariables: CSSVariables = {
        '--dot-color': color,
        '--dot-size': toCssUnit(size),
    };

    return <span {...props} className={classNames(styles.CircleDot, className)} style={{ ...cssVariables, ...style }} />;
};

export default CircleDot;
