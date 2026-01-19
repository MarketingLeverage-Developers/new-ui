import React, { type ReactNode } from 'react';
import styles from './FilterLine.module.scss';

type FilterLineProps = {
    children?: ReactNode;
};

export const FilterLine = ({ children }: FilterLineProps) => <div className={styles.FilterLine}>{children}</div>;
