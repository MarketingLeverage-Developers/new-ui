import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import styles from './PillButton.module.scss';
import React, { type HTMLAttributes } from 'react';
import classNames from 'classnames';

type PillButtonProps = {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    gradient?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const PillButton = ({ padding, fontSize, width, height, gradient, ...props }: PillButtonProps) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };

    const pillButtonClassName = classNames(styles.PillButton, {
        [styles.Gradient]: gradient,
    });

    return <button {...props} className={pillButtonClassName} style={{ ...cssVariables }} />;
};

export default PillButton;
