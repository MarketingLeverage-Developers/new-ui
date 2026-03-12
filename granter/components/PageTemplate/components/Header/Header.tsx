import React from 'react';
import styles from './Header.module.scss';

export type HeaderProps = {
    children?: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => <header className={styles.Header}>{children}</header>;

export default Header;
