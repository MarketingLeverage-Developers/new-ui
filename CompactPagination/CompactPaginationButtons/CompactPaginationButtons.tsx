import React from 'react';
import CompactPagination from '../CompactPagination';
import type { PaginationValueType } from '@/shared/headless/Pagination/Pagination';

type CompactPaginationButtonsProps = {
    onPagingButtonClick: (paginationValue: PaginationValueType) => void;
};

const CompactPaginationButtons = ({ onPagingButtonClick }: CompactPaginationButtonsProps) => {
    const handleButtonClic = (paginationValue: PaginationValueType) => {
        onPagingButtonClick(paginationValue);
    };
    return (
        <>
            <CompactPagination.Prev onPrevClick={handleButtonClic} />
            <CompactPagination.Pages onPagesClick={handleButtonClic} />
            <CompactPagination.Next onNextClick={handleButtonClic} />
        </>
    );
};

export default CompactPaginationButtons;
