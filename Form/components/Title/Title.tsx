import React from 'react';
import styles from './Title.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';

type TitleProps = {
    text: string;
    marginBottom?: CSSLength;
    fontSize?: CSSLength;
} & React.HTMLAttributes<HTMLDivElement>;

export const Title = ({ text, marginBottom, fontSize, ...props }: TitleProps) => {
    const cssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
        '--font-size': toCssUnit(fontSize),
    };

    return (
        <div {...props} className={styles.Title} style={{ ...cssVariables }}>
            <span>{text}</span>
        </div>
    );
};
