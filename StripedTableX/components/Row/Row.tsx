// Row 높이 제어 + 스타일 적용 tr
import React from 'react';
import Table from '@/shared/headless/TableX/Table';
import styles from './Row.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';

export const Row = ({ height = 44, ...props }: React.ComponentProps<typeof Table.Row> & { height?: CSSLength }) => {
    const cssVariables: CSSVariables = {
        '--height': toCssUnit(height),
    };

    return <Table.Row {...props} className={styles.Row} style={{ ...cssVariables, ...props.style }} />;
};
