import { useMemo } from 'react';
import type { Column, SortState } from '@/shared/headless/AirTable/AirTable';
import { collectSortConfig, sortDataByConfig } from '@/shared/headless/AirTable/AirTable';

type UseClientSortParams<T> = {
    items: T[];
    columns: Column<T>[];
    sortState: SortState;
};

export const useClientSort = <T,>({ items, columns, sortState }: UseClientSortParams<T>) => {
    const sortConfigByKey = useMemo(() => collectSortConfig(columns), [columns]);

    return useMemo(() => sortDataByConfig(items, sortState, sortConfigByKey), [items, sortState, sortConfigByKey]);
};
