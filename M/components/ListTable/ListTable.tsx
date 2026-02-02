// src/shared/viewport/Mobile/components/ListTable/ListTable.tsx (예시 경로)
import React from 'react';
import { BasicTable } from '@/shared/primitives/BasicTable/BasicTable'; // ✅ BasicTable import
import type { Column } from '@/shared/headless/AirTable/AirTable';

type ListTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKeyField?: string;
    defaultColWidth?: number;
    containerPaddingPx?: number;
    detailRenderer?: (params: { row: any; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, index: number) => { backgroundColor?: string };
    storageKey?: string;

    /** ✅✅✅ 추가: 고정할 컬럼 key들 */
    pinnedColumnKeys?: string[];
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
    pinnedColumnKeys = [],
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
            fullHeight={true}
            pinnedColumnKeys={pinnedColumnKeys}
        />
        {/* </Flex.Item> */}
    </>
);
