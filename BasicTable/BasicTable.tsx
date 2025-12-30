// src/shared/primitives/BasicTable/BasicTable.tsx
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
    ...props
}: BasicTableProps<T>) => {
    const bodyStyle = useMemo(() => {
        if (!maxBodyHeight) return undefined;

        return {
            '--basic-table-body-max-height': `${maxBodyHeight}px`,
        } as React.CSSProperties;
    }, [maxBodyHeight]);

    return (
        <AirTable {...props} style={{ display: 'flex', height: '100%' }}>
            {/* ✅✅✅ 여기 추가: AirTable Context 안에서 렌더해야 portal로 쏠 수 있음 */}

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
