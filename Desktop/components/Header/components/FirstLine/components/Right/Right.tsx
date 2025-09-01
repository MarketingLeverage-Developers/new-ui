import React, { type ReactNode } from 'react';
import styles from './Right.module.scss';

type RightProps = {
    children: ReactNode;
};

export const Right = ({ children }: RightProps) => <div className={styles.Right}>{children}</div>;
