import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import styles from '../ArrowPaginationButtons.module.scss';
import React from 'react';
import type { FastNext } from '@/shared/headless/Pagination/components';
import { RxDoubleArrowRight } from 'react-icons/rx';

type ArrowFastNextProps = Omit<React.ComponentProps<typeof FastNext>, 'children'>;

const ArrowFastNext = (props: ArrowFastNextProps) => {
    const { hasFastNextPage } = usePagination();

    const hasNoNextPage = !hasFastNextPage;

    const combinedClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoNextPage,
    });

    return (
        <Pagination.FastNext className={combinedClassName} {...props}>
            <RxDoubleArrowRight style={{ strokeWidth: 0.6 }} />
        </Pagination.FastNext>
    );
};

export default ArrowFastNext;
