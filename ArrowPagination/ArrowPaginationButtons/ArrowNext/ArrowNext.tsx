import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import React from 'react';
import styles from '../ArrowPaginationButtons.module.scss';
import type { Next } from '@/shared/headless/Pagination/components';
import { IoIosArrowForward } from 'react-icons/io';

type ArrowNextProps = Omit<React.ComponentProps<typeof Next>, 'children'>;

const ArrowNext = (props: ArrowNextProps) => {
    const { hasNextPage } = usePagination();

    const hasNoNextPage = !hasNextPage;

    const combinedClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoNextPage,
    });

    return (
        <Pagination.Next className={combinedClassName} {...props}>
            <IoIosArrowForward />
        </Pagination.Next>
    );
};

export default ArrowNext;
