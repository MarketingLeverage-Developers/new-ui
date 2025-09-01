import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import styles from '../ArrowPaginationButtons.module.scss';
import React from 'react';
import type { FastPrev } from '@/shared/headless/Pagination/components';
import { RxDoubleArrowLeft } from 'react-icons/rx';

type ArrowFastPrevProps = Omit<React.ComponentProps<typeof FastPrev>, 'children'>;

const ArrowFastPrev = (props: ArrowFastPrevProps) => {
    const { hasFastPrevPage } = usePagination();

    const hasNoFastPrevPage = !hasFastPrevPage;

    const combinedClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoFastPrevPage,
    });

    return (
        <Pagination.FastPrev className={combinedClassName} {...props}>
            <RxDoubleArrowLeft style={{ strokeWidth: 0.6 }} />
        </Pagination.FastPrev>
    );
};

export default ArrowFastPrev;
