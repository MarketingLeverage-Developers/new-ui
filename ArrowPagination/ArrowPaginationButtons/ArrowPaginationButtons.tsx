import ArrowPagination from '../ArrowPagination';
import { type PaginationValueType } from '@/shared/headless/Pagination/Pagination';

type ArrowPaginationButtonsProps = {
    onPagingButtonClick: (paginationValue: PaginationValueType) => void;
};

const ArrowPaginationButtons = ({ onPagingButtonClick }: ArrowPaginationButtonsProps) => {
    const handleButtonClic = (paginationValue: PaginationValueType) => {
        onPagingButtonClick(paginationValue);
        // console.log('실행');
    };
    return (
        <>
            <ArrowPagination.FastPrev onFastPrevClick={handleButtonClic} />

            <ArrowPagination.Prev onPrevClick={handleButtonClic} />

            <ArrowPagination.Pages onPagesClick={handleButtonClic} />

            <ArrowPagination.Next onNextClick={handleButtonClic} />

            <ArrowPagination.FastNext onFastNextClick={handleButtonClic} />
        </>
    );
};

export default ArrowPaginationButtons;
