import React, { type ReactNode } from 'react';
import styles from './ThirdLine.module.scss';

type ThirdLineProps = {
    children?: ReactNode;
};

export const ThirdLine = ({ children }: ThirdLineProps) => <div className={styles.ThirdLine}>{children}</div>;
