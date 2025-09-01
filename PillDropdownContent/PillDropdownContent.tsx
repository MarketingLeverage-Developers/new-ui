import React from 'react';
import styles from './PillDropdownContent.module.scss';
import { Item } from './components';

type PillDropdownContentProps = {
    children: React.ReactNode;
};

const PillDropdownContent = ({ children }: PillDropdownContentProps) => (
    <div className={styles.ProfileDropdownContent}>{children}</div>
);

export default PillDropdownContent;

PillDropdownContent.Item = Item;
