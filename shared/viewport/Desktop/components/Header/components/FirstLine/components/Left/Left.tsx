import React, { type ReactNode } from 'react';
import styles from './Left.module.scss';

type LeftProps = {
    children?: ReactNode;
};

export const Left = ({ children }: LeftProps) => <div className={styles.Left}>{children}</div>;
