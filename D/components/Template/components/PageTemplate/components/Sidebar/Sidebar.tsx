import React from 'react';
import styles from './Sidebar.module.scss';

type SidebarProps = {
    children: React.ReactNode;
};

export const Sidebar = ({ children }: SidebarProps) => <aside className={styles.sidebar}>{children}</aside>;
