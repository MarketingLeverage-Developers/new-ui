// src/shared/primitives/BasicTable/BasicTable.tsx
import React from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';
import RowToggle from './components/RowToggle/RowToggle';
import classNames from 'classnames';
import { ColumnVisibilityControls } from './components/ColumnVisibilityControls/ColumnVisibilityControls';
import { Content } from './components/Content/Content';
import Flex from '../Flex/Flex';

type BasicTableProps<T> = React.ComponentProps<typeof AirTable<T>> & {
    height?: number;
    showGhost?: boolean;
    showColumnVisibilityControls?: boolean;
    showHeader?: boolean;

    /** ✅✅✅ 추가 */
    defaultExpandedRowKeys?: string[];
};

export const BasicTable = <T,>({
    height,
    showGhost = true,
    showColumnVisibilityControls = true,
    showHeader = true,
    style,
    defaultExpandedRowKeys = [],
    ...props
}: BasicTableProps<T>) => (
    <AirTable {...props} defaultExpandedRowKeys={defaultExpandedRowKeys}>
        <Flex justify="end" margin={{ b: 20 }}>
            {showColumnVisibilityControls && <ColumnVisibilityControls<T> />}
        </Flex>

        <AirTable.Container height={height} className={classNames(styles.container)}>
            {showHeader && <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />}

            <AirTable.Body
                className={classNames(styles.body)}
                rowClassName={styles.row}
                cellClassName={styles.cell}
                selectedCellClassName={styles.selected}
                detailRowClassName={styles.detailRow}
                detailCellClassName={styles.detailCell}
            />

            {showGhost && <AirTable.Ghost className={styles.ghost} />}
        </AirTable.Container>
    </AirTable>
);

BasicTable.RowToggle = RowToggle;
BasicTable.ColumnVisibilityControls = ColumnVisibilityControls;
BasicTable.Content = Content;
