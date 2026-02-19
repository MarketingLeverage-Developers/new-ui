import React from 'react';
import styles from './Header.module.scss';
import { FirstLine, SecondLine } from './components';
import PublicPageHeaderContent from './components/PublicPageHeaderContent/PublicPageHeaderContent';
import { Line } from './components/Line/Line';

type HeaderProps = {
    children?: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => (
    <header id="header" className={styles.header}>
        {children}
    </header>
);

Header.FirstLine = FirstLine;
Header.SecondLine = SecondLine;

Header.PublicPageHeaderContent = PublicPageHeaderContent;
Header.Line = Line;
