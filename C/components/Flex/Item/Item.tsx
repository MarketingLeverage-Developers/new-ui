import React from 'react';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import styles from './Item.module.scss';

type ItemProps = {
    children: React.ReactNode;
    flex?: CSSLength;
    minWidth?: CSSLength;

    // ✅ 외부에서 추가 style 받을 수 있게
    style?: React.CSSProperties;

    // (옵션) 필요하면 className도 같이 열어두기
    className?: string;
};

const Item = ({ children, flex, minWidth, style, className }: ItemProps) => {
    const cssVariables: CSSVariables = {
        '--item-flex': flex,
        '--min-width': toCssUnit(minWidth),
    };

    return (
        <div className={[styles.Item, className ?? ''].join(' ')} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default Item;
