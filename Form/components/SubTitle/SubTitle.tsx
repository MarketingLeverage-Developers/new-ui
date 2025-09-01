import React from 'react';
import styles from './SubTitle.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';

type SubTitleProps = {
    text: string;
    marginBottom?: CSSLength;
} & React.HTMLAttributes<HTMLDivElement>;

export const SubTitle = ({ text, marginBottom = 24, ...props }: SubTitleProps) => {
    const cssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
    };

    return (
        <div {...props} className={styles.SubTitle} style={{ ...cssVariables }}>
            <span>{text}</span>
        </div>
    );
};
