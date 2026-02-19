import React from 'react';
import classNames from 'classnames';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Pagination, { type PaginationValueType, usePagination } from '../../../../../shared/headless/Pagination/Pagination';
import styles from './CompactPagination.module.scss';

export type CompactPaginationProps = React.ComponentProps<typeof Pagination> & {
    className?: string;
};

type CompactPrevProps = Omit<React.ComponentProps<typeof Pagination.Prev>, 'children'>;

const CompactPrev = ({ className, ...props }: CompactPrevProps) => {
    const { hasPrevPage } = usePagination();

    return (
        <Pagination.Prev
            {...props}
            className={classNames(styles.PagingButton, !hasPrevPage && styles.Disabled, className)}
        >
            <IoIosArrowBack />
        </Pagination.Prev>
    );
};

type CompactNextProps = Omit<React.ComponentProps<typeof Pagination.Next>, 'children'>;

const CompactNext = ({ className, ...props }: CompactNextProps) => {
    const { hasNextPage } = usePagination();

    return (
        <Pagination.Next
            {...props}
            className={classNames(styles.PagingButton, !hasNextPage && styles.Disabled, className)}
        >
            <IoIosArrowForward />
        </Pagination.Next>
    );
};

type CompactPagesProps = React.HTMLAttributes<HTMLDivElement> & {
    onPagesClick?: (paginationValue: PaginationValueType) => void;
};

const CompactPages = ({ className }: CompactPagesProps) => {
    const { value } = usePagination();
    const { page, total, size } = value;
    const totalPage = Math.max(1, Math.ceil(total / size));

    return (
        <div className={classNames(styles.CompactPages, className)}>
            <span>{page}</span>
            <span>/ {totalPage}</span>
        </div>
    );
};

const CompactPaginationButtons = () => (
    <>
        <CompactPrev />
        <CompactPages />
        <CompactNext />
    </>
);

type CompactPaginationCompound = React.FC<CompactPaginationProps> & {
    Prev: typeof CompactPrev;
    Next: typeof CompactNext;
    Pages: typeof CompactPages;
    PagingButtons: typeof CompactPaginationButtons;
};

const CompactPaginationRoot: React.FC<CompactPaginationProps> = ({ className, children, ...props }) => (
    <Pagination {...props}>
        <div className={classNames(styles.CompactPagination, className)}>
            {children ?? <CompactPaginationButtons />}
        </div>
    </Pagination>
);

const CompactPagination = Object.assign(CompactPaginationRoot, {
    Prev: CompactPrev,
    Next: CompactNext,
    Pages: CompactPages,
    PagingButtons: CompactPaginationButtons,
}) as CompactPaginationCompound;

export default CompactPagination;
