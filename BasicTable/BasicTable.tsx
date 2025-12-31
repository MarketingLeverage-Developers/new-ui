import React, { useMemo } from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';
import RowToggle from './components/RowToggle/RowToggle';
import classNames from 'classnames';
import { ColumnVisibilityControls } from './components/ColumnVisibilityControls/ColumnVisibilityControls';

type BasicTableProps<T> = React.ComponentProps<typeof AirTable<T>> & {
    maxBodyHeight?: number;
    fullHeight?: boolean;
    showGhost?: boolean;
};

export const BasicTable = <T,>({
    maxBodyHeight,
    fullHeight = false,
    showGhost = true,
    style, // ✅ props에서 style을 꺼냅니다.
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
            <ColumnVisibilityControls<T> portalId="column-select-box-portal" />

            <AirTable.Container className={classNames(styles.container, fullHeight && styles.fullHeight)}>
                <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />

                <AirTable.Body
                    className={classNames(styles.body)}
                    style={bodyStyle}
                    rowClassName={styles.row}
                    cellClassName={styles.cell}
                    selectedCellClassName={styles.selected}
                />

                {showGhost && <AirTable.Ghost className={styles.ghost} />}
            </AirTable.Container>
        </AirTable>
    );
};

BasicTable.RowToggle = RowToggle;
BasicTable.ColumnVisibilityControls = ColumnVisibilityControls;
