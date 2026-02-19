import React from 'react';
import styles from './Header.module.scss';
import { FirstLine, SecondLine, ThirdLine, Line } from './components/index';

type HeaderProps = {
    children?: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => <header className={styles.Header}>{children}</header>;

Header.FirstLine = FirstLine;
Header.SecondLine = SecondLine;
Header.ThirdLine = ThirdLine;
Header.Line = Line;
