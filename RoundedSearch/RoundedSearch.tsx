import React, { type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './RoundedSearch.module.scss';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';

type RoundedSearchProps = {
    width?: CSSLength;
} & InputHTMLAttributes<HTMLInputElement>;

const RoundedSearch = ({ width, ...props }: RoundedSearchProps) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
    };

    const roundedSearchClassName = classNames(styles.RoundedSearch, {});

    return (
        <div {...props} className={roundedSearchClassName} style={{ ...cssVariables, ...props.style }}>
            <HiMiniMagnifyingGlass className={styles.MagnifyIcon} />
            <input {...props} className={styles.Input} />
        </div>
    );
};

export default RoundedSearch;
