import React from 'react';
import styles from './Label.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';

type LabelProps = {
    text: string;
    subText?: string;
    marginBottom?: CSSLength;
} & React.HTMLAttributes<HTMLDivElement>;

export const Label = ({ text, subText, marginBottom = 0, ...props }: LabelProps) => {
    const cssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
    };

    return (
        <div {...props} className={styles.Label} style={{ ...cssVariables }}>
            <div className={styles.TextWrapper}>
                <span className={styles.Text}>{text}</span>
                <span className={styles.SubText}>{subText}</span>
            </div>

            {props.children}
        </div>
    );
};
