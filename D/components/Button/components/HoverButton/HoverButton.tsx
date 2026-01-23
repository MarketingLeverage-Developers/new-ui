import React, { forwardRef } from 'react';
import styles from './HoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

export type HoverButtonTone = 'gray' | 'blue' | 'red' | 'green';

export type HoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    width?: string | number;
    padding?: PaddingSize | number;
    color?: HoverButtonTone;
};

const HoverButton = forwardRef<HTMLButtonElement, HoverButtonProps>(
    ({ width, padding, color = 'gray', style, className, children, ...props }, ref) => {
        const toneVars: Record<
            HoverButtonTone,
            { text: string; textHover: string; bg: string; hoverBg: string }
        > = {
            gray: {
                text: '#333333',
                textHover: '#ffffff',
                bg: '#f4f4f4',
                hoverBg: '#666666',
            },
            blue: {
                text: '#3b82f6',
                textHover: '#ffffff',
                bg: '#eff6ff',
                hoverBg: '#3b82f6',
            },
            red: {
                text: '#ef3636',
                textHover: '#ffffff',
                bg: '#ffedeb',
                hoverBg: '#ef3636',
            },
            green: {
                text: '#317b0f',
                textHover: '#ffffff',
                bg: '#e8fdde',
                hoverBg: '#317b0f',
            },
        };
        const { text, textHover, bg, hoverBg } = toneVars[color] ?? toneVars.gray;

        const cssVariables: CSSVariables = {
            '--width': toCssUnit(width),
            '--padding': toCssPadding(padding),
            '--text-color': text,
            '--text-hover-color': textHover,
            '--bg': bg,
            '--hover-bg': hoverBg,
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
