import { useMemo } from 'react';

type UseClientPaginationParams<T> = {
    items: T[];
    page: number;
    size: number;
    defaultSize?: number;
};

type ClientPaginationResult<T> = {
    items: T[];
    total: number;
    totalPages: number;
    page: number;
    size: number;
};

export const useClientPagination = <T,>({
    items,
    page,
    size,
    defaultSize = 20,
}: UseClientPaginationParams<T>): ClientPaginationResult<T> =>
    useMemo(() => {
        const safeSize = Number.isFinite(size) && size > 0 ? size : defaultSize;
        const total = items.length;
        const totalPages = Math.max(1, Math.ceil(total / safeSize));
        const safePage = Math.min(Math.max(1, Number.isFinite(page) ? page : 1), totalPages);
        const start = (safePage - 1) * safeSize;
        const end = start + safeSize;
        const paginatedItems = items.slice(start, end);

        return {
            items: paginatedItems,
            total,
            totalPages,
            page: safePage,
            size: safeSize,
        };
    }, [defaultSize, items, page, size]);
