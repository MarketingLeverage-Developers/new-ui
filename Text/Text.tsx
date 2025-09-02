import React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';
import type { CSSLength } from '@/shared/types';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { HexColor } from '@/shared/types/css/HexColor';
import { toCssUnit } from '@/shared/utils';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

export type TextProps = React.HTMLAttributes<HTMLSpanElement> & {
    fontSize?: CSSLength;
    fontWeight?: CSSLength;
    textColor?: HexColor | ThemeColorVar;
    textAlign?: 'left' | 'center' | 'right';
    // oneLine?: boolean;
    children: React.ReactNode;
};

interface CSSPropertiesWithVars extends React.CSSProperties {
    [key: `--${string}`]: string | number;
}

const Text = ({
    fontSize,
    fontWeight,
    textColor,
    textAlign,
    // oneLine,
    children,
    style,
    className,
    ...props
}: TextProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--font-weight': fontWeight,
        '--text-color': textColor,
        '--text-align': textAlign,
    };

    // const oneLineStyles: React.CSSProperties = oneLine
    //     ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    //     : {};

    return (
        <span {...props} className={classNames(styles.text, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </span>
    );
};

export default Text;
