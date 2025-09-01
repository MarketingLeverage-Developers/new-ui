import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import styles from './BaseButton.module.scss';
import { type ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

type BaseButtonProps = {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    textColor?: HexColor | ThemeColorVar;
    gradient?: boolean;
    radius?: CSSLength;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BaseButton = ({
    padding,
    fontSize,
    width,
    height,
    bgColor,
    textColor,
    radius,
    gradient,
    ...props
}: BaseButtonProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--color': textColor,
        '--background-color': bgColor,
        '--border-radius': toCssUnit(radius),
    };

    const buttonClassName = classNames(styles.BaseButton, {
        [styles.Gradient]: gradient,
        [styles.Disabled]: props.disabled,
    });

    return <button {...props} className={buttonClassName} style={{ ...cssVariables, ...props.style }} />;
};

export default BaseButton;
