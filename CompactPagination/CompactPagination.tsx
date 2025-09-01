import React from 'react';
import styles from './CompactPagination.module.scss';
import Pagination from '@/shared/headless/Pagination/Pagination';
import CompactPaginationButtons from './CompactPaginationButtons/CompactPaginationButtons';
import CompactPrev from './CompactPaginationButtons/CompactPrev/CompactPrev';
import CompactNext from './CompactPaginationButtons/CompactNext/CompactNext';
import CompactPages from './CompactPaginationButtons/CompactPages/CompactPages';

type CompactPaginationProps = React.ComponentProps<typeof Pagination>;

const CompactPagination = ({ ...props }: CompactPaginationProps) => (
    <Pagination {...props}>
        <div className={styles.CompactPagination}>{props.children}</div>
    </Pagination>
);

export default CompactPagination;

CompactPagination.Prev = CompactPrev;
CompactPagination.Next = CompactNext;
CompactPagination.Pages = CompactPages;
CompactPagination.PagingButtons = CompactPaginationButtons;
