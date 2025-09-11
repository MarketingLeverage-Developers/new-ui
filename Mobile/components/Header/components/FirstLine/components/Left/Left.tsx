import React from 'react';
import styles from './Left.module.scss';

type LeftProps = {
    children?: React.ReactNode;
};

export const Left = ({ children }: LeftProps) => <div className={styles.Left}>{children}</div>;
