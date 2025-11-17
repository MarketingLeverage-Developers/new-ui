// StripedTable용 td 셀 (스타일 추가)
import React from 'react';
import Table from '@/shared/headless/Table/Table';
import styles from './Cell.module.scss';

export const Cell = (props: React.ComponentProps<typeof Table.Cell>) => (
    <Table.Cell {...props} className={styles.Cell} />
);
