import Table from '@/shared/headless/Table/Table';
import React from 'react';
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
