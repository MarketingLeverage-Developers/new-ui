// DetailsRow.tsx
import React from 'react';
import type { HiddenCell, RowType } from '../DetailsRows/DetailsRows';
import styles from './DetailsRow.module.scss';

type DetailsRowProps<T> = {
    hc: HiddenCell<T>;
    row: RowType<T>;
    ri: number;
    hi: number;
    isBaseWhite: boolean;
    style?: React.CSSProperties;
};

const DetailsRow = <T,>({ hc, row, ri, hi, isBaseWhite, style }: DetailsRowProps<T>) => {
    const itemBg = isBaseWhite
        ? hi % 2 === 0
            ? 'var(--White1)'
            : 'var(--Gray7)'
        : hi % 2 === 0
        ? 'var(--Gray7)'
        : 'var(--White1)';

    return (
        <div className={styles.DetailsRow} style={{ backgroundColor: itemBg, padding: '0', borderRadius: 6, ...style }}>
            <div className={styles.Label}>{hc.label}</div>
            <div className={styles.Render}>{hc.render(row.item, ri)}</div>
        </div>
    );
};

export default DetailsRow;
