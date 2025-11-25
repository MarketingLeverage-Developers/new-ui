import React from 'react';
import styles from './Label.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';
import classNames from 'classnames';

type LabelProps = {
    type?: 'vertical' | 'horizontal';
    text: string;
    subText?: string;
    marginBottom?: CSSLength;
    gap?: CSSLength;
} & React.HTMLAttributes<HTMLDivElement>;

export const Label = ({ type = 'vertical', text, subText, marginBottom = 0, gap = 8, ...props }: LabelProps) => {
    const cssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
        '--gap': toCssUnit(gap),
    };

    const labelClassName = classNames(styles.Label, {
        [styles.Vertical]: type === 'vertical',
        [styles.Horizontal]: type === 'horizontal',
    });

    return (
        <div {...props} className={labelClassName} style={{ ...cssVariables }}>
            <div className={styles.TextWrapper}>
                <span className={styles.Text}>{text}</span>
                <span className={styles.SubText}>{subText}</span>
            </div>

            {props.children}
        </div>
    );
};
