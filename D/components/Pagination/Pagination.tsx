import React from 'react';
import TitlePagination, { type TitlePaginationProps } from './components/TitlePagination/TitlePagination';

export type PaginationVariant = 'title';

export type PaginationProps = { variant: 'title' } & TitlePaginationProps;

const Pagination = (props: PaginationProps) => {
    const { variant, ...rest } = props;

    if (variant === 'title') return <TitlePagination {...(rest as TitlePaginationProps)} />;

    return null;
};

export default Pagination;
