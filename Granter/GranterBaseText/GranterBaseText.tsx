import React from 'react';
import styles from './GranterBaseText.module.scss';

import type { CSSLength } from '../../shared/types/css/CSSLength';
import type { ThemeColorVar } from '../../shared/types/css/ThemeColorTokens';
import type { HexColor } from '../../shared/types/css/HexColor';
import type { CSSVariables } from '../../shared/types/css/CSSVariables';
import { toCssUnit } from '../../shared/utils/css/toCssUnit';

export type GranterBaseTextProps = React.HTMLAttributes<HTMLSpanElement> & {
    fontSize?: CSSLength;
    fontWeight?: CSSLength;
    textColor?: HexColor | ThemeColorVar;
    textAlign?: 'left' | 'center' | 'right';
    children: React.ReactNode;
};

const GranterBaseText = ({
    fontSize,
    fontWeight,
    textColor,
    textAlign,
    children,
    style,
    className,
    ...props
}: GranterBaseTextProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--font-weight': fontWeight,
        '--text-color': textColor,
        '--text-align': textAlign,
    };

    const mergedClassName = [styles.Text, className ?? ''].filter(Boolean).join(' ');

    return (
        <span {...props} className={mergedClassName} style={{ ...cssVariables, ...style }}>
            {children}
        </span>
    );
};

export default GranterBaseText;
