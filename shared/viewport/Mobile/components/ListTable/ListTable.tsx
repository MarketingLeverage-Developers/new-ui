// src/shared/viewport/Mobile/components/ListTable/ListTable.tsx (예시 경로)
import React from 'react';
import { BasicTable } from '../../../../../BasicTable/BasicTable'; // ✅ BasicTable import
import type { Column, FilterState, SortState } from '../../../../headless/AirTable/AirTable';

type ListTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKeyField?: string;
    defaultColWidth?: number;
    containerPaddingPx?: number;
    detailRenderer?: (params: { row: any; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, index: number) => { backgroundColor?: string };
    storageKey?: string;
    height?: number;
    onScrollElReady?: (el: HTMLDivElement | null) => void;

    /** ✅✅✅ 추가: 고정할 컬럼 key들 */
    pinnedColumnKeys?: string[];

    pinnedHeaderBgColor?: string | ((colKey: string) => string | undefined);
    pinnedHeaderTextColor?: string | ((colKey: string) => string | undefined);

    enableAnimation?: boolean;
    animationRowLimit?: number;
    enableVirtualization?: boolean;
    virtualRowHeight?: number;
    virtualOverscan?: number;

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
    containerPaddingPx = 0,
    detailRenderer,
    getRowStyle,
    storageKey,
    height,
    onScrollElReady,
    pinnedColumnKeys = [],
    pinnedHeaderBgColor,
    pinnedHeaderTextColor,
    enableAnimation = false,
    animationRowLimit,
    enableVirtualization,
    virtualRowHeight,
    virtualOverscan,
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
    <>
        {/* ✅ BasicTable로 교체하여 간결화 */}
        {/* <Flex.Item flex={1} style={{ minHeight: 0 }}> */}
        <BasicTable
            data={data}
            columns={columns}
            rowKeyField={rowKeyField as any}
            defaultColWidth={defaultColWidth}
            detailRenderer={detailRenderer}
            getRowStyle={getRowStyle}
            storageKey={storageKey}
            height={height}
            pinnedColumnKeys={pinnedColumnKeys}
            pinnedHeaderBgColor={pinnedHeaderBgColor}
            pinnedHeaderTextColor={pinnedHeaderTextColor}
            enableAnimation={enableAnimation}
            animationRowLimit={animationRowLimit}
            enableVirtualization={enableVirtualization}
            virtualRowHeight={virtualRowHeight}
            virtualOverscan={virtualOverscan}
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
        {/* </Flex.Item> */}
    </>
);
