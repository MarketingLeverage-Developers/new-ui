import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import styles from './BaseButton.module.scss';
import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

export type BaseButtonSize = 'sm' | 'md' | 'lg';

export type BaseButtonProps = {
    size?: BaseButtonSize;
    fullWidth?: boolean;
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    textColor?: HexColor | ThemeColorVar;
    gradient?: boolean;
    primary?: boolean;
    radius?: CSSLength;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
    const {
        size = 'md',
        fullWidth,
        padding,
        fontSize,
        width,
        height,
        bgColor,
        textColor,
        radius,
        gradient,
        primary,
        className,
        ...buttonProps
    } = props;

    const cssVariables: CSSVariables = {
        '--width': width ? toCssUnit(width) : undefined,
        '--height': height ? toCssUnit(height) : undefined,
        '--padding': padding ? toCssPadding(padding) : undefined,
        '--font-size': fontSize ? toCssUnit(fontSize) : undefined,
        '--border-radius': radius ? toCssUnit(radius) : undefined,
        '--background-color': bgColor ?? undefined,
        '--color': textColor ?? undefined,
    };

    const buttonClassName = classNames(
        styles.BaseButton,
        {
            [styles.Sm]: size === 'sm',
            [styles.Md]: size === 'md',
            [styles.Lg]: size === 'lg',
            [styles.FullWidth]: fullWidth,
            [styles.Gradient]: gradient,
            [styles.Primary]: primary,
            [styles.Disabled]: buttonProps.disabled,
        },
        className
    );

    return (
        <button
            ref={ref}
            {...buttonProps}
            className={buttonClassName}
            style={{ ...cssVariables, ...buttonProps.style }}
        />
    );
});

BaseButton.displayName = 'BaseButton';

export default BaseButton;
