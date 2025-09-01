import Table from '@/shared/headless/Table/Table';
import React from 'react';
import styles from './Header.module.scss';

export const Header = (props: React.ComponentProps<typeof Table.Header>) => (
    <Table.Header {...props} className={styles.Header} />
);
