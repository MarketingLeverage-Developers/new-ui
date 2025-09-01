import Table from '@/shared/headless/Table/Table';
import React from 'react';
import styles from './Cell.module.scss';

export const Cell = (props: React.ComponentProps<typeof Table.Cell>) => (
    <Table.Cell {...props} className={styles.Cell} />
);
