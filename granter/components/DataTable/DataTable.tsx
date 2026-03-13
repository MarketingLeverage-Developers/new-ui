import React from 'react';
import classNames from 'classnames';
import type { Column, FilterState, SortState } from '../../../shared/headless/AirTable/AirTable';
import AirTable from '../../../shared/headless/AirTable/AirTable';
import Text from '../Text/Text';
import styles from './DataTable.module.scss';

export type DataTablePersistedState = {
    columnWidths: Record<string, number>;
    columnOrder: string[];
    visibleColumnKeys: string[];
    knownColumnKeys: string[];
    pinnedColumnKeys?: string[];
};

export type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKeyField: keyof T;
    height?: number | string;
    onScrollElReady?: (el: HTMLDivElement | null) => void;
    defaultColWidth?: number;
    storageKey?: string;
    onPersistedStateChange?: (state: DataTablePersistedState) => void;
    persistedStateSyncVersion?: number;
    showColumnVisibilityControl?: boolean;
    defaultSortState?: SortState;
    sortState?: SortState;
    onSortChange?: (next: SortState) => void;
    sortMode?: 'internal' | 'external';
    filterState?: FilterState;
    onFilterChange?: (next: FilterState) => void;
    filterMode?: 'internal' | 'external';
    filterOptionsData?: T[];
    fillContainerWidth?: boolean;
    enableVirtualization?: boolean;
    virtualRowHeight?: number;
    virtualOverscan?: number;
    enableAnimation?: boolean;
    animationRowLimit?: number;
    detailRenderer?: (params: { row: T; ri: number }) => React.ReactNode;
    getRowCanExpand?: (row: T, ri: number) => boolean;
    getRowStyle?: (row: T, index: number) => React.CSSProperties;
    emptyText?: React.ReactNode;
    className?: string;
    headerClassName?: string;
    headerCellClassName?: string;
    bodyClassName?: string;
    rowClassName?: string;
    rowSelectedClassName?: string;
    cellClassName?: string;
    selectedCellClassName?: string;
    activeCellClassName?: string;
    ghostClassName?: string;
    emptyStateClassName?: string;
};

const DataTable = <T,>({
    data,
    columns,
    rowKeyField,
    height = 520,
    onScrollElReady,
    defaultColWidth = 120,
    storageKey,
    onPersistedStateChange,
    persistedStateSyncVersion,
    showColumnVisibilityControl = true,
    defaultSortState,
    sortState,
    onSortChange,
    sortMode = 'internal',
    filterState,
    onFilterChange,
    filterMode = 'internal',
    filterOptionsData,
    fillContainerWidth = true,
    enableVirtualization = false,
    virtualRowHeight,
    virtualOverscan,
    enableAnimation = false,
    animationRowLimit,
    detailRenderer,
    getRowCanExpand,
    getRowStyle,
    emptyText = '조건에 맞는 내역이 없습니다.',
    className,
    headerClassName,
    headerCellClassName,
    bodyClassName,
    rowClassName,
    rowSelectedClassName,
    cellClassName,
    selectedCellClassName,
    activeCellClassName,
    ghostClassName,
    emptyStateClassName,
}: DataTableProps<T>) => (
    <div className={classNames(styles.Shell, className)}>
        <AirTable<T>
            data={data}
            columns={columns}
            rowKeyField={rowKeyField}
            defaultColWidth={defaultColWidth}
            storageKey={storageKey}
            onPersistedStateChange={onPersistedStateChange}
            persistedStateSyncVersion={persistedStateSyncVersion}
            showColumnVisibilityControl={showColumnVisibilityControl}
            defaultSortState={defaultSortState}
            sortState={sortState}
            onSortChange={onSortChange}
            sortMode={sortMode}
            filterState={filterState}
            onFilterChange={onFilterChange}
            filterMode={filterMode}
            filterOptionsData={filterOptionsData}
            fillContainerWidth={fillContainerWidth}
            enableVirtualization={enableVirtualization}
            virtualRowHeight={virtualRowHeight}
            virtualOverscan={virtualOverscan}
            enableAnimation={enableAnimation}
            animationRowLimit={animationRowLimit}
            detailRenderer={detailRenderer}
            getRowCanExpand={getRowCanExpand}
            getRowStyle={getRowStyle}
        >
            <AirTable.Container className={styles.Container} height={height} onScrollElReady={onScrollElReady}>
                <AirTable.Header
                    className={classNames(styles.Header, headerClassName)}
                    headerCellClassName={classNames(styles.HeaderCell, headerCellClassName)}
                />

                {data.length > 0 ? (
                    <AirTable.Body
                        className={classNames(styles.Body, bodyClassName)}
                        rowClassName={classNames(styles.Row, rowClassName)}
                        rowSelectedClassName={classNames(styles.RowSelected, rowSelectedClassName)}
                        cellClassName={classNames(styles.Cell, cellClassName)}
                        selectedCellClassName={classNames(styles.CellSelected, selectedCellClassName)}
                        activeCellClassName={classNames(styles.CellActive, activeCellClassName)}
                    />
                ) : (
                    <div className={classNames(styles.EmptyState, emptyStateClassName)}>
                        {typeof emptyText === 'string' ? (
                            <Text size="md" tone="muted">
                                {emptyText}
                            </Text>
                        ) : (
                            emptyText
                        )}
                    </div>
                )}

                <AirTable.Ghost className={classNames(styles.Ghost, ghostClassName)} />
            </AirTable.Container>
        </AirTable>
    </div>
);

export default DataTable;
