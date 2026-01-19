import React from 'react';
import styles from './FilterLine.module.scss';

type FilterLineProps = {
    children?: React.ReactNode;
};

export const FilterLine = ({ children }: FilterLineProps) => <div className={styles.FilterLine}>{children}</div>;
