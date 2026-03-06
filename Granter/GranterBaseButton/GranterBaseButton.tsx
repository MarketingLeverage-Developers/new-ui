import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './GranterBaseButton.module.scss';

import type { CSSLength } from '../../shared/types/css/CSSLength';
import type { CSSVariables } from '../../shared/types/css/CSSVariables';
import type { PaddingSize } from '../../shared/types/css/PaddingSize';
import { toCssUnit } from '../../shared/utils/css/toCssUnit';
import { toCssPadding } from '../../shared/utils/css/toCssPadding';
import type { HexColor } from '../../shared/types/css/HexColor';
import type { ThemeColorVar } from '../../shared/types/css/ThemeColorTokens';

export type GranterBaseButtonProps = {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    textColor?: HexColor | ThemeColorVar;
    gradient?: boolean;
    radius?: CSSLength;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const GranterBaseButton = forwardRef<HTMLButtonElement, GranterBaseButtonProps>(
    ({ padding, fontSize, width, height, bgColor, textColor, radius, gradient, className, ...props }, ref) => {
        const cssVariables: CSSVariables = {
            '--font-size': fontSize != null ? toCssUnit(fontSize) : undefined,
            '--padding': padding != null ? toCssPadding(padding) : undefined,
            '--width': width != null ? toCssUnit(width) : undefined,
            '--height': height != null ? toCssUnit(height) : undefined,
            '--color': textColor,
            '--background-color': bgColor,
            '--border-radius': radius != null ? toCssUnit(radius) : undefined,
        };

        const buttonClassName = classNames(styles.BaseButton, className, {
            [styles.Gradient]: gradient,
            [styles.Disabled]: props.disabled,
        });

        return <button ref={ref} {...props} className={buttonClassName} style={{ ...cssVariables, ...props.style }} />;
    }
);

GranterBaseButton.displayName = 'GranterBaseButton';
export default GranterBaseButton;
