import React from 'react';
import type { Column, FilterState, SortState } from '@/shared/headless/AirTable/AirTable';
import { BasicTable, type TableFilterItem } from '@/shared/primitives/BasicTable/BasicTable';

type ListTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKeyField?: string;
    defaultColWidth?: number;
    detailRenderer?: (params: { row: any; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, index: number) => { backgroundColor?: string };
    storageKey?: string;
    pinnedColumnKeys?: string[];
    showHeader?: boolean;
    height?: number;
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
    showHeader = true,
    height,
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
        showHeader={showHeader}
        height={height}
        filterItems={filterItems}
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
