import React from 'react';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarCountProps = {
    totalCount?: number;
};

const Count = ({ totalCount }: GranterSearchSidebarCountProps) =>
    typeof totalCount === 'number' ? <p className={styles.Count}>총 {totalCount}개</p> : null;

export default Count;
