import { useMemo } from 'react';
import type { Column, FilterState } from '@/shared/headless/AirTable/AirTable';
import { collectSortConfig, filterDataByConfig } from '@/shared/headless/AirTable/AirTable';

type UseClientFilterParams<T> = {
    items: T[];
    columns: Column<T>[];
    filterState: FilterState;
};

export const useClientFilter = <T,>({ items, columns, filterState }: UseClientFilterParams<T>) => {
    const sortConfigByKey = useMemo(() => collectSortConfig(columns), [columns]);

    return useMemo(() => filterDataByConfig(items, filterState, sortConfigByKey), [items, filterState, sortConfigByKey]);
};
