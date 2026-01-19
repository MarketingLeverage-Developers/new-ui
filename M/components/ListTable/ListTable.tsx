// src/shared/viewport/Mobile/components/ListTable/ListTable.tsx (예시 경로)
import React from 'react';
import { BasicTable } from '@/shared/primitives/BasicTable/BasicTable'; // ✅ BasicTable import
import type { Column } from '@/shared/headless/AirTable/AirTable';

// type InfiniteScrollConfig = {
//     enabled: boolean;
//     total: number;
//     page: number;
//     size: number;
//     onLoadMore: (page: number) => void;
//     isLoading?: boolean;
// };

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
    // 1. 무한 스크롤용 데이터 누적 로직
    // const [accumulatedData, setAccumulatedData] = useState<T[]>([]);

    // useEffect(() => {
    //     if (!infiniteScroll?.enabled) {
    //         setAccumulatedData(data);
    //         return;
    //     }

    //     if (infiniteScroll.page === 1) {
    //         setAccumulatedData(data);
    //     } else {
    //         setAccumulatedData((prev) => {
    //             const newItems = data.filter((newItem) => {
    //                 if (rowKeyField) {
    //                     return !prev.some(
    //                         (prevItem) => (prevItem as any)[rowKeyField] === (newItem as any)[rowKeyField]
    //                     );
    //                 }
    //                 return !prev.some((prevItem) => JSON.stringify(prevItem) === JSON.stringify(newItem));
    //             });
    //             return [...prev, ...newItems];
    //         });
    //     }
    // }, [data, infiniteScroll?.page, infiniteScroll?.enabled, rowKeyField]);

    // const displayData = infiniteScroll?.enabled ? accumulatedData : data;

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

        {/* 무한 스크롤 트리거 */}
        {/* {infiniteScroll?.enabled && displayData.length > 0 && (
                <InfiniteScrollTrigger
                    total={infiniteScroll.total}
                    page={infiniteScroll.page}
                    size={infiniteScroll.size}
                    onChange={infiniteScroll.onLoadMore}
                    isLoading={infiniteScroll.isLoading}
                />
            )} */}
    </>
);
