import ArrowPagination from '@/shared/primitives/ArrowPagination/ArrowPagination';
import { InfiniteScrollTrigger } from '@/shared/primitives/InfiniteScrollTrigger/InfiniteScrollTrigger';

type ListPaginationMode = 'pagination' | 'infinite';

type Props = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    mode?: ListPaginationMode;
    isLoading?: boolean;
};

export const ListPagination = ({ total, page, size, onChange, mode = 'pagination', isLoading = false }: Props) => {
    if (mode === 'infinite') {
        return (
            <InfiniteScrollTrigger total={total} page={page} size={size} onChange={onChange} isLoading={isLoading} />
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
