// 셀 안에서 텍스트 정렬을 제어하는 래퍼
import React from 'react';
import styles from './Content.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type ContentProps = {
    children?: React.ReactNode;
    textAlign?: 'left' | 'center' | 'right';
} & React.HTMLAttributes<HTMLDivElement>;

export const Content = ({ textAlign = 'left', ...props }: ContentProps) => {
    const cssVaraibles: CSSVariables = {
        '--text-align': textAlign,
    };

    return <div {...props} className={styles.Content} style={{ ...cssVaraibles, ...props.style }} />;
};
