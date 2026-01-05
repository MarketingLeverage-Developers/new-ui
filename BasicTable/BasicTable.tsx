import React from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';
import RowToggle from './components/RowToggle/RowToggle';
import classNames from 'classnames';
import { ColumnVisibilityControls } from './components/ColumnVisibilityControls/ColumnVisibilityControls';
import { Content } from './components/Content/Content';

type BasicTableProps<T> = React.ComponentProps<typeof AirTable<T>> & {
    height?: number;
    // fullHeight?: boolean;
    showGhost?: boolean;
    showColumnVisibilityControls?: boolean;
    showHeader?: boolean;
};

export const BasicTable = <T,>({
    height,
    // fullHeight = false,
    showGhost = true,
    showColumnVisibilityControls = true,
    showHeader = true,
    style,
    ...props
}: BasicTableProps<T>) => (
    // const tableStyle: React.CSSProperties = {
    //     ...style,
    //     ...(height ? { height } : {}), // ✅✅✅ AirTable wrapper에도 적용
    // };

    <AirTable {...props}>
        {showColumnVisibilityControls && <ColumnVisibilityControls<T> portalId="column-select-box-portal" />}

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
