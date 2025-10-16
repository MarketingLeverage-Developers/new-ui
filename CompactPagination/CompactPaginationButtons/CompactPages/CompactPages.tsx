import { usePagination, type PaginationValueType } from '@/shared/headless/Pagination/Pagination';
import React from 'react';
import styles from '../CompactPaginationButtons.module.scss';

type CompactPagesProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onPagesClick?: (paginationValue: PaginationValueType) => void;
};

const CompactPages = ({ onPagesClick, ...props }: CompactPagesProps) => {
    const { value, setPage } = usePagination();
    const { page, total, size } = value;

    const totalPage = Math.max(1, Math.ceil(total / size));

    // const handlePages = (PagesValue: number) => {
    //     const newPageValue = setPage(PagesValue);
    //     onPagesClick && onPagesClick(newPageValue);
    // };
    return (
        <div className={styles.CompactPages}>
            <span>{page}</span> <span>/ {totalPage}</span>
        </div>
    );
};

export default CompactPages;
