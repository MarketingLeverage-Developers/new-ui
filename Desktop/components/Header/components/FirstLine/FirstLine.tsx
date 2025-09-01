import React from 'react';
import { Left, Right } from './components';
import styles from './FirstLine.module.scss';

type FirstLineProps = {
    children?: React.ReactNode;
};

export const FirstLine = ({ children }: FirstLineProps) => <div className={styles.FirstLine}>{children}</div>;

FirstLine.Left = Left;
FirstLine.Right = Right;
