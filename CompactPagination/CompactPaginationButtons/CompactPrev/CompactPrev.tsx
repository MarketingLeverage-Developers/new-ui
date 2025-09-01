import Pagination, { usePagination } from '@/shared/headless/Pagination/Pagination';
import classNames from 'classnames';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import styles from '../CompactPaginationButtons.module.scss';

type CompactPrevProps = Omit<React.ComponentProps<typeof Pagination.Prev>, 'children'>;

const CompactPrev = (props: CompactPrevProps) => {
    const { hasPrevPage } = usePagination();

    const hasNoPrevPage = !hasPrevPage;

    const compactPrevClassName = classNames(styles.PagingButton, {
        [styles.Disabled]: hasNoPrevPage,
    });

    return (
        <Pagination.Prev className={compactPrevClassName} {...props}>
            <IoIosArrowBack />
        </Pagination.Prev>
    );
};

export default CompactPrev;
