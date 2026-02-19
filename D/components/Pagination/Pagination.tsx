import React from 'react';
import TitlePagination, { type TitlePaginationProps } from './components/TitlePagination/TitlePagination';
import ArrowPagination, { type ArrowPaginationProps } from './components/ArrowPagination/ArrowPagination';
import CompactPagination, { type CompactPaginationProps } from './components/CompactPagination/CompactPagination';

export type PaginationVariant = 'title' | 'arrow' | 'compact';

export type PaginationProps =
    | ({ variant: 'title' } & TitlePaginationProps)
    | ({ variant: 'arrow' } & ArrowPaginationProps)
    | ({ variant: 'compact' } & CompactPaginationProps);

const Pagination = (props: PaginationProps) => {
    const { variant, ...rest } = props;

    if (variant === 'title') return <TitlePagination {...(rest as TitlePaginationProps)} />;
    if (variant === 'arrow') return <ArrowPagination {...(rest as ArrowPaginationProps)} />;
    if (variant === 'compact') return <CompactPagination {...(rest as CompactPaginationProps)} />;

    return null;
};

export default Pagination;
