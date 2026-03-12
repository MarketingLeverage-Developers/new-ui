import React from 'react';
import styles from './Sidebar.module.scss';

export type SidebarProps = {
    children?: React.ReactNode;
};

const Sidebar = ({ children }: SidebarProps) => <aside className={styles.Sidebar}>{children}</aside>;

export default Sidebar;
