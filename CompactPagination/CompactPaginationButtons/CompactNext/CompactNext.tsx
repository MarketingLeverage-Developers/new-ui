import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import styles from '../CompactPaginationButtons.module.scss';

type CompactNextProps = Omit<React.ComponentProps<typeof Pagination.Next>, 'children'>;

const CompactNext = (props: CompactNextProps) => {
    const { hasNextPage } = usePagination();

    const hasNoNextPage = !hasNextPage;

    const compactNextClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoNextPage,
    });

    return (
        <Pagination.Next className={compactNextClassName} {...props}>
            <IoIosArrowForward />
        </Pagination.Next>
    );
};

export default CompactNext;
