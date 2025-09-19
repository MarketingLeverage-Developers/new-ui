import React from 'react';
import styles from './SubSidebar.module.scss';

type SubSidebarProps = {
    children: React.ReactNode;
};

export const SubSidebar = ({ children }: SubSidebarProps) => (
    <aside className={styles.SubSidebar}>
        <div className={styles.SubSidebarWrapper}>{children}</div>
    </aside>
);
