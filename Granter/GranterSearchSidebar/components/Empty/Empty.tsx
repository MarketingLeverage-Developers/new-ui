import React from 'react';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarEmptyProps = {
    text?: React.ReactNode;
};

const Empty = ({ text = '데이터가 없습니다.' }: GranterSearchSidebarEmptyProps) => (
    <div className={styles.Empty}>{text}</div>
);

export default Empty;
