import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import styles from './Item.module.scss';
import React from 'react';
type ItemProps = {
    children: React.ReactNode;
    flex?: CSSLength;
    minWidth?: CSSLength;
};
const Item = ({ children, flex, minWidth }: ItemProps) => {
    const cssVariables: CSSVariables = {
        '--item-flex': flex,
        '--min-width': toCssUnit(minWidth),
    };
    return (
        <div className={styles.Item} style={{ ...cssVariables }}>
            {children}
        </div>
    );
};

export default Item;
