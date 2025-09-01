import Pagination from '@/shared/headless/Pagination/Pagination';
import styles from './ArrowPagination.module.scss';
import React from 'react';
import ArrowPrev from './ArrowPaginationButtons/ArrowPrev/ArrowPrev';
import ArrowNext from './ArrowPaginationButtons/ArrowNext/ArrowNext';
import ArrowFastPrev from './ArrowPaginationButtons/ArrowFastPrev/ArrowFastPrev';
import ArrowFastNext from './ArrowPaginationButtons/ArrowFastNext/ArrowFastNext';
import ArrowPaginationButtons from './ArrowPaginationButtons/ArrowPaginationButtons';
import ArrowPages from './ArrowPaginationButtons/ArrowPages/ArrowPages';

type ArrowPaginationProps = React.ComponentProps<typeof Pagination>;

const ArrowPagination = ({ ...props }: ArrowPaginationProps) => (
    <Pagination {...props}>
        <div className={styles.ArrowPagination}>{props.children}</div>
    </Pagination>
);

export default ArrowPagination;

ArrowPagination.Prev = ArrowPrev;
ArrowPagination.Next = ArrowNext;
ArrowPagination.Pages = ArrowPages;
ArrowPagination.FastPrev = ArrowFastPrev;
ArrowPagination.FastNext = ArrowFastNext;
ArrowPagination.PagingButtons = ArrowPaginationButtons;
