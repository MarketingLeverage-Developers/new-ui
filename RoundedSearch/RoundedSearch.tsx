import React, { type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './RoundedSearch.module.scss';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';

type RoundedSearchProps = {
    width?: CSSLength;
    divProps?: React.HTMLAttributes<HTMLDivElement>;
} & InputHTMLAttributes<HTMLInputElement>;

const RoundedSearch = ({ width, divProps, ...inputProps }: RoundedSearchProps) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
    };

    const roundedSearchClassName = classNames(styles.RoundedSearch, {});

    return (
        <div {...divProps} className={roundedSearchClassName} style={{ ...cssVariables, ...divProps?.style }}>
            <HiMiniMagnifyingGlass className={styles.MagnifyIcon} />
            <input {...inputProps} className={styles.Input} />
        </div>
    );
};

export default RoundedSearch;
