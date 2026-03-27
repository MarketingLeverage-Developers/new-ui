// src/shared/primitives/ListTable/ListTable.tsx

import React from 'react';
import type { Column, FilterState, SortState } from '../../../../headless/AirTable/AirTable';
import { BasicTable, type AirTableComponentLike, type TableFilterItem } from '../../../../../BasicTable/BasicTable';

type ListTableProps<T> = {
    airTableComponent?: AirTableComponentLike;
    data: T[];
    columns: Column<T>[];
    rowKeyField?: string;
    defaultColWidth?: number;
    detailRenderer?: (params: { row: any; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, index: number) => { backgroundColor?: string };
    storageKey?: string;
    pinnedColumnKeys?: string[];
    getRowCanExpand?: (row: T, ri: number) => boolean;
    showHeader?: boolean;
    getExpandedRows?: (row: T, ri: number) => T[];
    getRowLevel?: (row: T, ri: number) => number;
    height?: number;
    defaultExpandedRowKeys?: string[];
    persistExpandedRowKeys?: boolean;
    filterItems?: TableFilterItem[];
    actions?: React.ReactNode;
    showExpandAllRowsButton?: boolean;
    enableAnimation?: boolean;
    animationRowLimit?: number;
    enableVirtualization?: boolean;
    virtualRowHeight?: number;
    virtualOverscan?: number;

    /** ✅ 추가: 남는 폭 채우기 on/off */
    fillContainerWidth?: boolean;

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
    onScrollElReady?: (el: HTMLDivElement | null) => void;
};

export const ListTable = <T,>({
    airTableComponent,
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
    persistExpandedRowKeys = false,
    filterItems = [],
    actions,
    showExpandAllRowsButton = false,
    enableAnimation = false,
    animationRowLimit,
    enableVirtualization,
    virtualRowHeight,
    virtualOverscan,
    fillContainerWidth = true, // ✅ 기본값
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
    onScrollElReady,
}: ListTableProps<T>) => (
    <BasicTable
        airTableComponent={airTableComponent}
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
        persistExpandedRowKeys={persistExpandedRowKeys}
        filterItems={filterItems}
        actions={actions}
        showExpandAllRowsButton={showExpandAllRowsButton}
        enableAnimation={enableAnimation}
        animationRowLimit={animationRowLimit}
        enableVirtualization={enableVirtualization}
        virtualRowHeight={virtualRowHeight}
        virtualOverscan={virtualOverscan}
        fillContainerWidth={fillContainerWidth} // ✅ 전달
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
        onScrollElReady={onScrollElReady}
    />
);
