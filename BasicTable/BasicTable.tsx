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

    /** ✅ 컬럼 숨김/보이기 UI 표시 여부 */
    showColumnVisibilityControls?: boolean;

    /** ✅ 추가: 헤더 표시 여부 */
    showHeader?: boolean;
};

export const BasicTable = <T,>({
    maxBodyHeight,
    fullHeight = false,
    showGhost = true,
    showColumnVisibilityControls = true, // ✅ 기본값 true (기존 유지)
    showHeader = true, // ✅ 기본값 true (기존 유지)
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
            {/* ✅ 필요할 때만 렌더 */}
            {showColumnVisibilityControls && <ColumnVisibilityControls<T> portalId="column-select-box-portal" />}

            <AirTable.Container className={classNames(styles.container, fullHeight && styles.fullHeight)}>
                {/* ✅✅✅ 헤더도 옵션으로 숨길 수 있게 */}
                {showHeader && <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />}

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
BasicTable.Content = Content;
