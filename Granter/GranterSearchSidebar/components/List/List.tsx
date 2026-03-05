import React from 'react';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarListProps = {
    children: React.ReactNode;
};

const List = ({ children }: GranterSearchSidebarListProps) => <div className={styles.List}>{children}</div>;

export default List;
