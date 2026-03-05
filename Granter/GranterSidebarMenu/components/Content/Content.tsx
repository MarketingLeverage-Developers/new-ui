import React from 'react';
import styles from '../../GranterSidebarMenu.module.scss';

export type GranterSidebarMenuContentProps = {
    children: React.ReactNode;
};

const Content = ({ children }: GranterSidebarMenuContentProps) => <nav className={styles.MenuNav}>{children}</nav>;

export default Content;
