// src/shared/primitives/ListTable/ListTable.tsx

import React from 'react';
import type { Column, FilterState, SortState } from '@/shared/headless/AirTable/AirTable';
import { BasicTable, type TableFilterItem } from '@/shared/primitives/BasicTable/BasicTable';

type ListTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKeyField?: string;
    defaultColWidth?: number;
    detailRenderer?: (params: { row: any; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, index: number) => React.CSSProperties;
    storageKey?: string;
    pinnedColumnKeys?: string[];
    getRowCanExpand?: (row: T, ri: number) => boolean;
    showHeader?: boolean;

    getExpandedRows?: (row: T, ri: number) => T[];
    getRowLevel?: (row: T, ri: number) => number;

    height?: number;
    defaultExpandedRowKeys?: string[];

    /** ✅✅✅ 필터 패널로 들어갈 items */
    filterItems?: TableFilterItem[];
    actions?: React.ReactNode;
    showExpandAllRowsButton?: boolean;
    enableAnimation?: boolean;
    onScrollElReady?: (el: HTMLDivElement | null) => void;

    pinnedHeaderBgColor?: string | ((colKey: string) => string | undefined);
    pinnedHeaderTextColor?: string | ((colKey: string) => string | undefined);

    sortState?: SortState;
    defaultSortState?: SortState;
    onSortChange?: (next: SortState) => void;
    sortMode?: 'internal' | 'external';

    filterState?: FilterState;
    defaultFilterState?: FilterState;
    onFilterChange?: (next: FilterState) => void;
    filterMode?: 'internal' | 'external';
    filterOptionsData?: T[];
};

export const ListTable = <T,>({
    data,
    columns,
    rowKeyField,
    defaultColWidth = 160,
    detailRenderer,
    getRowStyle,
    storageKey,
    pinnedColumnKeys = [],
    getRowCanExpand,
    showHeader = true,
    getExpandedRows,
    getRowLevel,
    height,
    defaultExpandedRowKeys = [],
    filterItems = [],
    actions,
    showExpandAllRowsButton = false,
    enableAnimation = false,
    onScrollElReady,
    pinnedHeaderBgColor,
    pinnedHeaderTextColor,
    sortState,
    defaultSortState,
    onSortChange,
    sortMode,
    filterState,
    defaultFilterState,
    onFilterChange,
    filterMode,
    filterOptionsData,
}: ListTableProps<T>) => (
    <BasicTable
        data={data}
        columns={columns}
        rowKeyField={rowKeyField as any}
        defaultColWidth={defaultColWidth}
        detailRenderer={detailRenderer}
        getRowStyle={getRowStyle}
        storageKey={storageKey}
        pinnedColumnKeys={pinnedColumnKeys}
        getRowCanExpand={getRowCanExpand}
        showHeader={showHeader}
        getExpandedRows={getExpandedRows}
        getRowLevel={getRowLevel}
        height={height}
        defaultExpandedRowKeys={defaultExpandedRowKeys}
        filterItems={filterItems} // ✅✅✅ 여기!
        actions={actions}
        showExpandAllRowsButton={showExpandAllRowsButton}
        enableAnimation={enableAnimation}
        onScrollElReady={onScrollElReady}
        pinnedHeaderBgColor={pinnedHeaderBgColor}
        pinnedHeaderTextColor={pinnedHeaderTextColor}
        sortState={sortState}
        defaultSortState={defaultSortState}
        onSortChange={onSortChange}
        sortMode={sortMode}
        filterState={filterState}
        defaultFilterState={defaultFilterState}
        onFilterChange={onFilterChange}
        filterMode={filterMode}
        filterOptionsData={filterOptionsData}
    />
);
