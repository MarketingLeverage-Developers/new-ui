import React from 'react';
import styles from './Right.module.scss';

type RightProps = {
    children?: React.ReactNode;
};

export const Right = ({ children }: RightProps) => <div className={styles.styles}>{children}</div>;
