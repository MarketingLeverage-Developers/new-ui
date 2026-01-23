import React, { forwardRef } from 'react';
import styles from './HoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

export type HoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    width?: string | number;
    padding?: PaddingSize | number;
};

const HoverButton = forwardRef<HTMLButtonElement, HoverButtonProps>(
    ({ width, padding, style, className, children, ...props }, ref) => {
        const cssVariables: CSSVariables = {
            '--width': toCssUnit(width),
            '--padding': toCssPadding(padding),
        };

        return (
            <button
                ref={ref}
                className={className ? `${styles.HoverButton} ${className}` : styles.HoverButton}
                style={{ ...cssVariables, ...style }}
                {...props}
            >
                <span>{children}</span>
            </button>
        );
    }
);

HoverButton.displayName = 'HoverButton';

export default HoverButton;
