import React from 'react';
import styles from '../../GranterSidebarMenu.module.scss';

export type GranterSidebarMenuFooterProps = {
    children: React.ReactNode;
};

const Footer = ({ children }: GranterSidebarMenuFooterProps) => <div className={styles.Footer}>{children}</div>;

export default Footer;
