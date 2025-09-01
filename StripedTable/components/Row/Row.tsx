import Table from '@/shared/headless/Table/Table';
import React from 'react';
import styles from './Row.module.scss';

export const Row = (props: React.ComponentProps<typeof Table.Row>) => <Table.Row {...props} className={styles.Row} />;
