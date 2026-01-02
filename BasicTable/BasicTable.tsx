import React, { useMemo } from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';
import RowToggle from './components/RowToggle/RowToggle';
import classNames from 'classnames';
import { ColumnVisibilityControls } from './components/ColumnVisibilityControls/ColumnVisibilityControls';
import { Content } from './components/Content/Content';

type BasicTableProps<T> = React.ComponentProps<typeof AirTable<T>> & {
    maxBodyHeight?: number;
    fullHeight?: boolean;
    showGhost?: boolean;
    showColumnVisibilityControls?: boolean;
    showHeader?: boolean;
};

export const BasicTable = <T,>({
    maxBodyHeight,
    fullHeight = false,
    showGhost = true,
    showColumnVisibilityControls = true,
    showHeader = true,
    style,
    ...props
}: BasicTableProps<T>) => {
    const bodyStyle = useMemo(() => {
        if (!maxBodyHeight) return undefined;
        return {
            '--basic-table-body-max-height': `${maxBodyHeight}px`,
        } as React.CSSProperties;
    }, [maxBodyHeight]);

    return (
        <AirTable {...props}>
            {showColumnVisibilityControls && <ColumnVisibilityControls<T> portalId="column-select-box-portal" />}

            <AirTable.Container className={classNames(styles.container, fullHeight && styles.fullHeight)}>
                {showHeader && <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />}

                <AirTable.Body
                    className={classNames(styles.body)}
                    style={bodyStyle}
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
};

BasicTable.RowToggle = RowToggle;
BasicTable.ColumnVisibilityControls = ColumnVisibilityControls;
BasicTable.Content = Content;
