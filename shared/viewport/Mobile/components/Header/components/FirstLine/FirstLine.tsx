import React from 'react';
import styles from './FirstLine.module.scss';
import { Left } from './components/Left/Left';
import { Right } from './components/Right/Right';

type FirstLineProps = {
    children?: React.ReactNode;
};

export const FirstLine = ({ children }: FirstLineProps) => <div className={styles.FirstLine}>{children}</div>;

FirstLine.Left = Left;
FirstLine.Right = Right;
