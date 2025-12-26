import React from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';

export const BasicTable = <T,>(props: React.ComponentProps<typeof AirTable<T>>) => (
    <AirTable {...props}>
        <AirTable.Container className={styles.container}>
            <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />
            <AirTable.Body
                className={styles.body}
                rowClassName={styles.row}
                cellClassName={styles.cell}
                selectedCellClassName={styles.selected}
            />
            <AirTable.Ghost className={styles.ghost} />
        </AirTable.Container>
    </AirTable>
);
