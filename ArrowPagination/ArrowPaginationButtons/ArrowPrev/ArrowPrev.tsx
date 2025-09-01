import type { Prev } from '@/shared/headless/Pagination/components';
import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import React from 'react';
import styles from '../ArrowPaginationButtons.module.scss';
import { IoIosArrowBack } from 'react-icons/io';

type ArrowPrev = Omit<React.ComponentProps<typeof Prev>, 'children'>;

const ArrowPrev = (props: ArrowPrev) => {
    const { hasPrevPage } = usePagination();

    const hasNoPrevPage = !hasPrevPage;

    const combinedClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoPrevPage,
    });

    return (
        <Pagination.Prev className={combinedClassName} {...props}>
            <IoIosArrowBack />
        </Pagination.Prev>
    );
};

export default ArrowPrev;
