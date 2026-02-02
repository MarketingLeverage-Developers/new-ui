import ArrowPagination from '@/shared/primitives/ArrowPagination/ArrowPagination';
import { InfiniteScrollTrigger } from '@/shared/primitives/InfiniteScrollTrigger/InfiniteScrollTrigger';

type ListPaginationMode = 'pagination' | 'infinite';

type Props = {
    total: number;
    totalPages?: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    mode?: ListPaginationMode;
    isLoading?: boolean;
    hasMore?: boolean;
    lastPageCount?: number;
};

export const ListPagination = ({
    total,
    totalPages,
    page,
    size,
    onChange,
    mode = 'pagination',
    isLoading = false,
    hasMore,
    lastPageCount,
}: Props) => {
    if (mode === 'infinite') {
        return (
            <InfiniteScrollTrigger
                total={total}
                totalPages={totalPages}
                page={page}
                size={size}
                onChange={onChange}
                isLoading={isLoading}
                hasMore={hasMore}
                lastPageCount={lastPageCount}
            />
        );
    }

    const handleChange = (next: { page: number; size: number; total: number }) => {
        onChange(next.page);
    };

    return (
        <ArrowPagination value={{ page, size, total }} onChange={handleChange}>
            <ArrowPagination.FastPrev />
            <ArrowPagination.Prev />
            <ArrowPagination.Pages />
            <ArrowPagination.Next />
            <ArrowPagination.FastNext />
        </ArrowPagination>
    );
};
