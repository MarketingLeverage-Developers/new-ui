import React from 'react';
import styles from './ThirdLine.module.scss';

type ThirdLineProps = {
    children?: React.ReactNode;
};

export const ThirdLine = ({ children }: ThirdLineProps) => <div className={styles.ThirdLine}>{children}</div>;
