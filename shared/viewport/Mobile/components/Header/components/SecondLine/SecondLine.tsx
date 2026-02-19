import React from 'react';
import styles from './SecondLine.module.scss';

type SecondLineProps = {
    children?: React.ReactNode;
};

export const SecondLine = ({ children }: SecondLineProps) => <div className={styles.SecondLine}>{children}</div>;
