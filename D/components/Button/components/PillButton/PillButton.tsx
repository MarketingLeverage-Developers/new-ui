import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import styles from './PillButton.module.scss';
import React, { type HTMLAttributes } from 'react';
import classNames from 'classnames';

export type PillButtonProps = {
    padding?: PaddingSize;
    fontSize?: CSSLength;
    width?: CSSLength;
    height?: CSSLength;
    gradient?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(({ padding, fontSize, width, height, gradient, className, ...props }, ref) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };

    const pillButtonClassName = classNames(styles.PillButton, { [styles.Gradient]: gradient }, className);

    return <button ref={ref} {...props} className={pillButtonClassName} style={{ ...cssVariables, ...props.style }} />;
});

PillButton.displayName = 'PillButton';

export default PillButton;
