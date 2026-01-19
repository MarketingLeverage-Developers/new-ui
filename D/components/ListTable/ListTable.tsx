// src/shared/primitives/ListTable/ListTable.tsx

import React from 'react';
import type { Column } from '@/shared/headless/AirTable/AirTable';
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
    />
);
