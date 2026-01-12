import React, { type ButtonHTMLAttributes } from 'react';
import styles from './CancelButton.module.scss';
import { IoCloseSharp } from 'react-icons/io5';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSLength } from '@/shared/types';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type CancelButtonProps = {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    iconColor?: HexColor | ThemeColorVar;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CancelButton = ({
    bgColor,
    fontSize = 18,
    iconColor = getThemeColor('Gray2'),
    padding,
    height = 26,
    width = 26,
    ...props
}: CancelButtonProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--color': iconColor,
        '--background-color': bgColor,
    };
    return (
        <button className={styles.CancelButton} {...props} style={{ ...cssVariables, ...props.style }}>
            <IoCloseSharp />
        </button>
    );
};

export default CancelButton;
