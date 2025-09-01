import { usePagination, type PaginationValueType } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import styles from '../ArrowPaginationButtons.module.scss';
import React from 'react';

type ArrowPagesProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onPagesClick?: (paginationValue: PaginationValueType) => void;
};

const ArrowPages = ({ onPagesClick, ...props }: ArrowPagesProps) => {
    const { value, setPage, endPage, startPage, maxPageButtons } = usePagination();
    const { page } = value;

    const handlePages = (PagesValue: number) => {
        const newPageValue = setPage(PagesValue);
        onPagesClick && onPagesClick(newPageValue);
    };

    return (
        <>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                const currentPage = startPage + index;
                const isActive = currentPage === page;

                const combinedClassName = classNames(styles.PagingButton, {
                    [styles.Active]: isActive,
                });
                return (
                    <button
                        key={`${currentPage}-${maxPageButtons}`}
                        onClick={() => handlePages(currentPage)}
                        disabled={isActive}
                        className={combinedClassName}
                        {...props}
                    >
                        {currentPage}
                    </button>
                );
            })}
        </>
    );
};

export default ArrowPages;
