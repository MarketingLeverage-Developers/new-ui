import ArrowPagination from '@/shared/primitives/ArrowPagination/ArrowPagination';

type Props = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
};

export const ListPagination = ({ total, page, size, onChange }: Props) => {
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
