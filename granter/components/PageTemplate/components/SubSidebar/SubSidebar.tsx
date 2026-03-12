import React from 'react';
import styles from './SubSidebar.module.scss';

export type SubSidebarProps = {
    children?: React.ReactNode;
};

const SubSidebar = ({ children }: SubSidebarProps) => <aside className={styles.SubSidebar}>{children}</aside>;

export default SubSidebar;
