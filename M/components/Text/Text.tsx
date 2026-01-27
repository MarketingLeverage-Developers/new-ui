import React from 'react';
import classNames from 'classnames';
import type { CSSLength } from '@/shared/types';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { HexColor } from '@/shared/types/css/HexColor';
import { toCssUnit } from '@/shared/utils';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import styles from './Text.module.scss';

export type TextProps = React.HTMLAttributes<HTMLSpanElement> & {
    fontSize?: CSSLength;
    fontWeight?: CSSLength;
    textColor?: HexColor | ThemeColorVar;
    textAlign?: 'left' | 'center' | 'right';
    children: React.ReactNode;
};

const Text = ({ fontSize, fontWeight, textColor, textAlign, children, style, className, ...props }: TextProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--font-weight': fontWeight,
        '--text-color': textColor,
        '--text-align': textAlign,
    };

    return (
        <span {...props} className={classNames(styles.Text, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </span>
    );
};

export default Text;
